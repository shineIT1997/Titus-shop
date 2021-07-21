/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 12:41:58 | Saturday, July 10, 2021
*@Editor : Visual Studio Code
*@summary : create route for dashboard product
*/

const express = require('express')
const passport = require('passport')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const imageUtil = require('@/utils/image')

const Product = require('@/models/Product')
const Cate = require('@/models/Cate')
const Manner = require('@/models/Manner')
const Supplier = require('@/models/Supplier')
const { isLoggedIn } = require('@/middlewares/auth')

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/products') // path of file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname) // name of file
  },
  fileFilter: function(req, file, callback) {
    let ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/* res.end('Only images are allowed') */ null, false)
    }

    callback(null, true)
  }
})
const upload = multer({ storage: storage })

/* GET home page. */
router.get('/product/getAll', isLoggedIn, function (req, res, next) {
  res.render('index', { title: 'Express' })
})

// add new product
router.get('/product/new.html', isLoggedIn, async function (req, res) {
  try {
    const cateList = await Cate.find()
    const mannerList = await Manner.find()
    const supplierList = await Supplier.find()

    res.render('admin/product/new', {
      cateList,
      mannerList,
      supplierList
    })
  } catch (error) {
    res.render('index')
  }
})

// add new Product
router.post('/product/new.html', isLoggedIn, upload.array('productMedia', 10), async function (req, res) {
  console.log('req.body', req.body)

  // req.checkBody('name', 'Tên không được trống').notEmpty()
  // req.checkBody('gia', 'giá phải là số').isInt()
  // req.checkBody('soluong', 'soluong là số').isInt()
  // req.checkBody('des', 'Chi tiết không được trống').notEmpty()
  const errors = req.validationErrors()

  if (errors) {
    const file = './public/upload/products' + req.file.filename

    fs.unlink(file, function(e) {
      if (e) throw e
    })
  } else {
    for (const mediaFile of req.files) {
      const resp = await imageUtil.resize(mediaFile.path, { replace: true })
    }

    // const pro = new Product({
    //   imagePath: req.file.filename,
    //   title: req.body.name,
    //   description: req.body.des,
    //   price: req.body.gia,
    //   cateId: req.body.cate,
    //   soluong: req.body.soluong,
    //   theloai: req.body.theloai
    // })
    // pro.save().then(function() {
    //   res.redirect('/admin/product/new')
    // })
  }
})

module.exports = router
