/*
 * authenticated-api.js -- REST Endpoints requiring authentication for use.
 */
'use strict';

const router = require('express').Router();
const db = require('./db');

/*
 * Update a user profile.
 */
router.post('/api/profile/:id', (req, res) => {
    const queryData = req.body;
    queryData.id = req.params.id;

    if (parseInt(req.params.id, 10) === parseInt(req.session.userId, 10)) {
        db.updateProfile(queryData, error => {
            if(error) {
                console.log(error);
                res.send(JSON.stringify({res: "error"}));
            } else {
                res.send(JSON.stringify({res: "success"}));
            }
        });
    } else {
        res.send(JSON.stringify({res: "error"}));
    }
});

/*
 * Get information for a user's profile.
 */
router.get('/api/profile/:id', (req, res) => {
    db.getProfileData({
        id: req.params.id
    }, (error, results, fields) => {
        if(error) {
            console.log(error);
            res.send(JSON.stringify({res: "error"}));
        } else {
            res.send(JSON.stringify(results));
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

router.post('/api/onboard/tags', (req, res) => {
  console.log(req.session.userId);
  console.log(req.body.tags);
  res.send({
    success: true
  })
});
module.exports = router;
