const MaskData = require("maskdata");
//maskdata is a Node.js module to mask various kinds of data. With the help of maskdata, you can mask email, phone number, card number, JSON fields, password etc..
const emailMaskOptions = {
	maskWith: "*",
	unmaskedStartCharactersBeforeAt: 1,
	unmaskedEndCharactersAfterAt: 2,
	maskAtTheRate: false,
};

module.exports = emailMaskOptions;
