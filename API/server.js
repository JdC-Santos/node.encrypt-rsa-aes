require('dotenv').config();

const cryptMiddleware =  require('./middlewares/cryptMiddleware');
const RSA     = require('./utils/RSA');
const AES     = require('./utils/AES');
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());

app.use(express.urlencoded({ extended: true}))
app.use(express.json());

app.get('/get-public-key', (req, res) => {
  try {
    // recupera a chave publica do mes atual
    const publicKey = RSA.getPublicKey();
    
    res.json({ success: true, key: publicKey });
  } catch(e) {
    res.json({success: false, message: 'Erro ao recuperar a chave publica.', error: e.message});
  }
});

// requisições com o body encriptado
app.post('/message', cryptMiddleware, (req, res) => {
  try {
    // recebe normalmente os dados após o middleware decriptar
    const { message } = req.body;

    // encripta a resposta
    const text = AES.encrypt({ success: true, message: `mensagem encriptada: ${message}` }, res.AESKey);

    // retorna os dados encriptados e o campo CODE para que o FRONT possa identificar qual chave deve usar para decriptar esta response
    res.json({enc: text, enc_id: req.enc_id});
  } catch(e) {
    console.log(e);
    res.json({success: false, message: 'Ops, ocorreu um erro no servidor.', error: e.message});
  }
});

// requisições com os parametros da URL encriptados
app.get('/message', cryptMiddleware, (req, res) => {
  try {

    // recebe normalmente os dados após o middleware decriptar
    const { message } = req.query;

    // encripta a resposta
    const text = AES.encrypt({ success: true, message: `mensagem encriptada: ${message}` }, res.AESKey);

    // retorna os dados encriptados e o campo CODE para que o FRONT possa identificar qual chave deve usar para decriptar esta response
    res.json({enc: text, enc_id: req.enc_id});
  } catch(e) {
    console.log(e);
    res.json({success: false, message: 'Ops, ocorreu um erro no servidor.', error: e.message});
  }
});

app.listen(process.env.PORT,() => {
  console.log(`ouvindo na porta ${process.env.PORT}`);
});