const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 20 },
  videos: [{
    title: {type: String, required: true},
    videoId: {type: String, required: true}
  }]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

const playlistsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  playlists: [playlistSchema]
});

exports.Playlist = Playlist;
exports.Playlists = mongoose.model("Playlists", playlistsSchema);
