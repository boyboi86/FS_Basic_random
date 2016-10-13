const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

const db = require('../models/index');
const config = require('../config');

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const JwtAuth = new JwtStrategy( JwtOptions, function(payload, done){
  db.user.findOne({
    where: {
      id: payload.sub
    }
  })
  .then(function(user){
    return new Promise(function(resolve, reject){
      if(!user){
        console.error('Passport: token does not match')
        return reject(done(null, false))
      }
      console.info('JWT Strategy resolve')
      resolve(done(null, user))
    })
  })
  .catch(function(err){
    console.error('Passport: catch error')
    return done(err)
  })
})

passport.use(JwtAuth);
