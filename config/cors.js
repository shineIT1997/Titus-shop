/**
*@file : cors.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 11:00:46 | Thursday, April 01, 2021
*@Editor : Visual Studio Code
*@summary : cors config option
*/

const corsOptions = {
  origin: ['http://127.0.0.1:4000', 'http://localhost:5000'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  optionsSuccessStatus: 204,
  preflightContinue: true,
  maxAge: 600,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}

module.exports = corsOptions
