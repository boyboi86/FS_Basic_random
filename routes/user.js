const express = require('express');
const router = express.Router();
const _ = require('lodash');
const UserToken = require('../services/authenticate');
const jwt = require('jsonwebtoken');
const config = require('../config');

const db = require('../models/index');

const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false})

router.post('/signin', function(req, res){
  const body = _.pick(req.body, ['email', 'password']);
  db.user.comparePassword(body)
  .then(function(doc){
    if(!doc){
      return res.status(400).send('email does not exist')
    }
    console.log('Acc verified')
    console.log(doc.email)
    const token = UserToken(doc)
    return res.json({token});
  })
  .catch(function(err){
    res.status(500).send(err);
    console.error(err);
  })
})

router.post('/signup', function(req, res){
  const {email} = req.body;
  const {password} = req.body;
  db.user.create({ email, password })
  .then(function(doc){
    if(!doc){
      return res.status(400).send('email is invalid')
    }
    const token = UserToken(doc)
  return res.status(200).json({token});
  })
  .catch(function(err){
    res.status(500).send('email is already taken');
    console.error(err);
  })
})

router.get('/', requireAuth, function(req, res){
  const token = jwt.verify(req.headers.authorization, config.secret).sub
  const _token = parseInt(token, 10);
  db.entries.findAll({ where: {
    userId: _token
    }
  })
  .then(function(doc){
    res.json(doc);
  })
  .catch(function(err){
    res.json(err);
  })
})

module.exports = router;
