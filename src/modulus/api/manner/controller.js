/**
*@file : controller.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:16:28 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : manner controler
*/

const Manner = require('@/models/Manner')

async function mannerListController(req, res, next) {
  try {
    const manners = await Manner.find()
    const data = manners.length
      ? manners.map(el => {
        el.imagePath = '/upload/manner/' + el.imagePath
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

module.exports = { mannerListController }
