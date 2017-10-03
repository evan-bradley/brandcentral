/*
 * public-api.js -- Publicly-accessible REST endpoints.
 */

const router = require('express').Router();
const db = require('./db');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'mail.cock.li',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "BrandCentralStation@firemail.cc", // generated ethereal user
        pass: "brandcentral" // generated ethereal password
    }
});

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {


    // setup email data with unicode symbols

    // send mail with defined transport object
});


/*
 * Login user.
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
      //console.log('Logged in', results.id, req.session.id);
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
        let registerEmail = {
            from: '"Brand Central Station" <BrandCentralStation@firemail.cc>', // sender address
            to: req.body.email,
            subject: 'Hello ✔', // Subject line
            text: 'Hello, thanks for signing up. Please click this link to verify your account:\n' // plain text body
        };

        registerEmail.text += `http://localhost:8080/verify/${results.token}`;
        console.log(registerEmail);

        transporter.sendMail(registerEmail, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
      res.send({
        success: true,
        id: results.id,
      });
    }
  });
});

router.get('/api/username/:username', (req, res) => {
    db.getUsername(req.params.username, (err, result) => {
        if (err) {
            res.send(JSON.stringify({ exists: false }));
        } else {
            res.send(JSON.stringify({ exists: true }));
        }
    });
});

router.post('/api/verify/:token', (req, res) => {
    db.verifyUser(req.params.token, err => {
        if (err) throw err;
        res.send(JSON.stringify({ success: true }));
    });
});

module.exports = router;
