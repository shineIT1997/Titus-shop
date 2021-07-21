/**
*@file : index.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 21:57:00 | Sunday, June 13, 2021
*@Editor : Visual Studio Code
*@summary : authen middleware
*/
const jwt = require('jsonwebtoken')
const { secretKey } = require('@root/config/jwt')
const User = require('@/models/User')

const RefreshToken = require('@/models/RefreshToken')

/**
 *
 * @param {Array} roles
 * @returns refresh token folowing roles
 */
const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secretKey, algorithms: ['HS256'] }),

    // authorize based on user role
    async (req, res, next) => {
      const user = await User.findById(req.user.id)

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: 'Unauthorized' })
      }

      // authentication and authorization successful
      req.user.role = user.role
      const refreshTokens = await RefreshToken.find({ user: user.id })
      req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token)
      next()
    }
  ]
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.roles === 'ADMIN') {
    return next()
  } else { res.redirect('/login') }
}

function notisLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  } else {
    if (req.isAuthenticated() && req.user.roles !== 'ADMIN') {
      return next()
    } else {
      res.redirect('/')
    }
  }
}

module.exports = {
  authorize,
  isLoggedIn,
  notisLoggedIn
}
