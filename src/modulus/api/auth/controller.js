/**
*@file : controller.js
*@author : Thanh Dat / dat.dinh@dinovative.com
*@date : 14:16:28 | Sunday, May 30, 2021
*@Editor : Visual Studio Code
*@summary : auth controler
*/

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const isString = require('lodash/isString')
const isEmpty = require('lodash/isEmpty')

const jwtConfig = require('@root/config/jwt')

const { CreateError } = require('@/utils/error')
const { validateEmail, getAsyncRedis } = require('@/utils/helper')

const User = require('@/models/User')
const Token = require('@/models/Token')
const { generateJwtToken, generateRefreshToken } = require('./service')

async function loginController(req, res, next) {
  try {
    const redis = global.REDIS

    const { token } = req.cookies

    if (token) throw new CreateError(400, 'User was log in')

    const { email, password } = req.body
    const ipAddress = req.ip

    const user = await User.findOne({ email })

    if (!user) {
      throw new CreateError(400, 'Invalid credentials.')
    }

    const valid = user.validPassword(password)
    if (!valid) {
      throw new CreateError(400, 'Invalid credentials.')
    }

    const basicDetails = user.basicDetails(user)

    const refreshToken = generateRefreshToken(user, ipAddress)

    // save Refresh token
    await refreshToken.save()

    const jwtToken = generateJwtToken(user)

    await redis.set(user.id, jwtToken)

    const redisToken = await redis.get(user.id)

    console.log(`redisTokena : `, redisToken)

    // if (!user.isActive) {
    //   throw new CreateError(400, 'User in-activated.')
    // }

    // generate access token

    res.cookie('token', jwtToken, { secure: true, httpOnly: true })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

    return res.status(200).send({
      status: 200,
      message: 'Register successfully',
      data: { ...basicDetails }
    })
  } catch (error) {
    next(error)
  }
}

async function registerController (req, res, next) {
  const { body } = req

  const { email, password } = body

  try {
  // validate email
    if (!validateEmail(email)) throw new CreateError(400, 'Email is inValid')

    // valid password: min 6 char
    if (!(isString(password) && password.length >= 6)) throw new CreateError(400, 'Password is string and min 6 char')

    const existedUser = await User.countDocuments({ email })

    // check existed user
    if (existedUser) throw new CreateError(400, 'Email already exists.')

    const newUser = new User({ email, password })

    const user = await newUser.save()

    // generate token for verify mailer and save
    const tokenMailer = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

    // create a test account mailer
    const testAccount = await nodemailer.createTestAccount()

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    })

    const mailOptions = {
      from: 'no-reply@example.com',
      to: user.email,
      subject: 'Account Verification Link',
      // eslint-disable-next-line no-useless-escape
      text: `Hello ${req.body.name},\n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/confirmation/user.email/${tokenMailer}\n\nThank You!\n`
    }

    await transporter.sendMail(mailOptions)

    return res.send(200, { msg: 'Register successfully' })
  } catch (error) {
    next(error)
  }
}

async function testController(req, res, next) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)

  return res.status(200).send({ message: 'sucess' })
}

module.exports = { loginController, registerController, testController }
