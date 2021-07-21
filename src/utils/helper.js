/**
*@file : helper.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 15:22:50 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : func for format, checktype, convert ... (something like that)
*/

'use strict'

const crypto = require('crypto')
const { promisify } = require('util')

/**
 * Check input is Object or not
 * @param {Any} obj
 * @return {Boolean}
 */
const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj)

const redisAsync = (client) => {
  global.REDIS.get = promisify(client.get).bind(client)
  global.REDIS.set = promisify(client.set).bind(client)
}

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 *  Check if a value is a number.
 * @param {val} num
 * @returns {Boolean}
 */
const isNumberic = (num) => {
  if (typeof num === 'number') {
    return num - num === 0
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
  }
  return false
}

/**
 *
 * @param {Number or String} val
 * @param {String} currrency
 */
const formatCurrency = (val, currrency) => {
  const value = (val || 0).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return typeof currrency === 'string' ? `${value} ${currrency.trim()}` : `${value}`
}

/**
 *
 * @param {String} email
 * @returns true if param is a email
 */
const validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return rex.test(email)
}

/**
 *
 * @returns random string
 */
const randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}

/**
 * Valid input is an Object
 * @param {Any} obj
 * @return {Object}
 */
const ensureObject = (obj, defaultValue) => isObject(obj) ? obj : isObject(defaultValue) ? defaultValue : {}

module.exports = {
  normalizePort,
  isNumberic,
  isObject,
  randomTokenString,
  formatCurrency,
  validateEmail,
  redisAsync,
  ensureObject
}
