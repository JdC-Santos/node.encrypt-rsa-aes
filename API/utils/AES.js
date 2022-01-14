var CryptoJS = require('node-cryptojs-aes').CryptoJS;

const encrypt = (dados, AESKey) => {
  // se os dados forem um JSON, transforma em string
  if (typeof dados === 'object') dados =  JSON.stringify(dados);

  // retorna os dados encriptados
  return CryptoJS.AES.encrypt(dados, AESKey).toString();  
}

const decrypt = (text, AESKey) => {
  return CryptoJS.AES.decrypt(text, AESKey).toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encrypt,
  decrypt
}