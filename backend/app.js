const express = require("express"); //tout les module nécéssaire au fonctionement de l'api
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const multer = require("multer");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config();
const limiter = require("./middleware/rateLimit");
// const maskData = require("./middleware/maskData");

mongoose //module permettant la connexion a mongoose
	.connect(
		"mongodb+srv://" +
			process.env.DB_USER + //on sécurise la connexion en ne gardant oas dans le code les info privé
			":" +
			process.env.DB_PASS +
			"@" +
			process.env.DB_ClusterNAME +
			".4yuc7.mongodb.net/" +
			process.env.DB_ClusterNAME,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
	//modèle de la requêtre gérant le CORS
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

app.use(express.static("./public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(limiter);
// app.use(maskData);

module.exports = app;
