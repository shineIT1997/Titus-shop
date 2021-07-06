/**
*@file : index.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 18:02:26 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : add router
*/

const apiErroHandler = require('@/middlewares/error/apiErrorHandler')
const errorHandler = require('@/middlewares/error/errorHandler')

const glob = require('glob')
const path = require('path')

const autoSyncRouter = (app) => {
  /** Set up admin route */
  glob
    .sync(path.join(__dirname, '../modulus/admin/*/routes.js'), {})
    .forEach(async item => {
      const routePath = require(path.resolve(item))
      await app.use('/', routePath, errorHandler)
    })

  /** Set up apis route */
  glob
    .sync(path.join(__dirname, '../modulus/api/*/routes.js'), {})
    .forEach(async item => {
      const routePath = require(path.resolve(item))
      await app.use('/api', routePath, apiErroHandler)
    })
}

module.exports = autoSyncRouter
