import { defineStore } from 'pinia'
import { useHelperStore } from './helper' // Import the other store

export const useQueueStore = defineStore('queue', {
  state: () => ({
    helper: useHelperStore(),
  }),
  actions: {
    async generateQueue(payload) {
      return await this.helper.request({
        url: `${this.helper.apiHost}/queues`,
        method: 'post',
        detailed: true,
        data: payload,
        handler: () => {},
      })
    },
    async getCurrentQueues(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/queues/current${queryStr}`,
        method: 'get',
        detailed: true,
        handler: () => {},
      })
    },
    async getCurrentClinicQueues(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/queues/current-clinic${queryStr}`,
        method: 'get',
        detailed: true,
        handler: () => {},
      })
    },

    // Modular //
    async getDisplayQueues(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/queues/display-queues${queryStr}`,
        method: 'get',
        detailed: true,
        handler: () => {},
      })
    },
    // Modular //
  },
})
