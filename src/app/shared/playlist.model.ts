export interface Playlist {
  _id: string;
  name: string;
  videos: [{name: string, videoId: string}];
}
