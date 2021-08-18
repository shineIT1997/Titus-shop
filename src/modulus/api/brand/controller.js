/**
*@file : controller.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:16:28 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : manner controler
*/

const Supplier = require('@/models/Supplier')

async function brandListController(req, res, next) {
  try {
    const brands = await Supplier.find()
    const data = brands.length
      ? brands.map(el => {
        el.imagePath = '/upload/supplier/' + el.imagePath
        return el
      })
      : []

    return res.status(200).send({
      status: 200,
      message: 'successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { brandListController }
