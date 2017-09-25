/*
 * authenticated-api.js -- REST Endpoints requiring authentication for use.
 */
'use strict';

const router = require('express').Router();
const db = require('./db');

/*
 * Update a user profile.
 * TODO: Should probably be /api/profile:id or /api/profile:username
 */
router.post('/api/profile', (req, res) => {
    db.updateProfile(req.body, (error, results, fields) => {
        if(error) {
            console.log(error);
            res.send(JSON.stringify({res: "error"}));
        } else {
            res.send(JSON.stringify({res: "success"}));
        }
    });
});

router.get('/api/logout', (req, res) => {
  db.updateLastSeen(req.session.id, (err) => {
    if(err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    }

    req.session.destroy();
    res.send({
      success: true,
      message: 'Logged out',
    });
  });
});

module.exports = router;
