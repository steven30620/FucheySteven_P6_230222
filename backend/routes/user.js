const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("./../middleware/auth");
const rateLimit = require("./../middleware/rateLimit");
// const MaskData = require("./../middleware/maskData");
//toutes les route concernant les user de l'API

router.post("/signup", rateLimit, userCtrl.signup);
router.post("/login", rateLimit, userCtrl.login);

module.exports = router;
