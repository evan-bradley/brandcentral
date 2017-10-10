/*
 * public-api.js -- Publicly-accessible REST endpoints.
 */

const router = require('express').Router()
const db = require('./db')
const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
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
 * Login user.
 */
router.post('/api/login', async (req, res) => {
  try {
    const results = await db.loginUser(req.body)
    // console.log('Logged in', results.id, req.session.id)
    req.session.userId = results.id

    await db.updateLastSeen(results.id)
    res.send({
      success: true,
      id: results.id,
      lastName: results.lastName,
      firstName: results.firstName,
      email: results.email,
      lastSeen: results.lastSeen ? results.lastSeen : 'never'
    })
  } catch (e) {
    console.log(e)
    res.send({
      success: false,
      message: e.message
    })
  }
})

/*
 * Register user.
 */
router.post('/api/register', async (req, res) => {
  try {
    const results = await db.registerUser(req.body)

    req.session.userId = results.insertId

    let registerEmail = {
      from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
      to: req.body.email,
      subject: 'Hello ✔', // Subject line
      text: 'Hello, thanks for signing up. Please click this link to verify your account:\n' // plain text body
    }

    registerEmail.text += `http://localhost:8080/verify?token=${results.token}`
    console.log(registerEmail)

    transporter.sendMail(registerEmail, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
    })
    res.send({
      success: true,
      id: results.id
    })
  } catch (e) {
    console.log(e)
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.post('/api/password/reset', async (req, res) => {
  try {
    if (req.body.token) {
      await db.verifyTokenResetPassword(req.body.token, req.body.newPassword)
      res.send(JSON.stringify({ success: true }))
    } else {
      const token = await db.generatePasswordResetToken(req.body.email)
      let resetEmail = {
        from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
        to: req.body.email,
        subject: 'Reset Password ✔', // Subject line
        text: 'Hello, to reset your password, please click the following link:\n' // plain text body
      }

      resetEmail.text += `http://localhost:8080/reset?token=${token}`

      transporter.sendMail(resetEmail, (error, email) => {
        if (error) {
          throw error
        }

        res.send({
          success: true
        })
      })
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.post('/api/verify', async (req, res) => {
  try {
    if (req.body.token) {
      await db.verifyUserToken(req.body.token)
    } else if (req.body.token) {
      await db.verifyUserCode(req.body.code)
    } else {
      throw new Error('No code or token given.')
    }

    res.send(JSON.stringify({
      success: true
    }))
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

/**
 * Returns a message indicating whether or not the session is authenticated. If
 * the session is authenticated, the response also contains information for the
 * user who is authenticated. This should always return a successful response,
 * and contain a attribute called authenticated, which is a boolean.
 */
router.get('/api/authenticated', async (req, res) => {
  // Check to see if the session has a user
  if (!req.session.userId) {
    res.send({
      success: true,
      authenticated: false
    })
    return
  }

  try {
    // Fetch and return the user
    const results = await db.getUserWithId(req.session.userId)
    if (results.lenth < 1) res.status(404).send('User with that id does not exist')

    res.send({
      success: true,
      authenticated: true,
      user: {
        id: results[0].USER_ID,
        lastName: results[0].USER_LNAME,
        firstName: results[0].USER_FNAME,
        username: results[0].USERNAME,
        email: results[0].USER_EMAIL
      }
    })
  } catch (e) {
    if (e) res.status(404).send('Something went wrong')
  }
})

// Returns a collection of tags to present to the user during the onboarding
// process. The response will contain an attribute called success, which
// indicates the success of the request. The response will also contain an
// array of tags.
router.get('/api/interests/tags', async (req, res) => {
  try {
    res.send({
      success: true,
      tags: await db.getInterestsTags()
    })
  } catch (e) {
    res.send({
      success: false,
      tags: e.message
    })
  }
})

module.exports = router
