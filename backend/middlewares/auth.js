const jwt = require('jsonwebtoken');
const prod = require('../prod/prod');

module.exports = (req, res, next) => {
  try {
    const token = req.header.authorization;
    jwt.verify(token, prod.jwt);
    next();
  } catch(err) {
    res.status(401).json({'result': 'Failed', 'message': 'Not authorized'})
  }
}
