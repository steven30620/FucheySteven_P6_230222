const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
var multer = require('multer');
var upload = multer();
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

mongoose
	.connect(
		"mongodb+srv://steven:testtest@clustertest.4yuc7.mongodb.net/clusterTest",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use(express.static('./public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
