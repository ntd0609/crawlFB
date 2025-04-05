const CryptoJS = require("crypto-js");
const decrypt = (data,secret_key) => {
	var decrypt_data = CryptoJS.AES.decrypt({
		ciphertext: CryptoJS.enc.Base64.parse(data),
		salt: ""
	}, CryptoJS.enc.Base64.parse(secret_key), {
		iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8);

	return decrypt_data;
}
const encrypt = (data,secret_key) => {
	var encrypt_data = CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse(secret_key), {
		iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	}).ciphertext.toString(CryptoJS.enc.Base64)

	return encrypt_data;
};
module.exports = {encrypt,decrypt};