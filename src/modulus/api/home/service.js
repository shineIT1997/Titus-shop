/**
*@file : service.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 23:51:36 | Tuesday, June 15, 2021
*@Editor : Visual Studio Code
*@summary : auth service
*/

const jwt = require('jsonwebtoken')

const { secretKey } = require('@root/config/jwt')

const { randomTokenString } = require('@/utils/helper')

const RefreshToken = require('@/models/RefreshToken')

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
 * @param {Object} user
 * @param {String} ipAddress
 * @returns create a refresh token that expires in 7 days
 */
const generateRefreshToken = (user, ipAddress) => {
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  })
}

module.exports = {
  generateJwtToken,
  generateRefreshToken
}
