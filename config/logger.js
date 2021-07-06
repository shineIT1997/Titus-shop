/**
*@file : logger.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:14:35 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : logger config
*/

const { createLogger, format, transports } = require('winston')
const path = require('path')
const DailyRotateFile = require('winston-daily-rotate-file')

const { combine, timestamp, json } = format

const transportConfig = [
  new (transports.Console)({
    json: true,
    colorize: true,
    timestamp: true
  }),

  new DailyRotateFile({
    filename: path.resolve(__dirname, '../log/debug-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH-MM',
    maxSize: '30m',
    maxFiles: '7d',
    json: true,
    colorize: true,
    zippedArchive: true,
    handleExceptions: true
  })
]

const logger = createLogger({
  format: combine(
    timestamp(),
    json()
  ),
  transports: transportConfig
})

module.exports = logger
