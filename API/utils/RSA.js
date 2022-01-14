require('dotenv').config();
const crypto  = require('crypto');
const NodeRSA = require('node-rsa');
const path    = require('path');
const fs      = require("fs");

const dir = path.join(__dirname, '../cert');

// gera um par de chaves RSA baseadas no mes e ano e retorna a chave publica
const generateKeyPair = () => {
  try {
    const key = new NodeRSA({b: process.env.RSA_BIT_LENGTH });

    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    // se o diretorio nao existir, cria
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const date = new Date();
    
    // monta o prefixo do nome das chaves baseado no mes e ano
    const prefixname = (date.getMonth() + 1) + '-' + date.getFullYear();
    
    //salva a chave publica em um arquivo .pem
    fs.writeFileSync(`${dir}/${prefixname}-public-key.pem`, publicKey);
    
    //salva a chave privada em um arquivo .pem
    fs.writeFileSync(`${dir}/${prefixname}-private-key.pem`, privateKey);

    // retorna a chave publica
    return publicKey;
  } catch(e) {
    throw e;
  }
}

// recupera a chave publica, se ela nao existir, cria
const getPublicKey = () => {
  try {
    const date = new Date();

    // monta o prefixo do nome das chaves baseado no mes-ano
    const prefixname = (date.getMonth() + 1) + '-' + date.getFullYear();

    // se a chave do mes atual nao existir, cria a chave do mes atual
    if (!fs.existsSync(`${dir}/${prefixname}-public-key.pem`)) generateKeyPair();

    // retorna a chave publica do mes atual
    return fs.readFileSync(`${dir}/${prefixname}-public-key.pem`).toString();
  } catch(e) {
    throw e;
  }
}

const encrypt = (data) => {
  try {
    const date = new Date();
    // monta o prefixo do nome da chave RSA baseado no mes e ano
    const prefixname = (date.getMonth() + 1) + '-' + date.getFullYear();

    // recupera a chave publica RSA
    const publicKey = fs.readFileSync(`${dir}/${prefixname}-public-key.pem`).toString();
    
    // retorna os dados encriptados
    return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString("base64");
  } catch(e) {
    throw e;
  }
}

const decrypt = (data) => {
  try {
    const {text, year = false, month = false} = data;
    const date = new Date();

    // monta o prefixo do nome da chave RSA baseada no mes e ano
    const prefixname = (((month ? month : date.getMonth()) + 1) + '-' + (year ? year: date.getFullYear()));
    
    // recupera a chave RSA privada
    const privateKey = fs.readFileSync(`${dir}/${prefixname}-private-key.pem`).toString();
    
    // instancia um novo objeto definindo a chave RSA
    const key = new NodeRSA(privateKey);
    
    // define o esquema de encriptação
    key.setOptions({encryptionScheme: 'pkcs1'});

    // retorna o texto decriptado
    return key.decrypt(text, 'utf8');
  } catch(e) {
    throw e;
  }
}

module.exports = {
  generateKeyPair,
  getPublicKey,
  encrypt,
  decrypt
}