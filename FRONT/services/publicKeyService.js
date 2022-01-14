angular.module('publicKeyService', [])
.service('publicKeyService', function($http, API, PUPLIC_KEY_REQUEST_INTERVAL) {
  var service = {};
  
  // função que recupera a chave publca da API
  function getPublicKey() {
    $http.get(API + '/get-public-key')
    .then(function (res) {
      if (!res.data.success) throw new Error('Não foi possivel recuperar a chave publica');
      localStorage.setItem('publicKey', res.data.key);
    })
    .catch(function (e) {
      console.log(e);
    });
  }

  service.get = function() {
    // recupera a chave publica pela primeira vez
    getPublicKey();

    // atualiza a chave em um certo intervalo
    setInterval( getPublicKey, PUPLIC_KEY_REQUEST_INTERVAL);
  }

  return service;
});