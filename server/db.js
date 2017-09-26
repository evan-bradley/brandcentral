/*
 * db.js -- Database setup and related functions.
 * TODO: Move from callbacks to Promises-based or async/await-based control.
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
  let updateProfileQuery = `UPDATE USER `;
  const parameters = [];

  if (info.username) {
    updateProfileQuery += `SET USERNAME = ? `;
    parameters.push(info.username);
  }
  if (info.firstName) {
    updateProfileQuery += `SET USER_FNAME = ? `;
    parameters.push(info.firstName);
  }
  if (info.lastName) {
    updateProfileQuery += `SET USER_LNAME = ? `;
    parameters.push(info.lastName);
  }
  if (info.email) {
    updateProfileQuery += `SET USER_EMAIL = ? `;
    parameters.push(info.email);
  }
  if (info.password) {
    // Separate query for user password to avoid nasty control flow.
    bcrypt
      .hash(info.password, 10)
      .then((hash) => {
        pool.query("UPDATE USER SET USER_PASS_HASH = ? WHERE USER_ID = ?",
          [ hash, info.id ],
          (err, result) => {
            if (err) {
              throw err;
            }
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
  if (updateProfileQuery !== "UPDATE USER ") {
    updateProfileQuery += `WHERE USER_ID = ?;`;
    parameters.push(info.id);
    pool.query(updateProfileQuery, parameters, callback);
  }
};

const PROFILE_Q = `SELECT USER_FNAME, USER_LNAME, USERNAME, USER_PICT_URL
FROM USER WHERE USER_ID = ?;`;
pool.getProfileData = (info, callback) => {
      pool.query(PROFILE_Q, [
                info.id
            ], callback);
};

const LAST_SEEN_Q = `
UPDATE USER
  SET LAST_SEEN = CURRENT_TIMESTAMP()
  WHERE USER_ID = ?;`;
pool.updateLastSeen = (id, callback) => {
      pool.query(LAST_SEEN_Q, [ id ], callback);
};

module.exports = pool;
