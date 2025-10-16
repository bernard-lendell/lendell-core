import { defineStore } from 'pinia'
import * as utils from 'src/util'
import { useHelperStore } from './helper' // Import the other store

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    helper: useHelperStore(),
    candidateStatus: [],
    candidateStatusOptions: [],
    candidateStatusHashMap: [],
    clients: [],
    clientsOptions: [],
    clientsHashMap: [],
    supervisors: [],
    supervisorsOptions: [],
    supervisorsHashMap: [],
    endorsementColumns: [
      {
        name: 'endo_id',
        label: 'ID',
        field: 'endo_id',
        align: 'center',
        // field: row => row.name,
        // format: val => `${val}`,
        sortable: true,
      },
      {
        name: 'endo_desc',
        align: 'center',
        label: 'BATCH ID',
        field: 'endo_desc',
        sortable: true,
      },
      {
        name: 'fullname',
        align: 'center',
        label: 'FULLNAME',
        field: 'fullname',
        sortable: true,
      },
      {
        name: 'endo_code',
        align: 'center',
        label: 'ENDO CODE',
        field: 'endo_code',
        sortable: true,
      },
      {
        name: 'birthdate',
        align: 'center',
        label: 'BIRTHDATE',
        field: 'birthdate',
        sortable: true,
      },
      {
        name: 'formatted_endo_date',
        align: 'center',
        label: 'ENDORSEMENT DATE',
        field: 'formatted_endo_date',
        sortable: true,
      },
      {
        name: 'msa',
        align: 'left',
        label: 'MSA',
        field: 'msa',
        sortable: true,
      },
    ],
  }),
  actions: {
    async getCandidateStatus(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/candidates/status${queryStr}`,
        method: 'get',
        detailed: true,
        handler: (response) => {
          if (response.count > 0) {
            const hashMap = utils.buildHashTable(response.data, 'code')
            const optionData = utils.buildOptionsArray(response.data, 'name', 'code')
            this.candidateStatus = response.data
            this.candidateStatusOptions = optionData
            this.candidateStatusHashMap = hashMap
          }
        },
      })
    },

    async getCandidates(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/talkpush/candidates-by-status${queryStr}`,
        method: 'get',
        detailed: true,
        handler: () => {},
      })
    },

    async getClients(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/clients${queryStr}`,
        method: 'get',
        detailed: true,
        handler: (response) => {
          if (response.count > 0) {
            for (const list of response.data) {
              list.fullname = `${list.lname}, ${list.fname} ${list.lname}`
              list.fullname = list.fullname.toUpperCase()
            }
            const hashMap = utils.buildHashTable(response.data, 'client_id')
            const optionData = utils.buildOptionsArray(response.data, 'fullname', 'client_id')
            this.clients = response.data
            this.clientsOptions = optionData
            this.clientsHashMap = hashMap
          }
        },
      })
    },

    async getSupervisors(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/clients/supervisor${queryStr}`,
        method: 'get',
        detailed: true,
        handler: (response) => {
          if (response.count > 0) {
            for (const list of response.data) {
              list.fullname = `${list.lname}, ${list.fname} ${list.lname}`
              list.fullname = list.fullname.toUpperCase()
            }
            const hashMap = utils.buildHashTable(response.data, 'user_id')
            const optionData = utils.buildOptionsArray(response.data, 'fullname', 'user_id')
            this.supervisors = response.data
            this.supervisorsOptions = optionData
            this.supervisorsHashMap = hashMap
          }
        },
      })
    },

    async getEndorsements(query) {
      const queryStr = this.helper.queryToStr(query)

      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/candidates/endorsements${queryStr}`,
        method: 'get',
        detailed: true,
        handler: (response) => {
          if (response.count > 0) {
            for (const list of response.data) {
              list.fullname = `${list.lname}, ${list.fname} ${list.lname}`
              list.fullname = list.fullname.toUpperCase()
            }

            // for (const list of response.data) {
            //   list.fullname = `${list.lname}, ${list.fname} ${list.lname}`
            //   list.fullname = list.fullname.toUpperCase()
            // }
            // const hashMap = utils.buildHashTable(response.data, 'client_id')
            // const optionData = utils.buildOptionsArray(response.data, 'fullname', 'client_id')
            // this.clients = response.data
            // this.clientsOptions = optionData
            // this.clientsHashMap = hashMap
          }
        },
      })
    },

    async postEndorsements(payload) {
      return await this.helper.request({
        url: `${this.helper.apiHost}/losis/candidates/endorsement`,
        method: 'post',
        detailed: true,
        data: payload,
        handler: () => {},
      })
    },
  },
})
