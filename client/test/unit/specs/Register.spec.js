import Vue from 'vue'
import VueResource from 'vue-resource'
import Register from '@/components/Register.vue'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)

Vue.http.interceptors.unshift((request, next) => {
  if (request.url === '/api/register') {
    next(request.respondWith({ status: 200 }))
  }
})

describe('Register', () => {
  var component

  beforeEach(() => {
    component = new Vue(Register).$mount()
  })

  it('data is a function and returns blanks', () => {
    expect(typeof Register.data).to.equal('function')
    const data = Register.data()
    const newUser = new Classes.User()
    expect(data.user).to.deep.equal(newUser)
    expect(data.confirmPassword).to.equal('')
    expect(data.failureMessage).to.equal('')
  })

  describe('register', () => {
    const newUser = new Classes.User()

    it('should be a function', () => {
      expect(typeof Register.methods.register).to.equal('function')
    })

    // describe('invalid email', () => {
    //   it('should display error', (done) => {
    //     component.user.Email = 'invalid-email'
    //     component.user.UserName = 'username'
    //     component.user.Password = 'password'
    //     component.confirmPassword = 'password'
    //     component.Regsiter()
    //     Vue.nextTick(() => {
    //       expect(component.$el.querySelector('#email-error-message').textContent).to.equal('The email field must be a valid email.')
    //       done()
    //     })
    //   })
    // })

    it('should display error when no username is provided', () => {
      expect(component.user).to.deep.equal(newUser)
      expect(component.confirmPassword).to.equal('')
      expect(component.failureMessage).to.equal('')

      component.register()

      expect(component._data.failureMessage).to.equal('Username cannot be blank')
    })

    it('should display error when passwords do not match', () => {
      expect(component.user).to.deep.equal(newUser)

      component.user.UserName = 'test'
      component.user.Password = 'test'
      component.confirmPassword = 'not test'

      component.register()

      expect(component._data.failureMessage).to.equal('Passwords must match')
    })

    it('should not display an error when all inputs are valid', () => {
      let component = new Vue(Register).$mount()
      component.failureMessage = ''
      expect(component.user).to.deep.equal(newUser)

      component.user.UserName = 'test'
      component.user.Password = 'test'
      component.confirmPassword = 'test'

      component.register()

      expect(component._data.failureMessage).to.equal('')
    })
  })
})
