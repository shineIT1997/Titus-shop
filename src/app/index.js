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
const passport = require('passport')
const flash = require('connect-flash')
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const validator = require('express-validator')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const User = require('@/models/User')

const corsOptions = require('@root/config/cors')

const clientErrorHandler = require('@/middlewares/error/clientErrorHandler')
const { normalizePort } = require('@/utils/helper')
const autoSyncRouter = require('@/routers')

const rootDirectory = fs.realpathSync(process.cwd())

const startServer = async() => {
  const app = express()

  require('@root/config/passport')

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

  app.use(validator())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(rootDirectory, 'public')))
  app.use('/upload', express.static(path.join(rootDirectory, 'public/upload/')))
  app.use('/css', express.static(path.join(rootDirectory, 'node_modules/bootstrap/dist/css')))
  app.use('/css', express.static(path.join(rootDirectory, 'node_modules/bootstrap/dist/css')))
  app.use('/js', express.static(path.join(rootDirectory, 'node_modules/bootstrap/dist/js')))
  app.use('/jquery', express.static(path.join(rootDirectory, 'node_modules/jquery/dist/')))
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

  const uriDB = process.env.MONGOBD_CONFIG_URI

  app.use(session({
    secret: 'thanhdat',
    resave: false,
    saveUninitialized: false,
    dbName: 'session',
    store: MongoStore.create({ mongoUrl: uriDB })
    // cookie: {maxAge: 180 * 60 * 1000}
  }))

  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated()
    res.locals.session = req.session
    res.locals.succsess_msg = req.flash('succsess_msg')
    res.locals.user = req.user
    next()
  })

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

  const user = new User({
    email: 'admin@email.com',
    firstname: 'Dinh Thanh',
    lastname: 'Dat',
    address: 'nguyeenx',
    city: 'test',
    roles: 'ADMIN',
    phone: '0896214203',
    password: '12345678'
  })

  await user.save()

  // server.on('error', onError)
  // server.on('listening', onListening)

  console.log(`Your server started on port: http://127.0.0.1:${port}`)
}

module.exports = startServer
