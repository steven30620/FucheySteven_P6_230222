const jwt = require("jsonwebtoken");

req.auth = { userId };

module.exports = (req, res, next) => {
	try {
		console.log(req.body.userId);
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		console.log("invalid request auth");
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};