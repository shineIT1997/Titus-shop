/**
*@file : controller.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:16:28 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : home controler
*/

const Cate = require('@/models/Cate')
const Manner = require('@/models/Manner')
const New = require('@/models/New')
const Product = require('@/models/Product')
const Project = require('@/models/Project')
const Supplier = require('@/models/Supplier')

const { contvertImagePath } = require('./service')

async function homeController(req, res, next) {
  try {
    // console.log(`req.get('host') : `, req.get('host'))
    // console.log(`req : `, req)

    const manners = await Manner.find().limit(4)
    const suppliers = await Supplier.find()
    const categories = await Cate.find().limit(7)
    const news = await New.find().limit(7)
    const projects = await Project.find()

    const mannerData = []
    const categoriesData = []

    for (const iterator of manners) {
      let count = await Product.find({ mannerId: iterator.id }).count()
      mannerData.push({ ...iterator._doc, count })
    }

    for (const iterator of categories) {
      let count = await Product.find({ cateId: iterator.id }).count()
      categoriesData.push({ ...iterator._doc, count })
    }

    const data = {
      manners: contvertImagePath(mannerData, '/upload/manner/'),
      suppliers: contvertImagePath(suppliers, '/upload/supplier/'),
      categories: contvertImagePath(categoriesData, '/upload/category/'),
      news: contvertImagePath(news, '/upload/news/'),
      projects: contvertImagePath(projects, '/upload/project/')
    }

    return res.status(200).send({
      status: 200,
      message: 'Register successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { homeController }
