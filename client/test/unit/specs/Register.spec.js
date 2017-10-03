import Vue from 'vue'
import Register from '@/components/Register.vue'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

describe('Register', () => {
  function getComponent (Component) {
    return new Vue(Component).$mount()
  }

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

  it('testing functions', () => {
    var component = getComponent(Register)
    // console.log(component)

    const newUser = new Classes.User()
    expect(component.user.Id).to.equal(newUser.Id)
    expect(component.user.FirstName).to.equal(newUser.FirstName)
    expect(component.user.LastName).to.equal(newUser.LastName)
    expect(component.user.UserName).to.equal(newUser.UserName)
    expect(component.user.Email).to.equal(newUser.Email)
    expect(component.user.Password).to.equal(newUser.Password)
    expect(component.confirmPassword).to.equal('')
    expect(component.failureMessage).to.equal('')

    // console.log(component)
    console.log(component._renderProxy.$options.methods.Register())
    component.methods.Register()

    expect(component._data.failureMessage).to.equal('Username cannot be blank')
  })

  // it('should display an error when email is invalid', () => {
  //   // const button = RegisterComponent.$el.querySelector('#register-button')
  //   RegisterComponent.user.email = 'not an email'
  //   // button.dispatchEvent(new window.event('click'))
  //   // RegisterComponent._watcher.run()
  //   expect(RegisterComponent.$el.querySelector('#email-error-message')).to.exists
  // })
})
