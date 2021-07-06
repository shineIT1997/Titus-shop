/**
*@file : mongo.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 16:53:50 | Friday, April 02, 2021
*@Editor : Visual Studio Code
*@summary : connect mongo db
*/

const mongoose = require('mongoose')
// const mongoosePaginate = require('./mongoose-paginate')
const config = require('@root/config/database')

// mongoose.plugin(mongoosePaginate)

const connectDB = async () => {
  const uri = config.uri

  const options = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  /**
   * Handle mongoose connection events
   *
  */
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to Mongo...')
  })

  mongoose.connection.on('connected', () => {
    console.log('Mongo is connected.')
  })

  mongoose.connection.on('reconnected', () => {
    console.log('Mongo trying to reconnect...')
  })

  mongoose.connection.on('error', error => {
    console.error('Unable to connect to the Mongo: ', error)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongo has disconnected!')

    // Trying to connect
    const waitingMS = 5000

    setTimeout(() => {
      console.log(`Reconnecting in ${waitingMS / 1000}s...`)
      return mongoose.connect(uri, options)
    }, waitingMS)
  })

  return mongoose.connect(uri, options)
}

module.exports = connectDB
