/**
*@file : service.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 23:51:36 | Tuesday, June 15, 2021
*@Editor : Visual Studio Code
*@summary : auth service
*/

const jwt = require('jsonwebtoken')

const { secretKey } = require('@root/config/jwt')

/**
 *
 * @param {Object} user
 * @returns create a jwt token containing the user id that expires in 15 minutes
 */
const generateJwtToken = (user) => {
  return jwt.sign({ sub: user.id, id: user.id }, secretKey, { expiresIn: '15m' })
}

/**
 *
 * @param {Object} docs
 * @param {String} imgPath
 * @returns create a refresh token that expires in 7 days
 */
const contvertImagePath = (docs, imgPath) => {
  return docs.length
    ? docs.map(el => {
      el.imagePath = imgPath + el.imagePath
      return el
    })
    : [...docs]
}

module.exports = {
  generateJwtToken,
  contvertImagePath
}
