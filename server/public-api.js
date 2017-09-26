/*
 * public-api.js -- Publicly-accessible REST endpoints.
 */

const router = require('express').Router();
const db = require('./db');

const bcrypt = require('bcrypt');

const mail = require('node-smtp-client').Mail({
  host: 'mail.cock.li',
  username: 'BrandCentralStation@firemail.cc',
  password: 'brandcentral',
  port: 465
});

/*
 *  * Login user.
 *   */
router.post('/api/login', (req, res) => {
  db.loginUser(req.body, (err, results) => {
    if (err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    } else {
      console.log('Logged in', results.id, req.session.id);
      req.session.userId = results.id;

      db.updateLastSeen(results.id, (err) => {
        if(err) {
          console.log(err);
          res.send({
            success: false,
            message: err.message,
          });
        }

        res.send({
          success: true,
          id: results.id,
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
 *  * Register user.
 *   */
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
