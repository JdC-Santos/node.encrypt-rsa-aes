const NodeRSA = require('node-rsa');
const path    = require('path');
const fs      = require("fs");

const generateKeyPair = (dir, bitLength) => {
  try {
    const key = new NodeRSA({b: bitLength});

    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    // se o diretorio nao existir, cria
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    
    // salva a chave publica em um arquivo .pem
    fs.writeFileSync( dir + '/RSA-public-key.pem', publicKey);
    
    // salva a chave privada em um arquivo .pem
    fs.writeFileSync( dir + '/RSA-private-key.pem', privateKey);

    // retorna a chave publica
    return publicKey;
  } catch(e) {
    throw e;
  }
}

module.exports = {
  generateKeyPair
}