<template>
  <div class="row justify-center fit q-col-gutter-md">
    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 row justify-center q-col-gutter-md">
      <div class="col-12" v-for="type in this.types" :key="type">
        <q-card
          class="cursor-pointer bg-primary text-secondary"
          v-ripple.center
          @click="getQueuing(type)"
        >
          <q-card-section
            style="font-size: 45px"
            :class="type.name !== type.description ? 'q-pb-none' : ''"
            align="center"
          >
            <div class="row items-center">
              <div class="col">
                <q-avatar>
                  <q-img src="~assets/uerm-logo.png" />
                </q-avatar>
              </div>
              <div class="col-10">
                <span class="q-pl-md">{{ type.name }}</span>
              </div>
              <div class="col">
                <q-avatar>
                  <q-img src="~assets/uerm-logo.png" />
                </q-avatar>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            v-if="type.name !== type.description"
            align="center"
            class="q-pt-none text-body1"
          >
            {{ type.description }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- <q-page class="bg-grey-2 q-pa-lg flex flex-center">
    <div class="tile-grid">
      <q-card
        v-for="type in this.types"
        :key="type"
        class="bg-primary tile-card cursor-pointer flex flex-center column"
        @click="getQueuing(type)"
      >
        <q-card-section>
          <q-avatar size="56px">
            <q-img src="~assets/uerm-logo.png" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div
            style="font-size: 25px"
            class="text-h5 text-weight-medium q-pa-md text-center text-white"
          >
            {{ type.name }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page> -->

  <q-dialog v-model="bools.queueDialog">
    <q-card class="q-ma-lg">
      <q-card-section class="text-h6 q-ma-lg"> Your Queue Number </q-card-section>
      <q-card-section class="q-ma-lg">
        <div class="text-h3 text-center">{{ this.queueDetails.queue.actual_queue_number }}</div>
        <div class="text-caption text-center q-mt-sm">
          {{ this.queueDetails.queue.created_at }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="bools.queueSubtypeDialog">
    <q-card class="q-ma-lg">
      <q-card-section class="text-h4 bg-primary text-secondary" align="center">
        PURPOSE OF VISIT
        <br />
        <span class="text-body1">
          {{ this.currentType.name }}
        </span>
      </q-card-section>
      <q-card-section class="q-ma-lg">
        <div class="row justify-center q-col-gutter-md">
          <div class="col-12" v-for="subtype in this.queueSubtypes" :key="subtype">
            <q-card
              class="cursor-pointer bg-primary text-secondary"
              v-ripple.center
              @click="generateQueue(this.currentType, subtype)"
            >
              <q-card-section style="font-size: 35px" align="center">
                <q-icon name="fa fa-suitcase-medical"></q-icon>
                <span class="q-pl-md">{{ subtype.name }}</span>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- <div class="text-h3 text-center">{{ this.queueDetails.queue.actual_queue_number }}</div>
          <div class="text-caption text-center q-mt-sm">
            {{ this.queueDetails.queue.created_at }}
          </div> -->
      </q-card-section>
      <!-- <q-card-actions align="right">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script>
import { useTypeStore } from 'src/stores/type'
import { useUserStore } from 'src/stores/user'
import { useQueueStore } from 'src/stores/queue'
import * as utils from 'src/util'
import { socket } from 'boot/socket'
import { useSubtypeStore } from 'src/stores/subtype'

export default {
  name: 'IMDPatientDisplay',
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

.tile-grid {
  display: grid;
  width: 100%;
  max-width: 1200px; /* keeps tiles centered and balanced */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  justify-content: center;
}

.tile-card {
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.tile-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.text-body1 {
  color: #222;
}
</style>
