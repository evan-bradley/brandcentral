process.env.NODE_ENV = 'test'

const { describe, it, beforeEach, afterEach } = require('mocha')
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const standard = require('mocha-standard')

const mysql = require('promise-mysql')
process.env.DB_NAME = 'BRAND_CENTRAL_TESTING'
const server = require('../src/server')

const pool = mysql.createPool({
  'connectionLimit': 5,
  'host': 'localhost',
  'user': 'root',
  'password': 'Mickey26!',
  'database': 'BRAND_CENTRAL_TESTING',
  'waitForConnections': true,
  'timezone': 'utc',
  'multipleStatements': 'true'
})

describe('Style tests', () => {
  it('Conforms to standard', standard.files([ '../src/*.js' ]))
})

describe('HTTP Routes', () => {
  beforeEach((done) => {
    done()
  })

  afterEach((done) => {
    done()
  })

  it('Should GET /', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      should.not.exist(err)
      res.status.should.equal(200)
      done()
    })
  })

  /* it('Should POST /api/register', (done) => {
    chai.request(server)
    .post('/api/register')
    .end((err, res) => {
      should.not.exist(err)
      res.status.should.equal(200)
      done()
    })
  })

  it('Should POST /api/login', (done) => {
    chai.request(server)
    .post('/api/login')
    .end((err, res) => {
      should.not.exist(err)
      res.status.should.equal(200)
      done()
    })
  }) */
})

const userData = {
  username: 'tester',
  email: 'test@null',
  lastName: 'titor',
  firstName: 'john',
  password: 'password'
}
let id

let sessionID

describe('Registering a user', () => {
  it('Should POST to /api/register', () => {
    return new Promise((resolve, reject) => {
      try {
        chai.request(server)
          .post('/api/register')
          .send(userData)
          .end((err, res) => {
            should.not.exist(err)
            res.status.should.equal(200)
            res.body.success.should.equal(true)
            should.exist(res.body.id)

            id = res.body.id
            sessionID = res.session.userId
            resolve()
          })
      } catch (e) {
        reject(e)
      }
    })
  })

  it('Should create a new user', () => {
    return new Promise(async (resolve, reject) => {
      const user = (await pool.query('select * from user'))[0]
      should.exist(user)
      user.USER_ID.should.equal(id)
      user.USERNAME.should.equal(userData.username)
      user.USER_EMAIL.should.equal(userData.email)
      user.USER_LNAME.should.equal(userData.lastName)
      user.USER_FNAME.should.equal(userData.firstName)
      user.VERIFIED.should.equal(0)
      // Going to assume password is correct for now.

      resolve()
    })
  })

  it('Should POST to /api/verify with a rigged code', () => {
    return new Promise(async (resolve, reject) => {
      const user = (await pool.query('select * from user'))[0]
      user.VERIFIED.should.equal(0)

      chai.request(server)
        .post('/api/verify')
        .send({
          code: user.VER_CODE
        })
        .end((err, res) => {
          should.not.exist(err)
          res.body.success.should.equal(true)
          resolve()
        })
    })
  })

  it('Should verify using a code', () => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = (await pool.query('select * from user'))[0]
        user.VERIFIED.should.equal(1)

        await pool.query('update user set verified = \'0\' where verified = 1')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  })

  it('Should POST to /api/verify with a rigged token', () => {
    return new Promise(async (resolve, reject) => {
      // Check that the user has been un-verified before this runs,
      // or the test is meaningless.
      const user = (await pool.query('select * from user'))[0]
      user.VERIFIED.should.equal(0)

      chai.request(server)
        .post('/api/verify')
        .send({
          token: user.VER_TOKEN
        })
        .end((err, res) => {
          should.not.exist(err)
          res.body.success.should.equal(true)
          resolve()
        })
    })
  })

  it('Should verify using a token', () => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = (await pool.query('select * from user'))[0]
        user.VERIFIED.should.equal(1)

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  })
})

describe('Logging in', () => {
  it('Should POST to /api/login', () => {
    return new Promise((resolve, reject) => {
      chai.request(server)
        .post('/api/login')
        .send({
          username: userData.username,
          password: userData.password
        })
        .end((err, res) => {
          should.not.exist(err)
          res.body.success.should.equal(true)
          // TODO: Check other values

          resolve()
        })
    })
  })
})

describe('Channel navigation', () => {
  it('Should GET /api/product', () => {
    return new Promise((resolve, reject) => {
      chai.request(server)
        .get('/api/product?channelId=1')
        .end((err, res) => {
          should.not.exist(err)
          // console.log(res.body)
          res.body.success.should.equal(true)
          should.exist(res.body.product)
          // TODO: Check other values

          resolve()
        })
    })
  })
})
const likeData = {
  productID: '15',
  productName: 'testname',
  userID: '5'
}
describe('Liking a product', () => {
  it('Should POST to /api/product/like/:id', () => {
      return new Promise((resolve, reject) => {
        chai.request(server)
        .post(`/api/product/like/${likeData.productID}`)
        .send({
          //id: likeData.productID
          //uid: sessionID
        })
        .end((err, res) => {
        should.not.exist(err)
      res.body.success.should.equal(true)
      resolve()
    })
  })
})
it('Should create a new like', () => {
  return new Promise(async (resolve, reject) => {
    const like = (await pool.query('select * from likes'))[0]
    should.exist(like)
    like.USER_ID.should.equal(sessionID)
    like.PRODUCT_ID.should.equal(likeData.productID)
    resolve()
    })
  })
})

describe('Disliking a product', () => {
  it('Should POST to /api/product/dislike/:id', () => {
      return new Promise((resolve, reject) => {
        chai.request(server)
        .post(`/api/product/dislike/${likeData.productID}`)
        .send({
          //pid: productData.productID
        })
        .end((err, res) => {
        should.not.exist(err)
      res.body.success.should.equal(true)
      resolve()
    })
  })
})
it('Should create a new dislike', () => {
  return new Promise(async (resolve, reject) => {
    const dislike = (await pool.query('select * from dislikes'))[0]
    should.exist(dislike)
    dislike.USER_ID.should.equal(sessionID)
    dislike.PRODUCT_ID.should.equal(likeData.productID)
    resolve()
    })
  })
})

describe('Cleanup', () => {
  it('Clean up database', () => {
    return new Promise(async (resolve, reject) => {
      try {
        await pool.query('delete from user;', [])
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  })
})
