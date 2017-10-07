/*
 * authenticated-api.js -- REST Endpoints requiring authentication for use.
 */
'use strict'

const router = require('express').Router()
const db = require('./db')

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

module.exports = router
