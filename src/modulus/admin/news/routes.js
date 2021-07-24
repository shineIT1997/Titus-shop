/**
*@file : routes.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 12:41:58 | Saturday, July 10, 2021
*@Editor : Visual Studio Code
*@summary : create route for dashboard product
*/

const express = require('express')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const imageUtil = require('@/utils/image')

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
})

router.get('/news/list.html', isLoggedIn, async function (req, res) {
  try {
    const newsList = await NewModel.find()

    const newsData = newsList.map(el => {
      el.imagePath = '/upload/news/' + el.imagePath
      return el
    })

    res.render('admin/news/list', { errors: null, newsData, layout: false })
  } catch (error) {
    res.render('admin/news/list', { errors: [error.message] })
  }
})

router.get('/news/new.html', isLoggedIn, function (req, res) {
  res.render('admin/news/new')
})

router.post('/news/new.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    const slug = await NewModel.generateSlug(req.body.title)

    const aNew = await NewModel({
      title: req.body.title,
      slug,
      imagePath: image.filename,
      body: req.body.content,
      metaTitle: req.body.metaTitle,
      metaKeywords: req.body.metaKeywords,
      metaDescription: req.body.metaDescription
    })

    await aNew.save()

    res.render('admin/news/new', { success: 'Tạo mới thành công' })
  } catch (error) {
    res.render('admin/news/new', { errors: [error.message] })
  }
})

// delete item
router.get('/news/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const news = await NewModel.findById(req.params.id)

    if (news) {
      const pathImg = './public/upload/news/' + news.imagePath

      if (fs.existsSync(pathImg)) {
        fs.unlink(pathImg, function(e) {
          if (e) throw e
        })
      }

      await news.remove()

      res.redirect(200, '/news/list.html')
    }
  } catch (error) {
    res.redirect(400, '/news/list.html')
  }
})

router.get('/news/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const news = await NewModel.findById(req.params.id)
    res.render('admin/news/update', { news })
  } catch (error) {
    res.render('notFound')
  }
})

router.post('/news/:id/update.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    req.checkBody('title', 'Title không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      if (req.file) {
        const file = './public/upload/news/' + req.file.filename

        fs.unlink(file, function (e) {
          if (e) throw e
        })
      }
      res.render('admin/news/update', { errors: errors })
    } else {
      const slug = await NewModel.generateSlug(req.body.title)

      const payload = {
        title: body.title,
        slug,
        body: body.content,
        metaTitle: body.metaTitle,
        metaKeywords: body.metaKeywords,
        metaDescription: body.metaDescription
      }

      if (req.file) {
        const image = await imageUtil.resize(req.file.path, { replace: true })
        payload.imagePath = image.filename
      }

      await NewModel.updateOne({ _id: req.params.id }, {
        $set: payload
      })

      const news = await NewModel.findById(req.params.id)

      res.render('admin/news/update', { success: 'Cập nhật thành công', news })
    }
  } catch (error) {
    res.render('admin/news/update', { errors: [error.message] })
  }
})

module.exports = router
