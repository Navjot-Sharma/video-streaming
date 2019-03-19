var request = require('request');
var qs = require('querystring');

module.exports = function(data, body){
	console.log('function entered');
  var streams = String(body.url_encoded_fmt_stream_map).split(',');

	for(var i = 0; i < streams.length; i++){
		var stream = qs.parse(streams[i]);
		// if(String(stream.type).indexOf(data.type) > -1){
			return function(res){
				console.log('times', i);
				request(stream.url).pipe(res);
			};
		// }
	}

	//No streams can be found with the format specified
	//Return an error message
	// return function(res){
	// 	res.end("No compatable streams can be found!");
	// };
};
