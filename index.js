/**
*@file : app.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:19:45 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : create a server
*/

/**
 * Use alias config
 */
require('module-alias/register')
// const moduleAlias = require('module-alias')
// const path = require('path')

/**
 * use ENV config
 */
require('dotenv').config()

// moduleAlias.addAlias('_libs', path.resolve(__dirname, './src/libs'))

// const User = require('_models/Users')
// const debug = require('debug')('chat-group-server:server')

const mongoDBConnection = require('@/libs/mongo.js')
const redis = require('@/libs/redis')
const app = require('@/app')
const { redisAsync } = require('@/utils/helper')

const logger = require('@root/config/logger')

const init = async () => {
  // Load libs
  await Promise.all([
    mongoDBConnection(), // connect db
    redis(redisAsync) // connect redis
  ])
    .then(() => require('@/libs').slackNoti())

  /** Start server */
  await app()
}

process.on('uncaughtException', (error, origin) => {
  console.log('uncaughtException')
  logger.info(error)
  logger.info(origin)

  console.log(error)
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection')
  logger.info(reason)
  logger.info(promise)

  console.log(reason)
  console.log(promise)

  // process.exit(1)
})

init()
