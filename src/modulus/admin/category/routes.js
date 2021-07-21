const express = require('express')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const imageUtil = require('@/utils/image')
const Cate = require('@/models/Cate')
const { isLoggedIn } = require('@/middlewares/auth')

const CATEGORY_IMAGE_FOLDER = './public/upload/category'

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CATEGORY_IMAGE_FOLDER) // path of file
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
router.get('/category/new.html', isLoggedIn, function (req, res) {
  res.render('admin/category/new')
})

router.post('/category/new.html', isLoggedIn, upload.single('baseImage'),
  async function (req, res) {
    req.checkBody('id', 'ID không được trống').isString().notEmpty()
    req.checkBody('name', 'Tên không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      const file = CATEGORY_IMAGE_FOLDER + req.file.filename

      fs.unlink(file, function (e) {
        if (e) throw e
      })

      res.render('admin/category/new', { errors: errors })
    } else {
      const image = await imageUtil.resize(req.file.path, { replace: true })

      const oldeCate = await Cate.findOne({ cateId: body.id })

      if (oldeCate) return res.render('admin/category/new', { errors: ['Phong cách đã tồn tại!'] })

      const newCate = new Cate({
        imagePath: image.filename,
        cateId: body.id,
        name: body.name
      })

      newCate.save().then(function() {
        res.render('admin/category/new', { success: 'Tạo mới thành công' })
      })
    }
  })

// get list supplier for admin
router.get('/category/list.html', isLoggedIn, async function (req, res) {
  try {
    const categoryList = await Cate.find()

    const categoryData = categoryList.map(supp => {
      supp.imagePath = '/upload/category/' + supp.imagePath
      return supp
    })

    res.render('admin/category/list', { errors: null, categoryData, layout: false })
  } catch (error) {
    res.render('notFound')
  }
})

// delete item
router.get('/category/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const category = await Cate.findById(req.params.id)

    if (category) {
      const pathImg = CATEGORY_IMAGE_FOLDER + '/' + category.imagePath

      fs.unlink(pathImg, function(e) {
        if (e) throw e
      })

      await category.remove()

      res.send({ succsess_del_category: 'Nhà cung cấp đã tồn tại!' }).redirect(200, '/category/list.html')
    }
  } catch (error) {
    res.send({ error: 'Xóa thất bại' }).redirect(400, '/category/list.html')
  }
})

router.get('/category/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const category = await Cate.findById(req.params.id)
    res.render('admin/category/update', { category })
  } catch (error) {
    res.render('notFound')
  }
})

router.post('/category/:id/update.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    req.checkBody('id', 'ID không được trống').isString().notEmpty()
    req.checkBody('name', 'Tên không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      if (req.file) {
        const file = CATEGORY_IMAGE_FOLDER + '/' + req.file.filename

        fs.unlink(file, function (e) {
          if (e) throw e
        })
      }
      res.render('admin/category/update', { errors: errors })
    } else {
      const payload = {
        cateId: body.id,
        name: body.name
      }

      if (req.file) {
        const image = await imageUtil.resize(req.file.path, { replace: true })
        payload.imagePath = image.filename
      }

      await Cate.updateOne({ _id: req.params.id }, {
        $set: payload
      })

      const category = await Cate.findById(req.params.id)

      res.render('admin/category/update', { success: 'Cập nhật thành công', category })
    }
  } catch (error) {
    res.render('admin/category/update', { errors: [error.message] })
  }
})

module.exports = router
