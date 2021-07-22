/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 15:24:06 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : create route for dashboard page
*/

const { isLoggedIn, notisLoggedIn } = require('@/middlewares/auth')
const express = require('express')
const passport = require('passport')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const rootDirectory = fs.realpathSync(process.cwd())

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('index', { title: 'Express', image: 'upload/supplier/1626539115035_image.png' })
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
router.post('/test', function (req, res, next) {
  console.log(`req.body : `, req.body)
})

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout()
  res.redirect('/login')
})

router.get('/list/:folder', isLoggedIn, function(req, res, next) {
  glob(path.join(rootDirectory, `public/upload/${req.params.folder}/*`), function (er, files) {
    const urlList = files.map(file => {
      return file.split('/').slice(-2).join('/')
    })
    res.render('listImage', { urlList: urlList })
  })
})

module.exports = router
