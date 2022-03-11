const jwt = require("jsonwebtoken"); // Permet l'authentification de chaque requête

module.exports = (req, res, next) => {
	try {
		//permet de gérer toute les erreur du block authentification
		const token = req.headers.authorization.split(" ")[1]; // on récupère le token dans le header,le tableau nous retourne deux éléments, on choisis donc le 2e élement qu'es le token
		const decodedToken = jwt.verify(
			//utilise jtw, la fonction vérify le token, premier argument est le token, et le deuxième argument est la clée secrète
			token,
			"RANDOM_TOKEN_SECRET82qsd28qsd5qs7d764gfdgljkuqsf51dfg6571sdf35qsfpougjousodf" // dois correspondre à la clée dans la fonction login
		);
		const userId = decodedToken.userId; //une fois décodé celà devien un objet Js classique donc on peut récupéré le user Id a l'interieur
		if (req.body.userId && req.body.userId !== userId) {
			// si un user id est présent dans le corp de la requête on le compare à celui du token, si il est diférent on rejette la requete avec une erreur
			throw "Invalid user ID";
		} else {
			next(); // sinon on au prochain midleware
		}
	} catch {
		console.log("invalid request auth");
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};
