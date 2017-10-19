/*
 * db.js -- Database setup and related functions.
 */
'use strict'

const mysql = require('promise-mysql')
const bcrypt = require('bcrypt')
const moment = require('moment-range').extendMoment(require('moment'))
const crypto = require('crypto-promise')

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
const REGISTER_Q = `INSERT INTO USER
(USERNAME, USER_LNAME, USER_FNAME, USER_EMAIL, USER_PASS_HASH, VER_TOKEN, VER_CODE, LAST_SEEN)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
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
        const token = (await crypto.randomBytes(16)).toString('hex')
        const code = [...(await crypto.randomBytes(6))].map(num => num % 10).join('')
        const res = await pool.query(REGISTER_Q, [
          info.username,
          info.lastName,
          info.firstName,
          info.email,
          hash,
          token,
          code,
          moment().format('YYYY-MM-DD HH:mm:ss')
        ])

        res.token = token
        res.code = code
        resolve(res)
        // if (err.code === 'ER_DUP_ENTRY')
        // err.message = 'A user with that ID is already registered'
      }
    } catch (e) {
      reject(e)
    }
  })
}

const DUPCHECKEMAIL_Q = 'SELECT USER_EMAIL FROM USER WHERE USER_EMAIL = ?'
const CHANGEEMAIL_Q = 'UPDATE USER SET USER_EMAIL = ?, VERIFIED = \'0\', VER_TOKEN = ? WHERE USER_EMAIL = ?;'
pool.CheckNewEmail = info => {
  return new Promise(async (resolve, reject) => {
    if (!info.NewEmail) {
      reject(new Error('Missing Email'))
      return
    }

    try {
      const results = await pool.query(DUPCHECKEMAIL_Q, [info.NewEmail])
      if (results.length > 0) {
        reject(new Error('Email already used'))
      } else {
        require('crypto').randomBytes(16, async (err, buffer) => {
          if (err) {
            reject(err)
          }

          const token = buffer.toString('hex')
          const res = await pool.query(CHANGEEMAIL_Q, [info.NewEmail, token, info.currentEmail])
          res.token = token
          resolve(res)
        })
        // if (err.code === 'ER_DUP_ENTRY')
        // err.message = 'A user with that ID is already registered'
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

const GETPASSHASH_Q = 'SELECT USER_PASS_HASH FROM USER WHERE USER_ID = ?'
pool.verifyPassword = (user, pass) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await pool.query(GETPASSHASH_Q, [ user ])

    if (results.length === 0) {
    // login failure
    reject(new Error('user id invalid'))
    return
  }

  const res = await bcrypt.compare(pass.password, results[0].USER_PASS_HASH)

  if (res) {
    // successful login
    resolve()
  } else {
    // login failure
    reject(new Error('password invalid'))
  }
} catch (e) {
    reject(e)
  }
})
}

pool.updateProfile = info => {
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

const VERIFY_TOKEN_Q = 'UPDATE USER SET VERIFIED = \'1\' WHERE VER_TOKEN = ?'
pool.verifyUserToken = token => pool.query(VERIFY_TOKEN_Q, [ token ])

const VERIFY_CODE_Q = 'UPDATE USER SET VERIFIED = \'1\' WHERE VER_CODE = ?'
pool.verifyUserCode = code => pool.query(VERIFY_CODE_Q, [ code ])

const PROFILE_Q = `SELECT USER_FNAME, USER_LNAME, USERNAME, USER_PICT_URL
FROM USER WHERE USER_ID = ?`
pool.getProfileData = id => pool.query(PROFILE_Q, [ id ])

// This function will query the database for the first 16 tags.
const GET_ONBOARD_CHANNELS_Q = `SELECT * FROM CHANNEL LIMIT 16;`
pool.getOnboardChannels = pool.query.bind(pool, GET_ONBOARD_CHANNELS_Q, [])

const LAST_SEEN_Q = `
UPDATE USER
  SET LAST_SEEN = CURRENT_TIMESTAMP()
  WHERE USER_ID = ?`
pool.updateLastSeen = id => pool.query(LAST_SEEN_Q, [ id ])

/**
 * If the token is valid and exists in the system, the password for the user
 * associated with that token is changed to newPassword.
 * @param {String} token
 * @param {String} newPassword
 * @param {Function} callback
 */
const CHECKTOKEN_Q = 'SELECT USER_ID FROM RESET_PASSWORD_TOKENS WHERE TOKEN = ?;'
const CHANGEPASSWORD_Q = 'UPDATE USER SET USER_PASS_HASH = ? WHERE USER_ID = ?;'
pool.verifyTokenResetPassword = (token, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await pool.query(CHECKTOKEN_Q, [ token ])
      if (results.length > 0) {
        const hash = await bcrypt.hash(newPassword, 10)
        await pool.query(CHANGEPASSWORD_Q, [ hash, results[0].USER_ID ])
        resolve()
      } else {
        reject(new Error('Token not found'))
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Generates a password reset token for the specified email. The email must
 * exist in the database in order to generate a password reset token.
 * @param {String} email
 */
const CHECKEMAIL_Q = 'SELECT USER_ID, USER_EMAIL FROM USER WHERE USER_EMAIL = ?;'
const WRITETOKEN_Q = 'INSERT INTO RESET_PASSWORD_TOKENS (USER_ID , TOKEN) VALUES(?, ?);'
pool.generatePasswordResetToken = email => {
  return new Promise(async (resolve, reject) => {
    if (!email) {
      reject(new Error('Missing email'))
    } else {
      try {
        const results = await pool.query(CHECKEMAIL_Q, [ email ])
        if (results.length > 0) {
          // TODO: Are we going to use this value?
          // const hash = await bcrypt.hash(email, 10)
          require('crypto').randomBytes(16, async (err, buffer) => {
            if (err) {
              reject(err)
            }

            const token = buffer.toString('hex')
            await pool.query(WRITETOKEN_Q, [ results[0].USER_ID, token ])
            resolve(token)
          })
        } else {
          reject(new Error('Email not found'))
        }
      } catch (e) {
        reject(e)
      }
    }
  })
}

const STORE_USER_CHANNEL_Q = 'INSERT INTO CHANNEL_USER_ASSIGN (CHANNEL_ID, USER_ID) VALUES ?;'
pool.storeUserChannels = (user, channels) => {
  return new Promise(async (resolve, reject) => {
    if (!channels || channels.length === 0) {
      reject(new Error('Missing channels'))
    }

    try {
      const values = channels.map(channel => [ channel, parseInt(user) ])
      await pool.query(STORE_USER_CHANNEL_Q, [ values ])
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

const SELECT_USER_CHANNEL_Q = 'SELECT CHANNEL.CHANNEL_ID, CHANNEL_NAME FROM (CHANNEL INNER JOIN CHANNEL_USER_ASSIGN ON CHANNEL.CHANNEL_ID = CHANNEL_USER_ASSIGN.CHANNEL_ID) WHERE USER_ID = ?;'
pool.retrieveUserChannels = user => {
  return new Promise(async (resolve, reject) => {
    if (!user) {
      reject(new Error('Missing user'))
    }

    try {
      const results = await pool.query(SELECT_USER_CHANNEL_Q, [ user ])
      const channelsArray = results.map(result => {
        return { id: result.CHANNEL_ID, name: result.CHANNEL_NAME }
      })

      resolve(channelsArray)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

const GET_RAND_PRODUCT_Q = 'SELECT * FROM (((PRODUCT INNER JOIN PROD_TAG_ASSIGN ON PRODUCT.PRODUCT_ID = PROD_TAG_ASSIGN.PRODUCT_ID) INNER JOIN TAG ON PROD_TAG_ASSIGN.TAG_ID = TAG.TAG_ID) INNER JOIN CHANNEL_TAG_ASSIGN ON TAG.TAG_ID = CHANNEL_TAG_ASSIGN.TAG_ID) WHERE CHANNEL_TAG_ASSIGN.CHANNEL_ID = ?;'
pool.getRandomProduct = channel => {
  return new Promise(async (resolve, reject) => {
    if (!channel) {
      reject(new Error('Missing channels'))
    }

    // const productCount = await pool.query('SELECT COUNT(*) FROM PRODUCT')
    // const productId = parseInt(Math.random() * (productCount[0]['COUNT(*)'] - 0) + 0, 10)
    // const code = [...(await crypto.randomBytes(6))].map(num => num % 10).join('')
    // console.log(productId)
    try {
      const results = await pool.query(GET_RAND_PRODUCT_Q, [ channel ])

      if (results.length > 0) {
        const productNum = parseInt(Math.random() * (results.length - 0) + 0, 10)
        const product = {
          id: results[productNum].PRODUCT_ID,
          name: results[productNum].PROD_NAME,
          description: results[productNum].PROD_DESC,
          pictureUrl: results[productNum].PROD_PICT_URL,
          productUrl: results[productNum].PROD_URL,
          model: results[productNum].PROD_MODEL
        }

        resolve(product)
      } else {
        reject(new Error('No product found.'))
      }
    } catch (e) {
      reject(e)
    }
  })
}

pool.likeProduct = (user, product) => {
  return new Promise(async (resolve, reject) => {
  })
}

pool.unlikeProduct = (user, product) => {
  return new Promise(async (resolve, reject) => {
  })
}

pool.followUser = (follower, followee) => {
  return new Promise(async (resolve, reject) => {
  })
}

pool.unfollowUser = (follower, followee) => {
  return new Promise(async (resolve, reject) => {
  })
}

const FOLLOWING_Q = 'SELECT USERNAME AND FOLLOWING.USER_FOLLOWED_ID FROM (FOLLOWING INNER JOIN USER ON FOLLOWING.USER_FOLLOWED_ID = USER.USER_ID) WHERE FOLLOWING.FOLLOWER_ID = ?'
pool.getFollowing = user => {
  return new Promise(async (resolve, reject) => {
      if (!user) {
      reject(new Error('Missing user id'))
      return
    }

    try {
      const results = await pool.query(FOLLOWING_Q, [user])
      resolve(results)

    } catch (e) {
      reject(e)
    }
  })
}
const LIKEDPRODUCTS_Q = 'SELECT * FROM (LIKES INNER JOIN PRODUCT ON LIKES.PRODUCT_ID = PRODUCT.PRODUCT_ID) WHERE LIKES.USER_ID = ? LIMIT ?,?'
pool.getLikedProducts = (user, page, productsPer) => {
  return new Promise(async (resolve, reject) => {
      if (!user || !info) {
      reject(new Error('Missing required field'))
      return
    }

    try {
        const startproduct = ((page - 1)*productsPer)
      const endproduct = (page*productsPer) - 1
      const results = await pool.query(LIKEDPRODUCTS_Q, [user, startproduct, endproduct ])
      var productsarray = new Array[info.numOfProducts]
      if (results.length > 0) {
        for (i = 0; i < results.length; i++) {
          const product = {
            id: results[i].PRODUCT.PRODUCT_ID,
            name: results[i].PROD_NAME,
            description: results[i].PROD_DESC,
            pictureUrl: results[i].PROD_PICT_URL,
            productUrl: results[i].PROD_URL,
            model: results[i].PROD_MODEL
          }
          productsarray[i] = product
        }

        resolve(productsarray)
      } else{resolve()}

    } catch (e) {
      reject(e)
    }
  })
}

const UNSUBSCRIBECHANNEL_Q = 'DELETE FROM CHANNEL_USER_ASSIGN WHERE CHANNEL_ID = ? AND USER_ID = ?;'
pool.unsubscribeChannel = (user, channel) => {
    return new Promise(async (resolve, reject) => {
      if (!user || !channel) {
      reject(new Error('Missing a required field'))
      return
    }

    try {
      await pool.query(UNSUBSCRIBECHANNEL_Q, [user, channel])
      resolve()

    } catch (e) {
      reject(e)
    }
  })
}

const SUBSCRIBECHANNEL_Q = 'INSERT INTO CHANNEL_USER_ASSIGN (USER_ID, CHANNEL_ID) VALUES(?, ?)'
pool.subscribeChannel = (user, channel) => {
  return new Promise(async (resolve, reject) => {
      if (!user || !channel) {
      reject(new Error('Missing a required field'))
      return
    }

    try {
      await pool.query(SUBSCRIBECHANNEL_Q, [user, channel])
      resolve()

    } catch (e) {
      reject(e)
    }
  })
}

module.exports = pool
