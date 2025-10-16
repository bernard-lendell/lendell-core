<template>
  <div class="fit bg-primary">
    <div class="row fit justify-between items-stretch content-stretch">
      <!-- <div class="row justify-between">
        <div class="col">
          <q-card square class="">
            <q-card-section style="font-size: 50px">&nbsp;</q-card-section>
          </q-card>
        </div>
        <div class="col" v-for="queue of this.currentQueues.options" :key="queue">
          <q-card square class="">
            <q-card-section style="font-size: 50px" class="">
              <div class="flex flex-center text-uppercase">
                <span>{{ queue.name.replaceAll('Counter ', '') }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div> -->
      <div class="col-12 row fit justify-between items-stretch content-stretch">
        <div class="col-12 row justify-between items-stretch content-stretch">
          <div class="col">
            <q-card square class="fit">
              <q-card-section class="bg-primary text-secondary" style="font-size: 28.9px">
                &nbsp;
              </q-card-section>
              <q-card-section class="fit bg-primary text-secondary" style="font-size: 35px">
                <div class="fit flex flex-center uppercase text-weight-bold">SERVING</div>
                <!-- <div class="fit text-uppercase text-weight-bold">
                  <div class="row">
                    <div class="col-12">S</div>
                    <div class="col-12">E</div>
                    <div class="col-12">R</div>
                    <div class="col-12">V</div>
                    <div class="col-12">I</div>
                    <div class="col-12">N</div>
                    <div class="col-12">G</div>
                  </div>
                </div> -->
              </q-card-section>
            </q-card>
          </div>
          <div class="col" v-for="queue of this.currentQueues.options" :key="queue">
            <q-card square class="fit" bordered>
              <q-card-section
                class="bg-primary text-secondary text-weight-bold"
                style="font-size: 28.5px"
              >
                <div class="fit flex flex-center text-uppercase">
                  <span>{{ queue.name ?? '&nbsp;' }}</span>
                </div>
              </q-card-section>
              <q-card-section
                class="fit"
                :class="queue.code"
                style="font-size: 45px"
                :ref="queue.code"
              >
                <div class="fit flex flex-center text-uppercase text-weight-bold">
                  <span>{{ queue.queue_number }}</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-12 row justify-between items-stretch content-stretch">
          <div class="col">
            <q-card square class="fit" bordered>
              <q-card-section class="fit bg-primary text-secondary" style="font-size: 45px">
                <div class="fit flex flex-center text-uppercase text-weight-bold">SERVED</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col" v-for="queue of this.currentQueues.options" :key="queue">
            <q-card square class="fit" bordered>
              <q-card-section class="fit" style="font-size: 45px">
                <div
                  class="fit flex flex-center text-uppercase text-weight-bold"
                  v-if="queue.previous_queue_code_number !== queue.queue_number"
                >
                  {{ queue.previous_queue_code_number }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- <div class="row justify-between items-stretch content-stretch">
        <div class="col">
          <q-card>
            <q-card-section></q-card-section>
          </q-card>
        </div>
        <div class="col" v-for="queue of this.currentQueues.options" :key="queue">
          <q-card>
            <q-card-section>
              {{ queue.name }}
            </q-card-section>
          </q-card>
        </div>
      </div> -->
    </div>

    <audio ref="audio" v-show="false" controls class="q-mt-md" @ended="onAudioEnded" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useQueueStore } from 'src/stores/queue'
import * as utils from 'src/util'
import { socket } from 'boot/socket'
import { useDepartmentStore } from 'src/stores/department'
import { useSectionStore } from 'src/stores/section'
import { useUserStore } from 'src/stores/user'
import { useHelperStore } from 'src/stores/helper'
import { useQueueCounterStore } from 'src/stores/queue-counter'

export default defineComponent({
  name: 'ImdDisplay',
  data() {
    return {
      queueStore: useQueueStore(),
      departmentStore: useDepartmentStore(),
      sectionStore: useSectionStore(),
      userStore: useUserStore(),
      helperStore: useHelperStore(),
      queueCounterStore: useQueueCounterStore(),
      currentQueues: {},
      currentQueuesClinic: {},
      dynamicClass: '',
      isPlaying: false,
      queue: [],
    }
  },
  mounted() {
    this.initStore()
    this.initateSocket()
  },
  watch: {
    'userStore.userLoginInfo': {
      async handler(val) {
        if (utils.isObjAndNotEmpty(val)) {
          this.initateSocket()
        }
      },
      deep: true,
    },
  },
  methods: {
    initateSocket() {
      this.joinDepartment(
        this.userStore.userLoginInfo.module_code !== undefined
          ? this.userStore.userLoginInfo.module_code
          : 'OPDMOD',
      )

      socket.on('queue:updated', async () => {
        await this.initStore()
      })
      socket.on('queue:talk', async (data) => {
        await this.speakQueueNumber(data)
      })
      socket.on('queue:callout', async (data) => {
        await this.initStore()
        await this.speakQueueNumber(data)
      })
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
    async initStore() {
      await utils.delay(500)
      const data = await this.queueStore.getDisplayQueues({
        queue_component:
          this.helperStore.modulesHashMap[this.userStore.userLoginInfo.module_code]
            .counter_component,
      })

      if (data.length > 0) {
        this.currentQueues.hashMaps = utils.buildHashTable(data, 'code')
        this.currentQueues.options = utils.buildOptionsArray(data, 'code', 'name')
      }
    },

    async speakQueueNumber(queueDetails) {
      let departmentName = ''
      let queueLabel = ''
      let talkText = ''
      let blinkClass = {}

      if (queueDetails.payload.calledOut) {
        queueLabel = queueDetails.payload.actual_queue_number

        departmentName =
          this.queueCounterStore.queueCountersHashMap[queueDetails.payload.queuing_counter_code]
            .name === undefined
            ? ''
            : this.queueCounterStore.queueCountersHashMap[queueDetails.payload.queuing_counter_code]
                .name

        talkText = `...     A gentle reminder for queue number ${queueLabel.replace('-', '').split('').join(' ').replaceAll('0', 'zero')}. Please proceed to ${departmentName}.`

        blinkClass = queueDetails.payload.queuing_counter_code
      } else {
        queueLabel = queueDetails.payload.current.actual_queue_number
        departmentName =
          this.queueCounterStore.queueCountersHashMap[
            queueDetails.payload.previousStation.queuing_counter_code
          ].name === undefined
            ? ''
            : this.queueCounterStore.queueCountersHashMap[
                queueDetails.payload.previousStation.queuing_counter_code
              ].name

        talkText = `...     Now serving, ${queueLabel.replace('-', ' ').split('').join(' ')}. Please proceed to ${departmentName}.`

        blinkClass = queueDetails.payload.previousStation.queuing_counter_code
      }

      this.queue.push(talkText)

      if (!this.isPlaying) {
        this.playNextInQueue()
      }

      await utils.delay(1000)

      this.$refs[blinkClass][0].$el.classList.add('blinking-background')

      await utils.delay(19000)

      this.$refs[blinkClass][0].$el.classList.remove('blinking-background')
    },

    async playNextInQueue() {
      if (this.queue.length === 0) {
        this.isPlaying = false
        return
      }

      const nextItem = this.queue.shift()
      const audio = this.$refs.audio
      const encodedText = encodeURIComponent(nextItem)

      audio.src = `${this.helperStore.apiHost}/tts?text=${encodedText}`
      this.isPlaying = true

      // audio.load()

      // audio.play().catch((err) => {
      //   console.error('Playback error:', err)
      //   this.isPlaying = false
      //   this.playNextInQueue() // continue to next
      // })

      try {
        await audio.play()
      } catch (err) {
        console.error('Audio playback error:', err)
        this.isPlaying = false
        // Wait before retrying next
        await utils.delay(500)
        this.playNextInQueue()
      }
    },
    onAudioEnded() {
      this.isPlaying = false
      this.playNextInQueue()
    },
  },
})
</script>

<style scoped>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); /* auto responsive columns */
  grid-auto-rows: 1fr; /* equal height rows */
  gap: 16px;
  height: 100%;
}

.blinking-background {
  animation: blink-bg 1.5s infinite;
}

@keyframes blink-bg {
  0% {
    background-color: #0d47a1;
    color: white;
  }
  50% {
    background-color: #fbc02d;
    color: #0d47a1;
  }
  100% {
    background-color: #0d47a1;
    color: white;
  }
}

.diagonal-text {
  display: inline-block;
  transform: rotate(45deg); /* Rotate text diagonally */
  font-size: 24px;
  color: #333;
}
</style>
