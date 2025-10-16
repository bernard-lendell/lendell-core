import { defineStore } from 'pinia'
import { useHelperStore } from './helper' // Import the other store

import { Cookies } from 'quasar'
import decodeJWT from 'jwt-decode'

export const useUserStore = defineStore('user', {
  state: () => ({
    helper: useHelperStore(),
    userLoginInfo: {},
  }),
  actions: {
    async authenticate(payload) {
      return await this.helper.request({
        url: `${this.helper.apiHost}/auth/login`,
        method: 'post',
        detailed: true,
        data: payload,
        handler: (data) => {
          if (!data) {
            return
          }

          const decodedJWT = decodeJWT(data.data.userToken)
          Cookies.set('user_data', decodedJWT)
          decodedJWT.userToken = data

          this.userLoginInfo = decodedJWT
        },
      })
    },

    async inauthenticate(payload) {
      const cookieValue = Cookies.get('user_data')
      Cookies.remove('user_data')

      return await this.helper.request({
        url: `${this.helper.apiHost}/auth/logout`,
        method: 'post',
        headers: {
          Authorization: `bearer ${cookieValue}`,
        },
        detailed: true,
        data: payload,
        handler: () => {
          Cookies.remove('access_token')
          this.helper.logoffUser = false
          this.userLoginInfo = {}
        },
      })
    },

    async setUserCookies() {
      const cookieValue = Cookies.get('user_data')
      this.userLoginInfo = cookieValue
    },
  },
})
