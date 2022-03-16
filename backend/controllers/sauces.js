const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	//création d'une sauce avec initialisation des likes et dislike et de leurs tableaux
	const otherFields = {
		dislikes: 0,
		likes: 0,
		usersLiked: [],
		usersDisliked: [],
		imageUrl: "http://localhost:3000/" + req.file.path.replace("\\", "/"), //ajout de l'image dans la base de données
	};
	const sauceJson = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		// création d'un nouvel objet sauce avec tout les champs correspondant
		...sauceJson,
		...otherFields,
	});

	sauce //enregistrement de la sauce dans la base de données
		.save()
		.then(() => {
			res.status(201).json({
				message: "Sauce saved successfully!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.getOneSauce = (req, res, next) => {
	//recherche d'une sauce dans la BdD
	Sauce.findOne({
		// recherche de la sauce qui correspond a l'id de la sauce séléctionné
		_id: req.params.id,
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};
exports.modifySauce = (req, res, next) => {
	// modifie la sauce séléctioné
	const sauceObject = req.file // si une image est ratacher a la sauce, on la recherche dans la base de donné pour la supprimer et ajouter la nouvelle
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };

	Sauce.updateOne(
		//recherche la sauce qui dois être modifié et remplace son objet par le nouveau
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	// trouve la sauce séléctionné et la supprime
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				//methode permettant la suppression de l'image de la BdD
				Sauce.deleteOne({ _id: req.params.id }) //suppression de la sauce qui correspond a l'id de la requête de la BdD
					.then(() =>
						res.status(200).json({ message: "Objet supprimé !" })
					)
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	//récupération de toute les sauces de la BdD pour les afficher sur la pages
	Sauce.find() // find retourne une promesse,
		.then((sauces) => {
			res.status(200).json(sauces); //retourne le tableau des sauces renvoyé par la méthode find
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.setLike = async (req, res, next) => {
	// fonction qui gère les likes
	const likeStatus = req.body.like; // on récupère les info des likes de la sauce
	const userId = req.body.userId; //on récupère l'id de l'user qui like
	const sauceId = req.params.id; //on récupère l'id de la sauce liké
	const oldSauce = await Sauce.findById({ _id: sauceId }); //on attend la réponse de l'id correspondante dans la BdD

	if (likeStatus == 1 && oldSauce.userLiked.indexOf(userId) == -1) {
		// si l'utilisateur like la sauce et qu
		const userIndex = oldSauce.userDisliked.indexOf(userId);
		if (userIndex != -1) {
			oldSauce.userDisliked.splice(userIndex, 1);
		}
		oldSauce.userLiked.push(userId);
	} else if (likeStatus == -1 && oldSauce.userLiked.indexOf(userId) == -1) {
		const userIndex = oldSauce.userLiked.indexOf(userId);
		if (userIndex != -1) {
			oldSauce.userLiked.splice(userIndex, 1);
		}
		oldSauce.userDisliked.push(userId);
	} else if (likeStatus == 0) {
		const userIndex = oldSauce.userDisliked.indexOf(userId);
		if (userIndex != -1) {
			oldSauce.userDisliked.splice(userIndex, 1);
		} else {
			const userIndex = oldSauce.userLiked.indexOf(userId);
			if (userIndex != -1) {
				oldSauce.userLiked.splice(userIndex, 1);
			}
		}
	}

	const newSauce = new Sauce({
		//remlpace les information des like dans la sauce
		_id: sauceId,
		likes: oldSauce.userLiked.length,
		userLiked: oldSauce.userLiked,
		dislikes: oldSauce.userDisliked.length,
		userDisliked: oldSauce.userDisliked,
	});

	Sauce.updateOne({ _id: sauceId }, newSauce) //modifie les info dans la BdD de la sauce
		.then(() => {
			res.status(201).json({
				message: "Sauce updated successfully!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};
