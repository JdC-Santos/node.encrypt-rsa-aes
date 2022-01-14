const AES = require('../utils/AES');

// verifica se uma string percente a um JSON
const isJSON = (string) => {
  try {
    
    if (string === null) return false;

    const strToJson = JSON.parse(string);

    return (typeof strToJson === 'object');
  } catch(e) {
    return false;
  }
}

module.exports = {
  isJSON
}