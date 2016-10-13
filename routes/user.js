const express = require('express');
const router = express.Router();
const _ = require('lodash');
const UserToken = require('../services/authenticate');

const db = require('../models/index');

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

module.exports = router;
