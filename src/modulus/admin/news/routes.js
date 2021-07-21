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
const NewModel = require('@/models/New')
const { isLoggedIn } = require('@/middlewares/auth')

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/news') // path of file
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

// add new Product
router.post('/news/upload', isLoggedIn, upload.single('upload'), async function (req, res) {
  try {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    let fileName = image.filename
    let url = '/upload/news/' + fileName
    let msg = 'Upload successfully'
    let funcNum = req.query.CKEditorFuncNum

    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>")
  } catch (error) {
    if (req.file) {
      const file = './public/upload/news/' + req.file.filename

      fs.unlink(file, function (e) {
        if (e) throw e
      })
    }
  }

  // if (errors) {
  //   const file = './public/upload/products' + req.file.filename

  //   fs.unlink(file, function(e) {
  //     if (e) throw e
  //   })
  // } else {
  //   for (const mediaFile of req.files) {
  //     const resp = await imageUtil.resize(mediaFile.path, { replace: true })
  //     console.log(`resp : `, resp)
  //   }

  //   // const pro = new Product({
  //   //   imagePath: req.file.filename,
  //   //   title: req.body.name,
  //   //   description: req.body.des,
  //   //   price: req.body.gia,
  //   //   cateId: req.body.cate,
  //   //   soluong: req.body.soluong,
  //   //   theloai: req.body.theloai
  //   // })
  //   // pro.save().then(function() {
  //   //   res.redirect('/admin/product/new')
  //   // })
  // }
})

router.get('/news/new.html', isLoggedIn, function (req, res) {
  res.render('admin/news/new')
})

router.post('/news/new.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  console.log(`req.file : `, req.file)
  console.log(`req.body : `, req.body)

  try {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    const aNew = await NewModel({
      title: req.body.title,
      slug: await NewModel.generateSlug({ name: req.body.title, num: Date.now() }),
      imagePath: image.filename,
      body: req.body.content
    })

    await aNew.save()

    res.render('admin/news/new', { success: 'Tạo mới thành công' })
  } catch (error) {
    res.render('admin/news/new', { errors: [error.message] })
  }
})

module.exports = router
