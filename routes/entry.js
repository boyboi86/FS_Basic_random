const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const client = require('../services/yelps');
const db = require('../models/index');
const config = require('../config');

const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false})

/*ALLOW USER TO SEARCH YELPS API*/
router.get('/:location', function(req, res){
  const {location} = req.params;
  client.search({
    "term": "bar",
    "location": location
  })
  .then(function(data){
    res.json(data)
  })
  .catch(function(err){
    console.error(err);
  })
})

/*REQUIRE AUTH FOR SAVING if EXIST DESTRY OTHERWISE create*/
router.post('/', requireAuth, function(req, res){
  // const body = _.pick(req.body, [snippet_text, snippet_image_url, name, url]);
  const {snippet_text} = req.body
  const {snippet_image_url} = req.body
  const {name} = req.body
  const {url} = req.body
  const token = jwt.verify(req.headers.authorization, config.secret).sub
  const _token = parseInt(token, 10);
  const details = {
      location_name: name,
        url: url,
        displayUrl: snippet_image_url,
        snippets: snippet_text,
        userId: _token
      }
  db.entries.findOrCreate({
    where: details
  })
  .then(function(doc){
    db.entries.create({where: details});
    return res.status(200).send('item created');
  })
  .catch(function(err){
    res.json(err);
  })

})

module.exports = router;
