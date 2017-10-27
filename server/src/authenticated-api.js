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
      res.send({
        success: true
      })
    } catch (e) {
      res.send({
        success: false,
        message: e.message
      })
    }
  } else {
    res.send({
      success: false,
      message: 'Insufficient permissions'
    })
  }
})

/*
 * Get information for a user's profile.
 */
router.get('/api/profile/:id', async (req, res) => {
  try {
    res.send({
      success: true,
      user: await db.getProfileData(req.params.id)
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
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
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.put('/api/user/:id/email', async (req, res) => {
  if (parseInt(req.params.id, 10) !== parseInt(req.session.userId, 10)) {
    res.send({
      success: false,
      message: 'Insufficient permissions'
    })
    return
  }

  try {
    const results = await db.checkNewEmail(req.session.userId, req.body)
    const OldEmail = {
      from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
      to: results.email,
      subject: 'Email Change Notification', // Subject line
      text: 'Hello, we noticed that your email has been changed on your account. Please contact us if this was not you.' // plain text body
    }

    const NewVerifyEmail = {
      from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
      to: req.body.email,
      subject: 'Email Verification', // Subject line
      text: `Hello, please click this link to verify your new email: http://localhost:8080/verify?token=${results.token}\n` // plain text body
    }

    transporter.sendMail(OldEmail, (error, info) => {
      if (error) {
        return console.log(error)
      }

      transporter.sendMail(NewVerifyEmail, (error, info) => {
        if (error) {
          return console.log(error)
        }
      })
    })

    res.send({
      success: true
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
router.post('/api/user/:id/channels', async (req, res) => {
  try {
    await db.storeUserChannels(req.params.id, req.body.channels)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

/*
 * Retrieve user's channels.
 */
router.get('/api/user/:id/channels', async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) === parseInt(req.session.userId, 10)) {
      const channels = await db.retrieveUserChannels(req.params.id)
      res.send({
        success: true,
        channels
      })
    } else {
      throw new Error('Unauthorized')
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.get('/api/product/random', async (req, res) => {
  try {
    res.send({
      success: true,
      product: await db.getRandomProduct(req.query.channelId)
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.get('/api/product/:id', async (req, res) => {
  try {
    res.send({
      success: true,
      product: await db.getProduct(req.params.id)
    })
  } catch (e) {
    res.send()
  }
})

router.post('/api/product/like/:id', async (req, res) => {
  try {
    await db.likeProduct(req.session.userId, req.params.id)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.post('/api/product/dislike/:id', async (req, res) => {
  try {
    await db.dislikeProduct(req.session.userId, req.params.id)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.post('/api/user/follow/:id', async (req, res) => {
  try {
    await db.followUser(req.session.userId, req.params.id)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.post('/api/user/unfollow/:id', async (req, res) => {
  try {
    await db.unfollowUser(req.session.userId, req.params.id)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.get('/api/user/following/:id', async (req, res) => {
  try {
    res.send({
      success: true,
      following: await db.getFollowing(req.params.id)
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

/*
 * unsubscribe to a user's channel.
 */
router.post('/api/channels/unsubscribe/:cid', async (req, res) => {
  try {
    await db.unsubscribeChannel(req.session.userId, req.params.cid)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

/*
 * subscribe to a channel.
 */
router.post('/api/channels/subscribe/:cid', async (req, res) => {
  try {
    await db.subscribeChannel(req.session.userId, req.params.cid)
    res.send({
      success: true
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

 */
router.get('/api/channels/:id', async (req, res) => {
  try {
    res.send({
      success: true,
      channel: await db.getChannel(req.params.id)
    })
  } catch (e) {
    res.send({
      success: false,
      message: e.message
    })
  }
})

router.get('/api/user/likedproducts/:id', async (req, res) => {
  if (req.query.page === undefined) {
    req.query.page = 1
  }
  if (req.query.productsPer === undefined) {
    req.query.productsPer = 10
  }
  try {
    res.send({
      success: true,
      page: req.query.page,
      productsPer: req.query.productsPer,
      totalProducts: await db.getNumLikedProducts(req.params.id),
      likedproducts: await db.getLikedProducts(req.params.id, req.query.page, req.query.productsPer)
    })
  } catch (e) {
    res.send({
      success: false,
      message: e
    })
  }
})

module.exports = router
