const router = require('express')();

const {Playlist, Playlists} = require('../models/playlist');


router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await Playlists.findOne({'playlists._id': req.params.id});

    res.status(200).json(result);
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

router.post('', async (req, res) => {
  try {
    const result = await Playlists.findOneAndUpdate(
      {'playlists._id': req.body.playlistId},
      {$push: {'playlists.$.videos': req.body.videoId}},
      {new: true});

    if (!result) throw new Error('Video not added');

    res.status(200).json({playlists: result.playlists});
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});


module.exports = router;
