const request = require('request');

module.exports = function(stream){
  return function(res) {
    request(stream.url).pipe(res);
  }
};
