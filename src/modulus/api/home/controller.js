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
const Project = require('@/models/Project')
const Supplier = require('@/models/Supplier')
const { contvertImagePath } = require('./service')

async function homeController(req, res, next) {
  try {
    const manners = await Manner.find().limit(4)
    const suppliers = await Supplier.find()
    const categories = await Cate.find().limit(7)
    const news = await New.find().limit(7)
    const projects = await Project.find()

    const data = {
      manners: contvertImagePath(manners, '/upload/manner/'),
      suppliers: contvertImagePath(suppliers, '/upload/supplier/'),
      categories: contvertImagePath(categories, '/upload/category/'),
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
