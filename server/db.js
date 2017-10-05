/*
 * db.js -- Database setup and related functions.
 * TODO: Move from callbacks to Promises-based or async/await-based control.
 */
'use strict'

const mysql = require('promise-mysql')
const bcrypt = require('bcrypt')
const moment = require('moment-range').extendMoment(require('moment'))

const pool = mysql.createPool({
  'connectionLimit': 5,
  'host': process.env.DB_HOST,
  'user': process.env.DB_USER,
  'password': process.env.DB_PASS,
  'database': process.env.DB_NAME,
  'waitForConnections': true,
  'timezone': 'utc',
  'multipleStatements': 'true'
})

/*
 * Put user details into database, checking for whether their GID is already
 * in the database.
 */
const DUPCHECK_Q = 'SELECT USERNAME, USER_EMAIL FROM USER WHERE USERNAME = ? OR USER_EMAIL = ?'
const REGISTER_Q = 'INSERT INTO USER (USERNAME, USER_LNAME, USER_FNAME, USER_EMAIL, USER_PASS_HASH, VERIFICATION, LAST_SEEN) VALUES(?, ?, ?, ?, ?, ?, ?)'
pool.registerUser = info => {
  return new Promise(async (resolve, reject) => {
    if (!info.username || !info.email ||
      !info.lastName || !info.firstName || !info.password) {
      reject(new Error('Missing a required field'))
      return
    }

    try {
      const results = await pool.query(DUPCHECK_Q, [info.username, info.email])
      if (typeof results !== 'undefined' && results.length > 0) {
        // username or email already taken/in use
        if (info.username === results[0].USERNAME) {
          reject(new Error('That username is already taken.'))
        } else if (info.email === results[0].USER_EMAIL) {
          reject(new Error('A user with that email is already registered.'))
        } else {
          console.log(results[0])
          reject(new Error('Unknown SQL collision.'))
        }
      } else {
        const hash = await bcrypt.hash(info.password, 10)
        require('crypto').randomBytes(16, function (err, buffer) {
          if (err) {
            reject(err)
            return
          }

          const token = buffer.toString('hex')
          const res = pool.query(REGISTER_Q, [
            info.username,
            info.lastName,
            info.firstName,
            info.email,
            hash,
            token,
            moment().format('YYYY-MM-DD HH:mm:ss')
          ])
          res.token = token
          resolve(res)
          // if (err.code === 'ER_DUP_ENTRY')
          // err.message = 'A user with that ID is already registered'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/*
 * Check user's password and return user info if it is valid
 */
const LOGIN_Q = 'SELECT USER_ID, USER_LNAME, USER_FNAME, USER_EMAIL, USER_PASS_HASH, VERIFIED, LAST_SEEN FROM USER WHERE USERNAME = ?'
pool.loginUser = info => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await pool.query(LOGIN_Q, [ info.username ])

      if (results.length === 0) {
        // login failure
        reject(new Error('Username or password invalid'))
        return
      } else if (results[0].VERIFIED !== 1) {
        reject(new Error('User not verified '))
        return
      }

      const res = await bcrypt.compare(info.password, results[0].USER_PASS_HASH)

      if (res) {
        // successful login
        resolve({
          id: results[0].USER_ID,
          lastName: results[0].USER_LNAME,
          firstName: results[0].USER_FNAME,
          email: results[0].USER_EMAIL,
          lastSeen: results[0].LAST_SEEN
        })
      } else {
        // login failure
        reject(new Error('Username or password invalid'))
      }
    } catch (e) {
      reject(e)
    }
  })
}

pool.updateProfile = info => {
  console.log(info)
  return new Promise(async (resolve, reject) => {
    const newColumns = {}
    if (info.firstName) newColumns.USER_FNAME = info.firstName
    if (info.lastName) newColumns.USER_LNAME = info.lastName
    if (info.email) newColumns.USER_EMAIL = info.email

    try {
      if (info.password) {
        // Separate query for user password to avoid nasty control flow.
        const hash = await bcrypt.hash(info.password, 10)
        pool.query('UPDATE USER SET USER_PASS_HASH = ? WHERE USER_ID = ?', [hash, info.id])
      }

      // Check to make sure there are attributes to set
      if (Object.keys(newColumns).length !== 0) {
        var UPDATE_PROFILE_Q = `UPDATE USER SET ? WHERE USER_ID = ?`
        pool.query(UPDATE_PROFILE_Q, [newColumns, info.id])
      }
    } catch (e) {
      reject(e)
    }
  })
}

const GET_USER_Q = 'SELECT * FROM USER WHERE USER_ID = ?'
pool.getUserWithId = id => pool.query(GET_USER_Q, [ id ])

const VERIFY_Q = 'UPDATE USER SET VERIFIED = \'1\' WHERE VERIFICATION = ?'
pool.verifyUser = token => pool.query(VERIFY_Q, [token])

const PROFILE_Q = `SELECT USER_FNAME, USER_LNAME, USERNAME, USER_PICT_URL
FROM USER WHERE USER_ID = ?`
pool.getProfileData = id => pool.query(PROFILE_Q, [ id ])

const LAST_SEEN_Q = `
UPDATE USER
  SET LAST_SEEN = CURRENT_TIMESTAMP()
  WHERE USER_ID = ?`
pool.updateLastSeen = id => pool.query(LAST_SEEN_Q, [ id ])

module.exports = pool
