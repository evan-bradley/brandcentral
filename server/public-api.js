/*
 * public-api.js -- Publicly-accessible REST endpoints.
 */

const router = require('express').Router();
const db = require('./db');

const bcrypt = require('bcrypt');

/*
 * Login user.
 * TODO: Return session key.
 */
router.post('/api/login', (req, res) => {
  db.loginUser(req.body, (err, results) => {
    if (err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    } else {
      console.log('Logged in', results.id);
      const id = results.id;
      req.session.id = id;

      db.updateLastSeen(id, (err) => {
        if(err) {
          console.log(err);
          res.send({
            success: false,
            message: err.message,
          });
        }

        res.send({
          success: true,
          id,
          lastName: results.lastName,
          firstName: results.firstName,
          email: results.email,
          lastSeen: results.lastSeen ? results.lastSeen : "never"
        });
     });
    }
  });
});

/*
 * Register user.
 */
router.post('/api/register', (req, res) => {
  db.registerUser(req.body, (error, results, fields) => {
    if(error) {
      console.log(error);
      res.send({
        success: false,
        message: error.message,
      });
    } else {
      res.send({
        success: true,
        uid: results.uid,
      });
    }
  });
});

module.exports = router;
