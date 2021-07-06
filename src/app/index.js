/**
*@file : express.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 17:12:47 | Friday, April 02, 2021
*@Editor : Visual Studio Code
*@summary : start server
*/

const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

const corsOptions = require('@root/config/cors')

const clientErrorHandler = require('@/middlewares/error/clientErrorHandler')
const { normalizePort } = require('@/utils/helper')
const autoSyncRouter = require('@/routers')

const rootDirectory = fs.realpathSync(process.cwd())

const startServer = async() => {
  const app = express()

  /**
   * set up engine nunjucks
   */
  app.set('view engine', 'njk')

  app.set('views', path.join(rootDirectory, 'src/views'))

  nunjucks.configure(path.join(rootDirectory, 'src/views'), {
    autoescape: true,
    cache: false,
    express: app,
    watch: true
  })

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(rootDirectory, 'public')))

  /**
   *  override with different headers; last one takes precedence : Microsoft, Google/GData, IBM
   */
  app.use(methodOverride('X-HTTP-Method')) // Microsoft
  app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
  app.use(methodOverride('X-Method-Override')) // IBM

  /**
    * set up cors
    */
  app.use(cors(corsOptions))

  /**
    *  setup routes
    */
  autoSyncRouter(app)

  /**
    * catch 404 and forward to error handler
    */
  app.use(clientErrorHandler)

  /**
   * Get port from environment and store in Express.
   */
  const port = normalizePort(process.env.PORT || '3000')
  app.set('port', port)

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app)

  // /**
  //  * Listen on provided port, on all network interfaces.
  //  */
  // const onError = (error) => {
  //   if (error.syscall !== 'listen') {
  //     throw error
  //   }

  //   const bind = typeof port === 'string'
  //     ? 'Pipe ' + port
  //     : 'Port ' + port

  //   // handle specific listen errors with friendly messages
  //   switch (error.code) {
  //     case 'EACCES':
  //       console.error(bind + ' requires elevated privileges')
  //       return process.exit(1)

  //     case 'EADDRINUSE':
  //       console.error(bind + ' is already in use')
  //       return process.exit(1)

  //     default:
  //       throw error
  //   }
  // }

  // /**
  //  * Event listener for HTTP server "listening" event.
  //  */
  // const onListening = () => {
  //   const addr = server.address()
  //   console.log(`addr:`, addr)
  //   const bind = typeof addr === 'string'
  //     ? 'pipe ' + addr
  //     : 'port ' + addr.port
  //   debug('Listening on ' + bind)
  // }

  await server.listen(port)

  // server.on('error', onError)
  // server.on('listening', onListening)

  console.log(`Your server started on port: http://127.0.0.1:${port}`)
}

module.exports = startServer
