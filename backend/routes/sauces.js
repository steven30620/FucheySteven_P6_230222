const express = require('express')
const router = express.Router()
const saucesCtrl = require('../controllers/sauces')
const upload = require('./../middleware/upload.js')

router.get('/', saucesCtrl.getAllSauces)
router.post('/', upload, saucesCtrl.createSauce)
// router.get("/:id", saucesCtrl.getOneSauce);
// router.put("/:id", saucesCtrl.modifySauce);
// router.delete("/:id", saucesCtrl.deleteSauce);

module.exports = router
