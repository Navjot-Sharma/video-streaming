const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const prod = require('./prod/prod');
const gitStreamRouter = require('./routers/gitStream');
const streamsRouter = require('./routers/streams');
const youStreamsRouter = require('./routers/youStream');
const usersRouter = require('./routers/users');


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
app.use('/git', gitStreamRouter);
app.use('/api/users', usersRouter);

mongoose.connect(prod.mongodb, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true
})
 .then( () => console.log('Connected to mongoose...'))
 .catch( err => console.log('Connection to mongoose failed...', err));

module.exports = app;
