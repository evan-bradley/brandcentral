import Vue from 'vue'
import VueResource from 'vue-resource'
import Register from '@/components/Register.vue'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)

Vue.http.interceptors.unshift((request, next) => {
  // console.log(request)
  // console.log(next)
  if (request.url === '/api/register') {
    next(request.respondWith({ status: 200 }))
  }
})

describe('Register', () => {
  beforeEach(() => {
    let component = new Vue(Register).$mount()
  })

  it('Register is a method', () => {
    expect(typeof Register.data).to.equal('function')
  })

  it('data is a function and returns blanks', () => {
    expect(typeof Register.data).to.equal('function')
    const data = Register.data()
    const newUser = new Classes.User()
    expect(data.user.Id).to.equal(newUser.Id)
    expect(data.user.FirstName).to.equal(newUser.FirstName)
    expect(data.user.LastName).to.equal(newUser.LastName)
    expect(data.user.UserName).to.equal(newUser.UserName)
    expect(data.user.Email).to.equal(newUser.Email)
    expect(data.user.Password).to.equal(newUser.Password)
    expect(data.confirmPassword).to.equal('')
    expect(data.failureMessage).to.equal('')
  })

  it('testing Register - no username', () => {
    let component = new Vue(Register).$mount()
    const newUser = new Classes.User()
    expect(component.user.Id).to.equal(newUser.Id)
    expect(component.user.FirstName).to.equal(newUser.FirstName)
    expect(component.user.LastName).to.equal(newUser.LastName)
    expect(component.user.UserName).to.equal(newUser.UserName)
    expect(component.user.Email).to.equal(newUser.Email)
    expect(component.user.Password).to.equal(newUser.Password)
    expect(component.confirmPassword).to.equal('')
    expect(component.failureMessage).to.equal('')

    component.Register()

    expect(component._data.failureMessage).to.equal('Username cannot be blank')
  })

  it('testing  Register - non matching passwords', () => {
    let component = new Vue(Register).$mount()
    const newUser = new Classes.User()
    expect(component.user.Id).to.equal(newUser.Id)
    expect(component.user.FirstName).to.equal(newUser.FirstName)
    expect(component.user.LastName).to.equal(newUser.LastName)
    expect(component.user.UserName).to.equal(newUser.UserName)
    expect(component.user.Email).to.equal(newUser.Email)
    expect(component.user.Password).to.equal(newUser.Password)
    expect(component.confirmPassword).to.equal('')
    expect(component.failureMessage).to.equal('')

    component.user.UserName = 'test'
    component.failureMessage = ''
    component.confirmPassword = 'not test'

    component.Register()

    expect(component._data.failureMessage).to.equal('Passwords must match')
  })

  it('testing  Register - passing', () => {
    let component = new Vue(Register).$mount()
    const newUser = new Classes.User()
    component.failureMessage = ''
    expect(component.user.Id).to.equal(newUser.Id)
    expect(component.user.FirstName).to.equal(newUser.FirstName)
    expect(component.user.LastName).to.equal(newUser.LastName)
    expect(component.user.UserName).to.equal(newUser.UserName)
    expect(component.user.Email).to.equal(newUser.Email)
    expect(component.user.Password).to.equal(newUser.Password)
    expect(component.confirmPassword).to.equal('')
    expect(component.failureMessage).to.equal('')

    component.user.UserName = 'test'
    component.user.Password = 'test'
    component.confirmPassword = 'test'
    console.log('pre reg')
    component.Register()

    expect(component._data.failureMessage).to.equal('')
  })

  // it('should display an error when email is invalid', () => {
  //   // const button = RegisterComponent.$el.querySelector('#register-button')
  //   RegisterComponent.user.email = 'not an email'
  //   // button.dispatchEvent(new window.event('click'))
  //   // RegisterComponent._watcher.run()
  //   expect(RegisterComponent.$el.querySelector('#email-error-message')).to.exists
  // })
})
