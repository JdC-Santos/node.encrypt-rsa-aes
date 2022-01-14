const AES = require('../utils/AES');
const RSA = require('../utils/RSA');
const { isJSON } = require('../utils/helper');

module.exports = (req, res, next) => {

  function decrypt(data, enc_id) {

    // transforma o ID do request em data para pegar a data da requisição
    var dtReq = new Date(parseInt(enc_id));

    // separ ao texto encriptado da chave AES encriptada
    data = data.split('.');

    // decripta a chave AES com base na data do ENC_ID
    const AESKey = RSA.decrypt({ text: data[1], year: dtReq.getFullYear(), month: dtReq.getMonth() });

    // salva a chave AES para utiliza-lá no response
    res.AESKey = AESKey;

    // decripta os dados com a chave AES.
    let dados = AES.decrypt(data[0], AESKey);
    
    // se for a string de um JSON, converte
    if(isJSON(dados)) dados = JSON.parse(dados);

    // retorna os dados decriptados
    return dados;
  }

  // recupera o campo CODE para retorna-lo futuramente
  if (req.body.enc || req.query.enc) req.enc_id = req.body.enc_id ? req.body.enc_id : req.query.enc_id;

  // se o request for encriptado e o campo CODE estiver vazio, retorna uma mensagem de erro
  if ((req.body.enc || req.query.enc) && !req.enc_id) return res.json({success: false, message: 'Request incorreto, informe o campo ENC_ID para requests encriptados'});

  // se houver conteudo encriptado no body, decripta e retorna o conteudo original para o body
  if (req.body.enc) req.body = decrypt(req.body.enc, req.enc_id);

  // se houver conteudo encriptado na url, decripta e retorna o conteudo original para os params
  if (req.query.enc) req.query = decrypt(decodeURI(req.query.enc), req.enc_id);

  next();
}