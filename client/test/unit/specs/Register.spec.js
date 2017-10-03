import Vue from 'vue'
import Register from '@/components/Register.vue'

describe('Register', () => {
  var RegisterComponent

  beforeEach(() => {
    const Constructor = Vue.extend(Register)
    const RegisterComponent = new Constructor().$mount()
  })

  it('should display an error when email is invalid', () => {
    // const button = RegisterComponent.$el.querySelector('#register-button')
    RegisterComponent.user.email = 'not an email'
    // button.dispatchEvent(new window.event('click'))
    // RegisterComponent._watcher.run()
    expect(RegisterComponent.$el.querySelector('#email-error-message')).to.exists
  })
})
