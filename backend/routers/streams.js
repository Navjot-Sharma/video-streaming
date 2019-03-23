const qs = require("querystring");
const request = require("request");
const router = require("express")();

router.get("/:videoId", (req, res) => {
  try {
    request(
      "http://www.youtube.com/get_video_info?video_id=" + req.params.videoId,
      (err, response, body) => {
        if (err || response.statusCode !== 200) {
          throw new Error("Server error");
        }
        body = qs.parse(body);

        const streams = String(body.url_encoded_fmt_stream_map).split(",");

        const stream = qs.parse(streams[0]);
        request(stream.url).pipe(res);
      }
    );
  } catch (error) {
    console.log(err);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
