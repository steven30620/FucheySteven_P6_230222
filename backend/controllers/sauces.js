const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const otherFields = {
		dislikes: 0,
		likes: 0,
		usersLiked: [],
		usersDisliked: [],
		imageUrl: "http://localhost:3000/" + req.file.path.replace("\\", "/"),
	};
	const sauceJson = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		...sauceJson,
		...otherFields,
	});

	sauce
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
	Sauce.findOne({
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
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			console.log(sauce.imageUrl);
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() =>
						res.status(200).json({ message: "Objet supprimé !" })
					)
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.setLike = async (req, res, next) => {
	const likeStatus = req.body.like;
	const userId = req.body.userId;
	const sauceId = req.params.id;
	const oldSauce = await Sauce.findById({ _id: sauceId });

	if (likeStatus == 1 && oldSauce.userLiked.indexOf(userId) == -1) {
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
		_id: sauceId,
		likes: oldSauce.userLiked.length,
		userLiked: oldSauce.userLiked,
		dislikes: oldSauce.userDisliked.length,
		userDisliked: oldSauce.userDisliked,
	});

	Sauce.updateOne({ _id: sauceId }, newSauce)
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
