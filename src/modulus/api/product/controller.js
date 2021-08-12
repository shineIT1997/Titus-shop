/**
*@file : controller.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 01:39:46 | Friday, August 13, 2021
*@Editor : Visual Studio Code
*@summary : product api controller
*/

const Product = require('@/models/Product')

async function productListController(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      offset = 0,
      sort = '-createdAt',
      cateId,
      mannerId,
      ...queryParams
    } = req.query

    if (mannerId) {
      queryParams.mannerId = { $in: [mannerId] }
    }

    if (cateId) {
      queryParams.cateId = { $in: [cateId] }
    }

    const products = await Product.paginate(queryParams, {
      sort,
      page,
      limit,
      offset,
      lean: true
    })

    products.docs = products.docs.map(el => {
      el.imagePath = el.imagePath.map(path => '/upload/products/' + path)
      return el
    })

    return res.status(200).send({
      status: 200,
      message: 'success',
      data: {
        ...products
      }
    })
  } catch (error) {
    next(error)
  }
}
async function productDetailController(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate({
        path: 'supplierID',
        select: '_id supId name imagePath'
      })
      .populate({
        path: 'cateId',
        select: '_id cateId name imagePath'
      })
      .populate({
        path: 'mannerId',
        select: '_id mannerId name imagePath'
      })
      .lean()

    product.imagePath = product.imagePath.map(path => '/upload/products/' + path)

    return res.status(200).send({
      status: 200,
      message: 'success',
      data: { ...product }
    })
  } catch (error) {
    console.log(`error : `, error)
    next(error)
  }
}

module.exports = { productListController, productDetailController }
