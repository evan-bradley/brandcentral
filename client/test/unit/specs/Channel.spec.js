import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import Channel from '@/components/Channel.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('Channel', () => {
  describe('data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof Channel.data).to.equal('function')
      const data = Channel.data()
      const mockItem = new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61rzIAnzTQL._UX522_.jpg')
      expect(data.currentItem).to.deep.equal(mockItem)
    })
  })
})
