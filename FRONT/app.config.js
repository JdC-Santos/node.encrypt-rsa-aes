angular.module('App')
.constant('API','http://localhost:3355')
.constant('encrypt', {
  'AESSecret': 'batatinha 123',
  'iterations': 1000,
  'keySize': 128 / 32
})
.constant('PUPLIC_KEY_REQUEST_INTERVAL', 1000 * 300) // faz a requisição para uma nova chave publica a daca 5min
;