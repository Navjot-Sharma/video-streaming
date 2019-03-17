var url = require('url');
var qs = require('querystring');
var request = require('request');
const router = require('express')();

const normal = require('./normal');
const normaltest = require('./normaltest');


router.get('', (req, res) => {
  var data = url.parse(req.url,true).query;
  data.type = data.type || 'video/mp4';

  request('http://www.youtube.com/get_video_info?video_id=LPhqL4DqzBg',(err, response, body) => {
		if(!err && response.statusCode === 200){

			body = qs.parse(body);
      console.log('Requesting video "%s"',body.title);

      normal(data, body)(res);

      // var streams = String(body.url_encoded_fmt_stream_map).split(',');

	    // for(var i = 0; i < streams.length; i++){
		  //   var stream = qs.parse(streams[i]);
		  //   if(String(stream.type).indexOf(data.type) > -1){
			// 	  request(stream.url).pipe(res);
      //     // normaltest(stream)(res);
		  //   }
	    // }


		}
		else {
			// An error happened, end the connection.
			console.log('Error getting video metadata: ',err);
			res.end();
		}
	});

});







module.exports = router;
