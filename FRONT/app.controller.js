angular.module('App')
.controller('Ctrl', function ($scope, publicKeyService, messageService ) {
  
  // chama o service que atualiza a chave RSA publica
  publicKeyService.get();

  $scope.sendPOST = function () {
    messageService.sendPOST({ message: $scope.messagePost })
      .then(function (res) {
        if (!res.data.success) throw Error('Erro ao enviar mensagem');
        $scope.respostaPost = res.data.message;
      })
      .catch(function (e) {
        console.log(e);
      })
  }

  $scope.sendGET = function () {
    messageService.sendGET({ message: $scope.messageGet })
      .then(function (res) {
        if (!res.data.success) throw Error('Erro ao enviar mensagem');
        $scope.respostaGet = res.data.message;
      })
      .catch(function (e) {
        console.log(e);
      })
  }
})