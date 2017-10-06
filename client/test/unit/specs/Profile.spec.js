import Vue from 'vue'
import Vuex from 'vuex'
import Profile from '@/components/Profile.vue'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

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
  let component

  beforeEach(() => {
    component = new Vue(Profile).$mount()
    store = new Vuex.Store({
      state: {
        loggedIn: false,
        userName: 'testUser',
        User: new Classes.User()
      }
    })
    Profile.$store = store
  })

  it('data is a function and returns blanks', () => {
    expect(typeof Profile.data).to.equal('function')
    const data = Profile.data()
    const newUser = new Classes.User()
    expect(data.User).to.deep.equal(newUser)
  })

  describe('hash', () => {
    var testEmail = 'test@gmail.com'
    var hashValue = '1aedb8d9dc4751e229a335e371db8058'

    it('should be a function', () => {
      expect(typeof component.hash).to.equal('function')
    })

    it('should be unique', () => {
      const firstHash = component.hash('testing')
      const secondHash = component.hash('not testing')
      expect(firstHash).to.not.equal(secondHash)
    })

    it('should be reproducible', () => {
      const firstHash = component.hash('testing')
      const secondHash = component.hash('testing')
      expect(firstHash).to.equal(secondHash)
    })

    it('should generate an md5 hash', () => {
      expect(component.hash(testEmail)).to.equal(hashValue)
    })
  })
})
