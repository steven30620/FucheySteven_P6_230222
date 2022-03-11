const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
	//chaque sauces contiendras les information suivantes
	userId: { type: String, require: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, required: true },
	dislikes: { type: Number, required: true },
	userLiked: [String],
	userDisliked: [String],
});

module.exports = mongoose.model("sauce", sauceSchema);
