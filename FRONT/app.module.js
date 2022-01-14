angular.module('App', [
  "cryptService",
  "publicKeyService",
  'messageService'
])
.config(['$httpProvider', function ($httpProvider) {

  // adiciona o service que encripta e decripta o request e response
  $httpProvider.interceptors.push('crypt');
}]);