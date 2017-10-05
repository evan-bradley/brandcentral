import Vue from 'vue'
import Vuex from 'vuex'
import Profile from '@/components/Profile.vue'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes
var md5 = require('md5')

Vue.use(Vuex)

describe('Profile', () => {
  // import { mount } from 'avoriaz'
  // import State from '../../../src/Vuex/states.js'
  // let vueComponent
  // let store
  // let componet
  // beforeEach(() => {
  //   vueComponent = new Vue(Profile)
  //   store = new Vuex.Store({
  //     state: {
  //       loggedIn: false,
  //       userName: 'testUser',
  //       User: new Classes.User()
  //     }
  //   })

  //   componet = mount(vueComponent, { store })
  // })

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        loggedIn: false,
        userName: 'testUser',
        User: new Classes.User()
      }
    })
  })

  it('Profile data is a method', () => {
    expect(typeof Profile.data).to.equal('function')
  })

  it('data is a function and returns blanks', () => {
    Profile.$store = store
    console.log(Profile)
    expect(typeof Profile.data).to.equal('function')
    const data = Profile.data()
    const newUser = new Classes.User()
    expect(data.User.Id).to.equal(newUser.Id)
    expect(data.User.FirstName).to.equal(newUser.FirstName)
    expect(data.User.LastName).to.equal(newUser.LastName)
    expect(data.User.UserName).to.equal(newUser.UserName)
    expect(data.User.Email).to.equal(newUser.Email)
    expect(data.User.Password).to.equal(newUser.Password)
  })

  it('Profile hash is unique', () => {
    expect(typeof Profile.methods.hash).to.equal('function')
    const profileHash = Profile.methods.hash('testing')
    const md5hash = md5('testing')
    const othermd5hash = md5('ops')
    expect(profileHash).to.equal(md5hash)
    expect(profileHash).to.not.equal(othermd5hash)
  })
})
