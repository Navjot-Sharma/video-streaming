const router = require("express")();
const mongoose = require("mongoose");

const User = require('../models/user');
const { Playlist, Playlists } = require("../models/playlist");
const checkAuth = require('../middlewares/auth');


router.get("/:id", async (req, res) => {
  try {
    let admin, isAdmin, result;

    if (req.params.id !== 'guest') {
      result = await Playlists.findOne({ userId: req.params.id });
    }

    if (! result || result.playlists.length === 0) {
      admin = await User.findOne({authId: 1});
      result = await Playlists.findOne({ userId: admin._id })
       .select('-_id, -userId');

       isAdmin = true;
    }

    res.status(200).json({
      playlists: result.playlists,
      isAdminPlaylist: isAdmin
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("", checkAuth, async (req, res) => {
  try {
    if (!req.body.name) {
      throw new Error("Please provide a valid name");
    }

    const userId = mongoose.Types.ObjectId(req.userData._id);
    const isFound = await Playlists.findOne({ userId });

    const playlist = new Playlist({ name: req.body.name });

    let result;

    if (isFound) {
      result = await Playlists.findOneAndUpdate(
        { userId },
        { $push: { playlists: playlist } },
        { new: true }
      );
    } else {
      const playlists = new Playlists({
        userId,
        playlists: [playlist]
      });
      result = await playlists.save();
    }

    res.status(200).json({ playlists: result.playlists });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});

router.put("/:playlistsId", checkAuth, async (req, res) => {
  try {
    const result = await Playlists.findOneAndUpdate(
      {'playlists._id': req.params.playlistsId, userId: req.userData._id},
      {$set: {'playlists.$.name': req.body.name}},
      { new: true }
    );

    if (!result) throw new Error('Playlist not updated');

    res.status(200).json({playlists: result.playlists});
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error.message})
  }
});

router.delete("/:playlistId", checkAuth, async (req, res) => {
  try {
    const playlistId = mongoose.Types.ObjectId(req.params.playlistId);
    const playlists = await Playlists.findOneAndUpdate(
      { "playlists._id": playlistId, userId: req.userData._id },
      { $pull: { playlists: { _id: playlistId } } },
      { new: true }
    );

    if (!playlists) throw new Error("Please enter a valid id");

    res.status(200).json(playlists);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
