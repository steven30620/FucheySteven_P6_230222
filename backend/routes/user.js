const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("./../middleware/auth");
const rateLimit = require("./../middleware/rateLimit");

//toutes les route concernant les user de l'API

router.post("/signup", auth, userCtrl.signup);
router.post("/login", rateLimit, auth, userCtrl.login);

module.exports = router;
