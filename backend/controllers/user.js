const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const MaskData = require("maskdata");
//maskdata is a Node.js module to mask various kinds of data. With the help of maskdata, you can mask email, phone number, card number, JSON fields, password etc..
const emailMaskOptions = {
	maskWith: "*",
	unmaskedStartCharactersBeforeAt: 1,
	unmaskedEndCharactersAfterAt: 2,
	maskAtTheRate: false,
};

exports.login = (req, res, next) => {
	User.findOne({
		email: MaskData.maskEmail2(req.body.email, emailMaskOptions),
	})
		.then((user) => {
			if (!user) {
				return res
					.status(401)
					.json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt //module qui vas comparer le mot de passe hashé
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res
							.status(401)
							.json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							//fonction sign prend 2 argument
							{ userId: user._id }, // premier argument est ce que l'on veux encoder, ici c'est l'identifiant, pour être sur que la requête correspond a l'user ID
							"RANDOM_TOKEN_SECRET82qsd28qsd5qs7d764gfdgljkuqsf51dfg6571sdf35qsfpougjousodf", //le deuxième argument est la clée secret pour l'encodage,
							{ expiresIn: "24h" } // chaque token dure 24h
						),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.signup = (req, res, next) => {
	const email = MaskData.maskEmail2(req.body.email, emailMaskOptions);

	bcrypt // création d'un mot de passe hashé
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: email,
				password: hash,
			});
			user.save()
				.then(() =>
					res.status(201).json({ message: "Utilisateur créé !" })
				)
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
