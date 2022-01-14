/**
 * ENC: após encriptar os dados, define tanto para o body quanto para o params o atributo "enc"
 * que é o que a API vai usar para identificar se os dados da requisição estão vindo encriptados ou não.
 */
angular.module('cryptService', [])
.service('crypt', ['API','encrypt', function (API, encrypt) {
  var service  = {};

  // objeto que irá armazenar as chaves AES das requisições;
  var AESRequestKeys = {};
  var RSAPublicKey  = '';

  // gera uma chave AES aleatoria
  function generateKey() {
    var salt = CryptoJS.lib.WordArray.random(128/8);
    return (CryptoJS.PBKDF2(encrypt.AESSecret, salt, { keySize: encrypt.keySize, iterations: encrypt.iterations })).toString();
  }

  function _encrypt(data, enc_id) {

    // encripta os dados com a chave aleatoria AES.
    data = CryptoJS.AES.encrypt(data, AESRequestKeys[enc_id]).toString();
    
    var RSAEncrypter = new JSEncrypt();
    RSAEncrypter.setPublicKey(RSAPublicKey);

    // retorna os addos encriptados com AES e a chave AES encriptada com RSA
    return data + '.' + RSAEncrypter.encrypt(AESRequestKeys[enc_id]);
  }

  // todas as requisições irão passar por aqui.
  service.request = function (config) {

    // se a requisição for para pegar a chave publica, retorna o config do request normalmente
    if (config.url == API +'/get-public-key') return config;

    // código unico que irá identificar qual chave deve ser utilizada na decriptação do response
    var enc_id = new Date().getTime();

    // salvando a chave em um objeto para ser recuperada no response
    AESRequestKeys[enc_id] = generateKey();

    // recuperando a chave publica RSA
    RSAPublicKey  = localStorage.getItem('publicKey');
    
    // se existir data no body...
    if (config.data) {
      // se o conteudo do body for um JSON, transforma em string
      if (typeof config.data == 'object') config.data = JSON.stringify(config.data);
      
      // salva os dados encriptados na config do request
      config.data = {enc: _encrypt(config.data, enc_id), enc_id: enc_id }
    }

    // se existir parametros na request, encripta, quando for via GET o request é encriptado com encodeURI também
    // para evitar erros no lado do servidor com alguns caracteres, exemplo "/" e "+"
    if (config.params) config.params = {enc: encodeURI(_encrypt(JSON.stringify(config.params), enc_id)), enc_id: enc_id };

    // retornando o config encriptado e com o código identificador
    return config;
  };

  // todas as respostas com sucesso (200 e por ai), passarão por aqui
  service.response = function (res) {

    // se existir um conteudo na response e ele for encriptado
    if(res.data && res.data.enc) {

      // recupera o code da resposta para encontrar a chave para decriptar a resposta
      var enc_id =  res.data.enc_id;

      // decripta o conteudo  
      var decrypted = (CryptoJS.AES.decrypt(res.data.enc, AESRequestKeys[enc_id])).toString(CryptoJS.enc.Utf8);

      // remove a chave já usada do objeto
      delete AESRequestKeys[enc_id];

      // salva o conteudo decriptaod na resposta
      res.data = JSON.parse(decrypted);
    }

    return res;
  };

  return service;
}]);