/**
*@file : redis.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 23:35:17 | Wednesday, June 02, 2021
*@Editor : Visual Studio Code
*@summary : redis config
*/

const configRedis = {
  host: process.env.REDIT_HOST || '127.0.0.1',
  port: process.env.REDIT_PORT || 6379
}

module.exports = configRedis
