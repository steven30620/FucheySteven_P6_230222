const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
	console.log(req.file)
	const otherFields = { dislikes : 0, likes : 0, usersLiked : [], usersDisliked : [], imageUrl : 'http://localhost:3000/' + req.file.path };
	const sauceJson = JSON.parse(req.body.sauce);

	const sauce = new Sauce({
		...sauceJson, ...otherFields
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

exports.getOneThing = (req, res, next) => {
	Thing.findOne({
		_id: req.params.id,
	})
		.then((thing) => {
			res.status(200).json(thing);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};

exports.modifyThing = (req, res, next) => {
	const thing = new Thing({
		_id: req.params.id,
		title: req.body.title,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		price: req.body.price,
		userId: req.body.userId,
	});
	Thing.updateOne({ _id: req.params.id }, thing)
		.then(() => {
			res.status(201).json({
				message: "Thing updated successfully!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.deleteThing = (req, res, next) => {
	Thing.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({
				message: "Deleted!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
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
