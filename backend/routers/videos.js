const router = require('express')();
const request = require('request');
const qs = require('querystring');

const { Playlist, Playlists } = require('../models/playlist');

router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await Playlists.findOne({ 'playlists._id': req.params.id });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.post('', async (req, res) => {
  try {
    let videoTitle = '';
    request('http://www.youtube.com/get_video_info?video_id=' + req.body.videoId,
    async (err, response, body) => {
      if(err || response.statusCode !== 200){
        throw new Error('Id not found');
      }
      body = qs.parse(body);
      videoTitle = body.title;
      console.log(videoTitle);
      const video = {
        title: videoTitle,
        videoId: req.body.videoId
      }
      const result = await Playlists.findOneAndUpdate(
        { 'playlists._id': req.body.playlistId },
        { $push: { 'playlists.$.videos': video } },
        { new: true }
      );
  
      if (!result) throw new Error('Video not added');
  
      res.status(200).json({ playlists: result.playlists });
    });
    
    // res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:playlistId/:videoId', async (req, res) => {
  try {
    const found = await Playlists.findOne({'playlists._id': req.params.playlistId,  'playlists.videos.videoId': req.params.videoId});
    const result = await Playlists.findOneAndUpdate({
      'playlists._id': req.params.playlistId,  'playlists.videos.videoId': req.params.videoId},
      {$pull: { 'playlists.$.videos': {'videoId': req.params.videoId}}});

    console.log(result);
    res.status(200).json({playlists: result.playlists});
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
