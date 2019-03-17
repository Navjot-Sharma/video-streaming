const request = require("request");
const router = require("express")();
const qs = require("querystring");


router.get("", (req, res) => {
  try {
    const url = 'http://www.youtube.com/get_video_info?video_id=LPhqL4DqzBg';
    // const url = 'https://youtube.com/embed/LPhqL4DqzBg';
    console.log('try');
    const r = request(
      url, (err, response, body) => {
        if (err | response.statusCode !== 200)  throw new Error('something went wrong', err);

        body = qs.parse(body);
        if(body.status.indexOf('ok') == -1){
          res.end(body.reason);
        }

        console.log('status', response.statusCode);
        console.log('body status', body.status);
        console.log('title', body.title);

        var streams = String(body.url_encoded_fmt_stream_map).split(',');
      	for(var i = 0; i < streams.length; i++){
          console.log('loop', i);
      		var stream = qs.parse(streams[i]);

          console.log(stream.quality);
    			console.log('stream url', stream.url);

          console.log('this works');
          if (i === 0) {
            res.writeHead(200, {
              'Content-Type': 'video/mp4'
            })
          }
          request(stream.url + '&signature=' + (stream.sig || stream.s)).pipe(res);
        }


    });

    // res.writeHead(200, {
    //   'Content-Type': 'video/mp4'
    // });
    // req.pipe(r);
    // r.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
