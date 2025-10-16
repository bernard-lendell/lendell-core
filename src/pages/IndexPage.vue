<!-- eslint-disable no-unused-vars -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <component :is="this.userStore.userLoginInfo.description.toLowerCase()"></component>
  </q-page>
</template>

<script>
// import { useDepartmentStore } from 'src/stores/department'

import { defineAsyncComponent } from 'vue'
import { useTypeStore } from 'src/stores/type'
import { useUserStore } from 'src/stores/user'
import { useQueueStore } from 'src/stores/queue'
import * as utils from 'src/util'
import { socket } from 'boot/socket'
import { useSubtypeStore } from 'src/stores/subtype'
// import VideoBackground from 'src/components/Helpers/VideoBackground.vue'

export default {
  name: 'IndexPage',
  components: {
    opd: defineAsyncComponent(() => import('src/components/PatientDisplays/OPDPatientDisplay.vue')),
    imd: defineAsyncComponent(() => import('src/components/PatientDisplays/IMDPatientDisplay.vue')),
    billing: defineAsyncComponent(
      () => import('src/components/PatientDisplays/BillingPatientDisplay.vue'),
    ),
  },
  data() {
    return {
      // deparmentStore: useDepartmentStore(),
      typeStore: useTypeStore(),
      subtypeStore: useSubtypeStore(),
      userStore: useUserStore(),
      queueStore: useQueueStore(),
      departments: [],
      types: [],
      bools: {
        queueDialog: false,
        queueSubtypeDialog: false,
      },
      queueDetails: {},
      queueNumber: null,
      queueSubtypes: [],
      currentType: {},
      issuedAt: null,
      showDialog: false,
    }
  },
  mounted() {
    this.initateSocket()
    this.fetchTypes()
  },
  methods: {
    async initateSocket() {
      this.joinDepartment(this.userStore.userLoginInfo.module_code)
      socket.on('disconnect', () => {
        this.joinDepartment(
          this.userStore.userLoginInfo.module_code !== undefined
            ? this.userStore.userLoginInfo.module_code
            : 'OPDMOD',
        )
      })
    },

    joinDepartment(department) {
      socket.emit('joinDepartment', { department })
    },
    async fetchTypes() {
      this.currentType = {}
      const types = await this.typeStore.getTypes({
        module_code: this.userStore.userLoginInfo.module_code,
      })
      if (types.length > 0) {
        this.types = types.filter((filterActive) => filterActive.active)
      }
    },
    async getQueuing(type) {
      this.currentType = {}
      this.queueSubtypes = await this.subtypeStore.getSubtypes({ type_code: type.code })

      if (this.queueSubtypes.length > 0) {
        this.bools.queueSubtypeDialog = true
        this.currentType = type
      } else {
        await this.generateQueue(type)
      }
    },
    async generateQueue(type, subtype = null) {
      this.queueDetails = await this.queueStore.generateQueue({
        code: type.code,
        name: type.name,
        prefix: type.prefix,
        module_code: this.userStore.userLoginInfo.module_code,
        queuing_subtype_code: subtype !== null ? subtype.code : subtype,
        priority: type.priority,
        printout_method: this.userStore.userLoginInfo.printout_method,
        printer_code: this.userStore.userLoginInfo.printer_code,
      })

      const socket = window?.$socket || this.$socket || null
      if (socket) {
        socket.emit('queue:stub-counter', {
          department: this.userStore.userLoginInfo.module_code,
        })
      } else {
        console.warn('Socket not available')
      }

      if (subtype !== null) {
        this.bools.queueSubtypeDialog = false
      }

      this.bools.queueDialog = true
      await utils.delay(5000)
      this.bools.queueDialog = false
    },
    // async fetchDepartments() {
    //   // await this.deparmentStore.getDepartments()
    // },
    // // async enqueue(deptCode) {
    // // try {
    // //   const res = await axios.post(`http://localhost:3000/api/enqueue/${deptCode}`)
    // //   this.queueNumber = res.data.queue_number
    // //   this.issuedAt = new Date(res.data.issued_at).toLocaleString()
    // //   this.showDialog = true
    // // } catch (error) {
    // //   console.log(error)
    // //   this.$q.notify({ type: 'negative', message: 'Failed to get queue number' })
    // // }
    // // },
  },
}
</script>

<style>
.bg-overlay {
  box-shadow: inset 2000px 0 0 0 rgba(84, 207, 255, 0.418);
}
</style>
