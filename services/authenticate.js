const jwt = require('jsonwebtoken');
const db = require('../models/index');
const config = require('../config');


/* JSON WEB TOKEN CREATION*/
 module.exports = function TokenVerify(user){
  const timestamp = Date.now();
  return jwt.sign({ sub: user.id, iat: timestamp }, config.secret)
}
