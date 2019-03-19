const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const prod = require('./prod/prod');
const gitStreamRouter = require('./routers/gitStream');
const streamsRouter = require('./routers/streams');
const youStreamsRouter = require('./routers/youStream');
const usersRouter = require('./routers/users');
const playlistsRouter = require('./routers/playlists');
const videosRouter = require('./routers/videos');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods',
   'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});


app.use('', streamsRouter);
app.use('/youStream', youStreamsRouter);
app.use('/api/git', gitStreamRouter);
app.use('/api/users', usersRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/videos', videosRouter);

mongoose.connect(prod.mongodb, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true
})
 .then( () => console.log('Connected to mongoose...'))
 .catch( err => console.log('Connection to mongoose failed...', err));

module.exports = app;
