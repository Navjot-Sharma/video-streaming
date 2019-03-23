const router = require("express")();
const request = require("request");
const qs = require("querystring");

const { Playlists } = require("../models/playlist");
const checkAuth = require("../middlewares/auth");

// router.get("/:id", async (req, res) => {
//   try {
//     console.log(req.params.id);
//     const result = await Playlists.findOne({ "playlists._id": req.params.id });

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: error.message });
//   }
// });

router.post("", checkAuth, async (req, res) => {
  try {
    let videoTitle = "";
    request(
      "http://www.youtube.com/get_video_info?video_id=" + req.body.videoId,
      async (err, response, body) => {
        try {
          if (err || response.statusCode !== 200) {
            throw new Error("Server error");
          }

          body = qs.parse(body);
          videoTitle = body.title;
          if (!videoTitle) {
            throw new Error("Video not found");
          }

          const video = {
            title: videoTitle,
            videoId: req.body.videoId
          };
          const result = await Playlists.findOneAndUpdate(
            { "playlists._id": req.body.playlistId, userId: req.userData._id },
            { $push: { "playlists.$.videos": video } },
            { new: true }
          );

          if (!result) throw new Error("Video not added");

          res.status(200).json({ playlists: result.playlists });
        } catch (error) {
          console.log("message", error.message);
          res.status(400).json(error.message);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:playlistId/:videoId", checkAuth, async (req, res) => {
  try {
    const result = await Playlists.findOneAndUpdate(
      {
        userId: req.userData._id,
        "playlists._id": req.params.playlistId,
        "playlists.videos.videoId": req.params.videoId
      },
      { $pull: { "playlists.$.videos": { videoId: req.params.videoId } } },
      { new: true }
    );

    console.log(result);
    res.status(200).json({ playlists: result.playlists });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
