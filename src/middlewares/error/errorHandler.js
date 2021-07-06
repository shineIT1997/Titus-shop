/**
*@file : errorHanding.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:33:07 | Wednesday, March 31, 2021
*@Editor : Visual Studio Code
*@summary : Define error-handling middleware functions
*/
const logger = require('@root/config/logger')

const errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message

  if (req.app.get('env') === 'production') {
    logger.info(err)
  } else {
    res.locals.error = err
  }

  // render the error page
  res.status(err.statusCode || 500)

  res.render('error')
}

module.exports = errorHandler
