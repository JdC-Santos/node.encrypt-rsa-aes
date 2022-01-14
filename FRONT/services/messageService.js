angular.module('messageService', [])
.service('messageService', function($http, API) {
  var service = {};

  service.sendPOST = function(dados) {
    return $http.post(API + '/message', dados);
  }

  service.sendGET = function(dados) {
    return $http.get(API + '/message', { params: dados });
  }

  return service;
});