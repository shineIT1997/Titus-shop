/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 15:24:06 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : create route for dashboard page
*/

const express = require('express')
const passport = require('passport')
const router = express.Router()

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/login', notisLoggedIn, function(req, res, next) {
  const messages = req.flash('error')
  res.render('login', {
    messages: messages,
    hasErrors: messages.length > 0,
    layout: false
  })
})

router.post('/login', passport.authenticate('local.login_ad', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.roles === 'ADMIN') {
    return next()
  } else { res.redirect('/login') }
}

function notisLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  } else {
    if (req.isAuthenticated() && req.user.roles !== 'ADMIN') {
      return next()
    } else {
      res.redirect('/')
    }
  }
}

module.exports = router
