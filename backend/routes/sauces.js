const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces");
const multer = require("./../middleware/multer-config");
const auth = require("./../middleware/auth");
const rateLimit = require("./../middleware/rateLimit");

//toutes les routes sauces de l'API, contien les midleware auth pour que ce sois sécurisé.
router.get("/", rateLimit, auth, saucesCtrl.getAllSauces);
router.post("/", rateLimit, auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", rateLimit, auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", rateLimit, auth, saucesCtrl.deleteSauce);
router.post("/:id/like", rateLimit, auth, saucesCtrl.setLike);

module.exports = router;
