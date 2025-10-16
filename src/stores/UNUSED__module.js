import { defineStore } from 'pinia'
import { useHelperStore } from './helper' // Import the other store

export const useTypeStore = defineStore('type', {
  state: () => ({
    helper: useHelperStore(),
  }),
  actions: {
    async getModule(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/modules${queryStr}`,
        method: 'get',
        detailed: true,
        handler: () => {},
      })
    },
  },
})
