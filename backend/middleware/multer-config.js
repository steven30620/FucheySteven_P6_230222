const multer = require("multer");

const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

const storage = multer.diskStorage({
	//storage comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
	destination: (req, file, callback) => {
		callback(null, "images"); // destination indique où multer dois enregistrer les images
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension); //a fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
	},
});

module.exports = multer({ storage: storage }).single("image"); //exporte ensuite l'élément multer entièrement configuré, en lui passant notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
