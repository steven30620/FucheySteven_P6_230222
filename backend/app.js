const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const multer = require("multer");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config();

mongoose
	.connect(
		"mongodb+srv://" +
			process.env.DB_USER +
			":" +
			process.env.DB_PASS +
			"@clustertest.4yuc7.mongodb.net/clusterTest",
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

app.use(express.static("./public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
