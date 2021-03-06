var express = require('express');
var router = express.Router();
var Band = require('../models/band');
var passport = require('passport');


//INDEX
router.get('/', function(req, res, next) {
  console.log('bands go here!');
  Band.find({})
    .then(function(bands) {
      res.render('bands/index', {
        bands: bands
      });
    });
});

//NEW
router.get('/new', function(req, res) {
  console.log('New band!');
  var band = {
    name: '',
    bio: '',
    img: '',
    website: '',
    created_by: ''
  };
  res.render('bands/new', {
    band: band
  });
});

//SHOW
router.get('/:id', function(req, res) {
  console.log('Show band');
  Band.findById(req.params.id)
    .then(function(band) {

      if (currentUser){res.render('bands/show', {
        band: band,
        user: currentUser.id
      });} else {
        res.render('bands/show', {
        band: band
      });
      }

    });
});

//CREATE
router.post('/', function(req, res) {
  console.log('create band');
  var band = new Band({
      name: req.body.name,
      bio: req.body.bio,
      img: req.body.img,
      website: req.body.website,
      creator: req.user.id
    });
  console.log(band);
  band.save()
    .then(function(saved) {
      req.user.bands.push(saved.id);
      req.user.save();
      console.log('saved');
      console.log(saved);
      res.redirect('/bands/' + saved._id);
    });
});

//EDIT
router.get('/:id/edit', function(req, res) {
  console.log('edit band');
  console.log(currentUser._id);
  Band.findById(req.params.id)
    .then(function(band) {
      console.log(band.creator);
      res.render('bands/edit', {
        band: band,
        user: currentUser._id
      });
    });
});

//UPDATE
router.put('/:id', function(req, res) {
  console.log("update band");
  Band.findById(req.params.id)
    .then(function(band) {
      band.name = req.body.name;
      band.bio = req.body.bio;
      band.img = req.body.img;
      band.website = req.body.website;
      return band.save();
    })
    .then(function(saved) {
      res.redirect('/bands');
    });
});

//DELETE
router.delete('/:id', function(req, res) {
  console.log("delete band");
  Band.findByIdAndRemove(req.params.id)
    .then(function() {
      res.redirect('/bands');
    });
});


module.exports = router;
