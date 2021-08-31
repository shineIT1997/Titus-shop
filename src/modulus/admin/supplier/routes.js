
const express = require('express')
const fs = require('fs')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const imageUtil = require('@/utils/image')
const Supplier = require('@/models/Supplier')
const { isLoggedIn } = require('@/middlewares/auth')
const Cate = require('@/models/Cate')

const SUPPLIER_FOLDER = './public/upload/supplier'

// setting path and name of file for upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, SUPPLIER_FOLDER) // path of file
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
router.get('/supplier/new.html', isLoggedIn, async function (req, res) {
  const cateList = await Cate.find()
  res.render('admin/supplier/new', { errors: null, layout: false, cateList })
})

// add new supplier
router.post('/supplier/new.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  const body = req.body

  req.checkBody('id', 'ID không được trống').isString().notEmpty()
  req.checkBody('name', 'Tên không được trống').isString().notEmpty()

  const errors = req.validationErrors()

  if (errors) {
    const file = SUPPLIER_FOLDER + '/' + req.file.filename

    fs.unlink(file, function(e) {
      if (e) throw e
    })

    res.render('admin/supplier/new', { errors: errors })
  } else {
    const image = await imageUtil.resize(req.file.path, { replace: true })

    const oldSup = await Supplier.findOne({ supId: body.id })

    if (oldSup) return res.render('admin/supplier/new', { errors: ['Nhà cung cấp đã tồn tại!'] })

    const newSupplier = new Supplier({
      imagePath: image.filename,
      cateId: typeof req.body.category === 'string' ? [req.body.category] : req.body.category,
      supId: body.id,
      name: body.name
    })

    newSupplier.save().then(function() {
      res.render('admin/supplier/new', { success: 'Tạo mới thành công' })
    })
  }
})

// get list supplier for admin
router.get('/supplier/list.html', isLoggedIn, async function (req, res) {
  try {
    const supplierList = await Supplier.find()

    const supplierData = supplierList.map(supp => {
      supp.imagePath = '/upload/supplier/' + supp.imagePath
      return supp
    })

    res.render('admin/supplier/list', { errors: null, supplierData, layout: false })
  } catch (error) {

  }
})

// delete item
router.get('/supplier/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const supplier = await Supplier.findById(req.params.id)

    if (supplier) {
      const pathImg = SUPPLIER_FOLDER + '/' + supplier.imagePath

      if (fs.existsSync(pathImg)) {
        fs.unlink(pathImg, function(e) {
          if (e) throw e
        })
      }

      await supplier.remove()

      res.redirect(200, '/supplier/list.html')
    }
  } catch (error) {
    res.redirect(400, '/supplier/list.html')
  }
})

router.get('/supplier/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const cateList = await Cate.find()
    const supplier = await Supplier.findById(req.params.id)
    res.render('admin/supplier/update', { supplier, cateList })
  } catch (error) {
    res.render('notFound')
  }
})

router.post('/supplier/:id/update.html', isLoggedIn, upload.single('baseImage'), async function (req, res) {
  try {
    req.checkBody('id', 'ID không được trống').isString().notEmpty()
    req.checkBody('name', 'Tên không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const body = req.body

    if (errors) {
      if (req.file) {
        const file = SUPPLIER_FOLDER + '/' + req.file.filename

        fs.unlink(file, function (e) {
          if (e) throw e
        })
      }
      res.render('admin/supplier/update', { errors: errors })
    } else {
      const payload = {
        supId: body.id,
        name: body.name,
        cateId: typeof req.body.category === 'string' ? [req.body.category] : req.body.category
      }

      if (req.file) {
        const image = await imageUtil.resize(req.file.path, { replace: true })
        payload.imagePath = image.filename
      }

      await Supplier.updateOne({ _id: req.params.id }, {
        $set: payload
      })

      const supplier = await Supplier.findById(req.params.id)
      const cateList = await Cate.find()

      res.render('admin/supplier/update', { success: 'Cập nhật thành công', supplier, cateList })
    }
  } catch (error) {
    res.render('admin/supplier/update', { errors: [error.message] })
  }
})

module.exports = router
