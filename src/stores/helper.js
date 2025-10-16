import { defineStore } from 'pinia'
import { Screen } from 'quasar'
import axios from 'axios'
import * as utils from 'src/util'
import { useUserStore } from './user'
import { useCandidateStore } from './candidate'

export const useHelperStore = defineStore('helper', {
  state: () => ({
    apiHost: process.env.DEV
      ? process.env.DEV_HOST
      : process.env.NGROKTESTING
        ? process.env.NGROK_HOST
        : process.env.API_HOST,
    currentScreen: Screen.name,
    currentScreenProperty: Screen,
    darkMode: false,
    logoffUser: false,
    appLoading: false,
    userStore: useUserStore(),
    candidateStore: useCandidateStore(),
    modulesHashMap: {},
    modules: [],
    modulesOptions: [],
    notification: {
      displayNotify: false,
      message: '',
      type: '',
    },
    scrollAreaThumbStyle: {
      right: '4px',
      borderRadius: '5px',
      backgroundColor: '#0d47a1',
      width: '5px',
      opacity: 0.75,
    },
    scrollAreaBarStyle: {
      right: '2px',
      borderRadius: '9px',
      backgroundColor: '#0d47a1',
      width: '9px',
      opacity: 0.2,
    },
    navLinks: [
      {
        link: '/dashboard',
        altName: 'dashboard',
        name: 'dashboard',
        label: 'Dashboard',
        icon: 'fa fa-tachometer',
        roles: ['standard user', 'admin'],
      },
      {
        link: '/inquiries',
        altName: 'inquiries',
        name: 'inquiries',
        label: 'Inquiries',
        icon: 'fa fa-person-circle-question',
        roles: ['standard user', 'admin'],
      },
      {
        link: '/clients',
        altName: 'clients',
        name: 'clients',
        label: 'Clients',
        icon: 'fa fa-people-group',
        roles: ['standard user', 'admin'],
      },
    ],
  }),
  actions: {
    setLogoffUser(payload) {
      this.logoffUser = payload
    },
    setNotification(payload) {
      this.notification = payload
    },
    setAppLoading(payload) {
      this.appLoading = payload
    },

    queryToStr(query) {
      if (query === null || query === undefined) {
        return ''
      }
      return `?${Object.entries(query)
        .map((entry) => `${entry[0]}=${entry[1]}`)
        .join('&')}`
    },

    async initStores() {
      // if (this.modules.length === 0) {
      //   await this.getModules()
      // }
      if (this.candidateStore.candidateStatus.length === 0) {
        await this.candidateStore.getCandidateStatus()
      }

      if (this.candidateStore.supervisors.length === 0) {
        await this.candidateStore.getSupervisors()
      }

      // if (this.sectionStore.sections.length === 0) {
      //   await this.sectionStore.getSections()
      // }
      // if (this.departmentStore.departments.length === 0) {
      //   await this.departmentStore.getDepartments()
      // }
      // if (this.subtypeStore.subTypes.length === 0) {
      //   await this.subtypeStore.getSubtypes()
      // }
      // if (utils.isObjAndNotEmpty(this.userStore.userLoginInfo)) {
      //   await this.queueCounterStore.getQueueCounters({
      //     module_code: this.userStore.userLoginInfo.module_code,
      //   })
      // }
    },

    async request(arg) {
      const { url, method, headers = {}, data, handler, detailed } = arg

      const config = {
        timeout: process.env.HTTP_REQ_TIMEOUT,
        withCredentials: true,
        headers: {
          ...headers,
          ...(process.env.NGROKTESTING && { 'ngrok-skip-browser-warning': true }),
        },
      }

      // `process.env` vars which evaluate to `true` are tree-shaked during build/compilation
      if (process.env.DEV) console.log(`[${method.toUpperCase()}] ${url} :`, data)

      try {
        // const response = await axios[method](url, ...args);
        let response = ''
        if (['get', 'delete'].includes(method)) {
          response = await axios[method](url, config)
        } else {
          response = await axios[method](url, data, config)
        }

        // HTTP payload is automatically parsed by axios into JS object
        // HTTP Status Code 400 and up are error codes
        if (response.status >= 400) throw `HTTP Error code received: ${response.status}`

        if (process.env.DEV) console.log('Response data: ', response.data)

        if (handler.constructor.name === 'AsyncFunction') {
          await handler(response.data)
        } else {
          handler(response.data)
        }
        if (detailed) {
          return response.data.data !== undefined ? response.data.data : response.data
        }
      } catch (err) {
        if (process.env.DEV) console.log(err)
        if (detailed) {
          if (err.response !== undefined) {
            console.log(err.response.data)
            if (err.response.data.status === 'error') {
              let notifPayload = {
                displayNotify: true,
                message: err.response.data.message,
                type: 'negative',
              }

              this.notification = notifPayload
              await utils.delay(1500)
              const notifInitPayload = {
                displayNotify: false,
                message: '',
                type: '',
              }
              this.notification = notifInitPayload
              return false
            }
            if (err.response.data.error.tokenError !== undefined) {
              this.logoffUser = true
              return false
            }
            let notifPayload = {
              displayNotify: true,
              message: err.response.data.error,
              type: 'negative',
            }

            this.notification = notifPayload
            await utils.delay(1500)
            const notifInitPayload = {
              displayNotify: false,
              message: '',
              type: '',
            }
            this.notification = notifInitPayload
            return false
          }
          let notifPayload = {
            displayNotify: true,
            message: `${err}`,
            type: 'negative',
          }

          this.notification = notifPayload

          await utils.delay(1500)
          const notifInitPayload = {
            displayNotify: false,
            message: '',
            type: '',
          }
          this.notification = notifInitPayload
          return false
        }
        return false
      }

      return true
    },

    async getModules(query) {
      const queryStr = this.queryToStr(query)

      return await this.request({
        url: `${this.apiHost}/modules${queryStr}`,
        method: 'get',
        detailed: true,
        handler: (data) => {
          if (Object.keys(data).length > 0) {
            const filterActive = data.data.filter((filterActive) => filterActive.active)
            this.modulesHashMap = utils.buildHashTable(filterActive, 'code')
            this.modulesOptions = utils.buildOptionsArray(filterActive, 'app', 'code')
            this.modules = filterActive
          }
        },
      })
    },
  },
})
