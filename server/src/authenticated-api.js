/*
 * authenticated-api.js -- REST Endpoints requiring authentication for use.
 */
'use strict'

const router = require('express').Router()
const db = require('./db')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'mail.cock.li',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'BrandCentralStation@firemail.cc', // generated ethereal user
    pass: 'brandcentral' // generated ethereal password
  }
})

/*
 * Update a user profile.
 */
router.post('/api/profile/:id', async (req, res) => {
  const queryData = req.body
  queryData.id = req.params.id

  if (parseInt(req.params.id, 10) === parseInt(req.session.userId, 10)) {
    try {
      await db.updateProfile(queryData)
      res.send(JSON.stringify({res: 'success'}))
    } catch (e) {
      res.send(JSON.stringify({res: 'error'}))
    }
  } else {
    res.send(JSON.stringify({res: 'error'}))
  }
})

/*
 * Get information for a user's profile.
 */
router.get('/api/profile/:id', async (req, res) => {
  try {
    res.send(JSON.stringify(await db.getProfileData(req.params.id)))
  } catch (e) {
    console.log(e)
    res.send(JSON.stringify({res: 'error'}))
  }
})

router.get('/api/logout', async (req, res) => {
  try {
    await db.updateLastSeen(req.session.id)
    req.session.destroy()
    res.send({
      success: true,
      message: 'Logged out'
    })
  } catch (e) {
    console.log(e)
    res.send({
      success: false,
      message: e
    })
  }
})

router.post('/api/profile/ChangeEmail/:token', async (req, res) => {
  try {
    const test = await db.CheckNewEmail(req.body)
    let OldEmail = {
      from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
      to: req.body.currentEmail,
      subject: 'Email Change ✔', // Subject line
      text: 'Hello, we noticed that your email has been changed on your account. Please contact us if this was not you.' // plain text body
    }

    transporter.sendMail(OldEmail, (error, info) => {
      if (error) {
        return console.log(error)
      }
    })

    let NewVerifyEmail = {
      from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
      to: req.body.NewEmail,
      subject: 'Hello ✔', // Subject line
      text: 'Hello, please click this link to verify your new email:\n' // plain text body
    }

    NewVerifyEmail.text += `http://localhost:8080/verify/${test.token}`
    console.log(NewVerifyEmail)

    transporter.sendMail(NewVerifyEmail, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
    })

    res.send({
      success: true
      // id: results.id
    })
  } catch (e) {
    console.log(e)
    console.log(e.message)
    res.send({
      success: false,
      message: e.message
    })
  }
})

/*
 * Store user's channels.
 */
router.post('/api/channels/:user', (req, res) => {
  console.log(req.session.userId)
  console.log(req.body.channels)
  res.send({
    success: true
  })
})

/*
 * Retrieve user's channels.
 */
router.get('/api/channels/:user', (req, res) => {
  console.log(req.params.user)
  console.log(req.session.userId)
  res.send({
    success: true
  })
})

router.get('/api/product', (req, res) => {
  // console.log(req.query.channelId)
  db.getRandomProduct(req.query.channelId)
})

module.exports = router
