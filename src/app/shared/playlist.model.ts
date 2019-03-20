export interface Playlist {
  _id: string;
  name: string;
  videos: [{title: string, videoId: string}];
}
