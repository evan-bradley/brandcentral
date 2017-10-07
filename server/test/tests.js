process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const standard = require('mocha-standard')

const server = require('../src/server')

describe('Style tests', () => {
  it('conforms to standard', standard.files([ '../src/*.js' ]))
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
