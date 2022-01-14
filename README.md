# Repositório para estudar sobre criptografia.

## Anotações: 

  - criptografia simétrica: são sistemas que utilizam a mesma chave para encriptar e desencriptar uma informação.
    A criptografia AES é simétrica.

  - criptografia assimétrica (ou criptografia de chave publica): é qualquer sistema que use um par de chaves, uma publica para encriptar e uma privada para desencriptar.
  A criptografia RSA é um sistema de criptografia assimétrico.

  - o RSA é um algoritmo mais lento se comparado com outros lento e por isso é utilizado para encriptar chaves assimétricas, alem disso ele nao consegue encriptar uma grande quantidade de dados.

  ### O fluxo da criptografia deste projeto:
  1. Ao clicar no botão "enviar" é gerada uma nova chave aleatória para a cripografia AES.
  2. A chave AES é salva em um objeto que armazena as chaves dos requests, para que seja possivel decriptar o response.
  3. Cada chave AES tem um ID que é utilizado para recupera-lá no response, e depois para deleta-lá.
  4. A mensagem é encriptada com o AES utilizando a chave aleatoria gerada (AESKey).
  5. A chave aleatória gerada (AESKey) é encriptada utilizando a chave RSA publica.
  6. O texto encriptado por AES e chave encriptada por  RSA são enviados para a API junto do ID da chave AES.
  7. Quando o request for via GET, o texto também é encriptado com encodeURI, para evitar problemas com os caracteres "/" e "+".
  8. Na API a chave privada RSA decripta a chave AES que foi gerada no FRONT.
  9. Com a chave AES decriptada, a API decripta o os dados do FRONT.
  10. A API monta o retorno e encripta utilizando a chave AES e envia a resposta junto do ID da chave AES.
  11. O FRONT decripta a resposta utilizando a chave AES, utilizando o ID que a API retornou para poder identificar qual chave deve ser utilizada.
  12. O FRONT deleta a chave AES utilizada no request/response baseado no ID.
  13. Segue o fluxo normal da aplicação.