/*
 * db.js -- Database setup and related functions.
 */
'use strict';

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const moment = require('moment-range').extendMoment(require('moment'));

const pool = mysql.createPool({
  'connectionLimit': 5,
  'host': process.env.DB_HOST,
  'user': process.env.DB_USER,
  'password': process.env.DB_PASS,
  'database': process.env.DB_NAME,
  'waitForConnections': true,
  'timezone': 'utc',
  'multipleStatements': 'true'
});


/*
 * Put user details into database, checking for whether their GID is already
 * in the database.
 */
const DUPCHECK_Q = 'SELECT USERNAME, USER_EMAIL FROM USER WHERE USERNAME = ? OR USER_EMAIL = ?';
pool.registerUser = (info, callback) => {
  if (!info.username || !info.email ||
      !info.lastName || !info.firstName || !info.password ) {
    callback({ message: 'Missing a required field' });
    return;
  }

  pool.query(DUPCHECK_Q, [ info.username, info.email ], (error, results) => {
    if (typeof results !== "undefined" && results.length > 0) {
      // username or email already taken/in use
      if (info.username === results[0].USERNAME) {
        callback({ message: 'That username is already taken.' });
      } else if (info.email === results[0].USER_EMAIL) {
        callback({ message: 'A user with that email is already registered.' });
      } else {
        console.log(results[0]);
        callback({ message: 'Unknown SQL collision.' });
      }
    } else {
      bcrypt
        .hash(info.password, 10)
        .then((hash) => {
          pool.query('INSERT INTO USER (USERNAME, USER_LNAME, USER_FNAME, USER_EMAIL, USER_PASS_HASH, LAST_SEEN) VALUES(?, ?, ?, ?, ?, ?);', [
            info.username,
            info.lastName,
            info.firstName,
            info.email,
            hash,
            moment().format("YYYY-MM-DD HH:mm:ss")
          ], (err, res) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                err.message = 'A user with that ID is already registered';
              }
              callback(err);
            } else {
              callback(null, res);
            }
          });
        })
        .catch((err) => {
            callback(err);
        });
    }
  });
};

/*
 * Check user's password and return user info if it is valid
 */
const LOGIN_Q = 'SELECT USER_ID, USER_LNAME, USER_FNAME, USER_EMAIL, USER_PASS_HASH, LAST_SEEN FROM USER WHERE USERNAME = ?;';
pool.loginUser = (info, callback) => {
  pool.query(LOGIN_Q, [ info.username ], (err, results, fields) => {
    // Error for username not found same as that for password not found.
    if (err || results.length === 0) {
      // login failure
      callback({ message: 'Username or password invalid' });
      return;
    }

    bcrypt.compare(info.password, results[0].USER_PASS_HASH)
      .then((res) => {
        if (res) {
          // successful login
          callback(null, {
            id: results[0].USER_ID,
            lastName: results[0].USER_LNAME,
            firstName: results[0].USER_FNAME,
            email: results[0].USER_EMAIL,
            lastSeen: results[0].LAST_SEEN
          });
        } else {
          // login failure
          callback({ message: 'Username or password invalid' });
        }
      })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  });
};

pool.updateProfile = (info, callback) => {
  const firstName = info.firstName ? `SET USER_FNAME = ? ` : '';
  const lastName = info.lastName ? `SET USER_LNAME = ? ` : '';
  const email = info.email ? `SET USER_EMAIL = ? ` : '';
  const UPDATE_PROFILE_Q = `UPDATE USER ${firstName}${lastName}${email}WHERE USERNAME = ?`;
  const parameters = [];

  if (typeof info.firstName !== "undefined") {
    parameters.push(info.firstName);
  } else if (typeof info.lastName !== "undefined") {
    parameters.push(info.lastName);
  } else if (typeof info.email !== "undefined") {
    parameters.push(info.email);
  }
  parameters.push(info.username);

  pool.query(UPDATE_PROFILE_Q, parameters, callback);
};

const LAST_SEEN_Q = `
UPDATE USER
  SET LAST_SEEN = CURRENT_TIMESTAMP()
  WHERE USER_ID = ?;`;
pool.updateLastSeen = (id, callback) => {
    pool.query(LAST_SEEN_Q, [ id ], callback);
};

module.exports = pool;
