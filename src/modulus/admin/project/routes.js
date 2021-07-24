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

const ProjectModel = require('@/models/Project')
const { isLoggedIn } = require('@/middlewares/auth')

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload/project') // path of file
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
router.post('/projects/upload', isLoggedIn, upload.single('upload'), async function (req, res) {
  try {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    let fileName = image.filename
    let url = '/upload/project/' + fileName
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

router.get('/projects/list.html', isLoggedIn, async function (req, res) {
  try {
    const newsList = await ProjectModel.find()

    const projectData = newsList.map(el => {
      el.imagePath = el.imagePath.map(path => '/upload/project/' + path)
      return el
    })

    res.render('admin/project/list', { errors: null, projectData, layout: false })
  } catch (error) {
    res.render('admin/project/list', { errors: [error.message] })
  }
})

router.get('/projects/new.html', isLoggedIn, function (req, res) {
  res.render('admin/project/new')
})

router.post('/projects/new.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    const slug = await ProjectModel.generateSlug(req.body.title)

    const aNew = await ProjectModel({
      title: req.body.title,
      slug,
      imagePath: image.filename,
      body: req.body.content,
      metaTitle: req.body.metaTitle,
      metaKeywords: req.body.metaKeywords,
      metaDescription: req.body.metaDescription
    })

    await aNew.save()

    res.render('admin/project/new', { success: 'Tạo mới thành công' })
  } catch (error) {
    res.render('admin/project/new', { errors: [error.message] })
  }
})

// delete item
router.get('/projects/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const news = await ProjectModel.findById(req.params.id)

    if (news) {
      const pathImg = './public/upload/project/' + news.imagePath

      if (fs.existsSync(pathImg)) {
        fs.unlink(pathImg, function(e) {
          if (e) throw e
        })
      }

      await news.remove()

      res.redirect(200, '/projects/list.html')
    }
  } catch (error) {
    res.redirect(400, '/projects/list.html')
  }
})

router.get('/projects/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const project = await ProjectModel.findById(req.params.id)
    res.render('admin/project/update', { project })
  } catch (error) {
    res.render('notFound')
  }
})

router.post('/projects/:id/update.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    req.checkBody('title', 'Title không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      if (req.file) {
        const file = './public/upload/project/' + req.file.filename

        fs.unlink(file, function (e) {
          if (e) throw e
        })
      }
      res.render('admin/project/update', { errors: errors })
    } else {
      const slug = await ProjectModel.generateSlug(req.body.title)

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

      await ProjectModel.updateOne({ _id: req.params.id }, {
        $set: payload
      })

      const project = await ProjectModel.findById(req.params.id)

      res.render('admin/project/update', { success: 'Cập nhật thành công', project })
    }
  } catch (error) {
    res.render('admin/project/update', { errors: [error.message] })
  }
})

module.exports = router
