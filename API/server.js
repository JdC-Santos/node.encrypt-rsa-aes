const { generateKeyPair } = require('./utils/RSA');
const express = require('express');
const app     = express();

app.get('/generate-key-pair', (req, res) => {
  try {
    const publicKey = generateKeyPair('cert', 1048);

    res.json({ success: true, data: publicKey });
  } catch(e) {
    console.log(e);
    res.send('ERRO: ' + e.message);
  }
});

app.post('/', function(req, res) {
  try {

  } catch(e) {
    console.log(e);
    res.send('erro: '+ e.message);
  }
});

app.get('/', function(req, res) {
  try {

  } catch(e) {
    console.log(e);
    res.send('erro: '+ e.message);
  }
});

app.listen(3399,() => {  
  // const key = new NodeRSA({b: 2048});

  // var publicDer = key.exportKey('public');
  // var privateDer = key.exportKey('private');

  // console.log(publicDer)
  // console.log(privateDer);

  // const key = new NodeRSA('-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----');

  
  // key.setOptions({encryptionScheme: 'pkcs1'});
  // const decrypted = key.decrypt(text, 'utf8');
  // console.log('decrypted: ', decrypted);

  // console.log(decrypted);
    
  console.log('ouvindo na porta 3399');
});