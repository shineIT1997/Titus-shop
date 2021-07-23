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
  try {
    req.checkBody('name', 'Tên sản phẩm không được trống').isString().notEmpty()
    req.checkBody('id', 'Mã sản phẩm không được trống').isString().notEmpty()
    req.checkBody('suplier', 'Nhà cung cấp không được trống').isString().notEmpty()
    const errors = req.validationErrors()

    const product = await Product.findOne({ productId: req.body.id })

    if (product) {
      for (const mediaFile of req.files) {
        const file = './public/upload/products/' + mediaFile.filename

        fs.unlink(file, function(e) {
          if (e) throw e
        })
      }
      return res.send({ message: 'Sản phẩm đã tồn tại' }).status(400)
    }

    if (errors) {
      for (const mediaFile of req.files) {
        const file = './public/upload/products/' + mediaFile.filename

        fs.unlink(file, function(e) {
          if (e) throw e
        })
      }
    } else {
      const imagePath = []
      for (const mediaFile of req.files) {
        const file = await imageUtil.resize(mediaFile.path, { replace: true })

        imagePath.push(file.filename)
      }

      const slug = await Product.generateSlug(req.body.name)

      const pro = new Product({
        imagePath,
        slug,
        title: req.body.name,
        productId: req.body.id,
        description: req.body.description,
        price: req.body.price,
        suplierID: req.body.suplier,
        cateId: typeof req.body.category === 'string' ? [req.body.category] : req.body.category,
        mannerId: typeof req.body.manner === 'string' ? [req.body.manner] : req.body.manner,
        qty: req.body.qty,
        metaTitle: req.body.metaTitle,
        metaKeywords: req.body.metaKeywords,
        metaDescription: req.body.metaDescription
      })

      await pro.save()

      res.send({ message: 'Tạo thành công' }).status(200)
    }
  } catch (error) {
    for (const mediaFile of req.files) {
      const file = './public/upload/products/' + mediaFile.filename

      fs.unlink(file, function(e) {
        if (e) throw e
      })
    }

    res.send({ message: error }).status(400)
  }
})

router.get('/product/list.html', isLoggedIn, async function (req, res) {
  try {
    const productList = await Product.find()

    const productData = productList.map(el => {
      el.imagePath = '/upload/products/' + el.imagePath
      return el
    })

    res.render('admin/product/list', { errors: null, productData, layout: false })
  } catch (error) {
    res.render('admin/product/list', { errors: [error.message] })
  }
})

router.get('/product/:id/delete.html', isLoggedIn, async function (req, res) {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      const pathImg = './public/upload/products/' + product.imagePath

      fs.unlink(pathImg, function(e) {
        if (e) throw e
      })

      await product.remove()

      res.redirect(200, '/product/list.html')
    }
  } catch (error) {

  }
})

router.get('/product/:id/update.html', isLoggedIn, async function (req, res) {
  try {
    const product = await Product.findById(req.params.id)
    const cateList = await Cate.find()
    const mannerList = await Manner.find()
    const supplierList = await Supplier.find()

    res.render('admin/product/update', {
      cateList,
      mannerList,
      supplierList,
      product
    })
  } catch (error) {
    res.render('notFound')
  }
})

module.exports = router
