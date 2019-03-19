const router = require('express')();
const mongoose = require('mongoose');

const {Playlist, Playlists} = require('../models/playlist');


router.get('',async (req, res) => {
  try {
    const result = await Playlists.find();

    res.status(200).json(result);
  } catch(err) {
    console.log(err);
  }
});
router.get('/:id',async (req, res) => {
  try {
    const result = await Playlists.findOne({userId: req.params.id});

    res.status(200).json(result);
  } catch(err) {
    console.log(err);
  }
});

router.post('', async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.body.userId);
    const {playlists} = await Playlists.findOne({userId});
    // const response = await Playlists.findOne({userId});
    console.log(playlists);
    const playlist = new Playlist({name: req.body.name});
    let result;

    if (playlists) {
      result = await Playlists.findOneAndUpdate({userId}, {$push: {playlists: playlist}}, {new: true});
      console.log('if', result);
    } else {
      const playlists = new Playlists({
        userId,
        playlists: [playlist]
      });
      result = await playlists.save();
      console.log('else', result);
    }
    
    res.status(200).json({playlists: result.playlists});
  } catch(err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});


module.exports = router;
