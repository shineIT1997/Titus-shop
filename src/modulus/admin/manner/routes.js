const express = require('express')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const imageUtil = require('@/utils/image')
const Manner = require('@/models/Manner')
const { isLoggedIn } = require('@/middlewares/auth')

const MANNER_IMAGE_FOLDER = './public/upload/manner'

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, MANNER_IMAGE_FOLDER) // path of file
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

// add new supplier
router.get('/manner/new.html', isLoggedIn, function (req, res) {
  res.render('admin/manner/new')
})

router.post('/manner/new.html', isLoggedIn, upload.single('baseImage'),
  async function (req, res) {
    req.checkBody('id', 'ID không được trống').isString().notEmpty()
    req.checkBody('name', 'Tên không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      const file = MANNER_IMAGE_FOLDER + '/' + req.file.filename

      fs.unlink(file, function (e) {
        if (e) throw e
      })

      res.render('admin/manner/new', { errors: errors })
    } else {
      const image = await imageUtil.resize(req.file.path, { replace: true })

      const oldManner = await Manner.findOne({ mannerId: body.id })

      if (oldManner) return res.render('admin/manner/new', { errors: ['Phong cách đã tồn tại!'] })

      const newManner = new Manner({
        imagePath: image.filename,
        mannerId: body.id,
        name: body.name
      })

      newManner.save().then(function() {
        res.render('admin/manner/new', { success: 'Tạo mới thành công' })
      })
    }
  }
)

// get list manner for admin
router.get('/manner/list.html', isLoggedIn, async function (req, res) {
  try {
    const mannerList = await Manner.find()

    const mannerData = mannerList.map(manner => {
      manner.imagePath = '/upload/manner/' + manner.imagePath
      return manner
    })

    res.render('admin/manner/list', { errors: null, mannerData, layout: false })
  } catch (error) {

  }
})

// delete item
router.get('/manner/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const manner = await Manner.findById(req.params.id)

    if (manner) {
      const pathImg = MANNER_IMAGE_FOLDER + '/' + manner.imagePath

      fs.unlink(pathImg, function(e) {
        if (e) throw e
      })

      await manner.remove()

      res.redirect(200, '/manner/list.html')
    }
  } catch (error) {

  }
})

router.get('/manner/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const manner = await Manner.findById(req.params.id)
    res.render('admin/manner/update', { manner })
  } catch (error) {
    res.render('notFound')
  }
})

router.post('/manner/:id/update.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    req.checkBody('id', 'ID không được trống').isString().notEmpty()
    req.checkBody('name', 'Tên không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      if (req.file) {
        const file = MANNER_IMAGE_FOLDER + '/' + req.file.filename

        fs.unlink(file, function (e) {
          if (e) throw e
        })
      }
      res.render('admin/manner/update', { errors: errors })
    } else {
      const payload = {
        mannerId: body.id,
        name: body.name
      }

      if (req.file) {
        const image = await imageUtil.resize(req.file.path, { replace: true })
        payload.imagePath = image.filename
      }

      await Manner.updateOne({ _id: req.params.id }, {
        $set: payload
      })

      const manner = await Manner.findById(req.params.id)

      res.render('admin/manner/update', { success: 'Cập nhật thành công', manner })
    }
  } catch (error) {
    res.render('admin/manner/update', { errors: [error.message] })
  }
})

module.exports = router
