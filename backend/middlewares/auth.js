const jwt = require('jsonwebtoken');
const prod = require('../prod/prod');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, prod.jwt);
    req.userData = decodedToken;

    next();
  } catch(err) {
    res.status(401).json({'result': 'Failed', 'message': 'You are not authorized'})
  }
}
