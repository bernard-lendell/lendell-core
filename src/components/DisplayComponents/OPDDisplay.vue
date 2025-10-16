<template>
  <div class="fit">
    <div class="row fit justify-between items-stretch content-stretch">
      <div class="col">
        <div class="row wrap fit justify-center items-center">
          <div class="col-12">
            <q-card square class="q-pt-md fit bg-primary">
              <q-card-section class="fit q-pa-none">
                <div class="justify-center column wrap fit q-col-gutter-y-md">
                  <div class="col">
                    <q-card square class="bg-primary shadow-0 fit q-pa-none">
                      <q-card-section
                        class="fit flex flex-center q-pa-none"
                        v-if="Object.keys(this.currentQueues).length > 0"
                      >
                        <q-card square class="fit q-mx-md">
                          <q-card-section class="flex flex-center fit" :ref="'TRIAGESECTION'">
                            <div class="text-weight-bolder" style="font-size: 80px">
                              {{ this.currentQueues.hashMaps['TRIAGESECTION'].queue_number ?? '-' }}
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div>
                    <q-card square class="shadow-0 fit q-pa-none">
                      <q-card-section class="q-pa-sm bg-secondary text-primary">
                        <div class="text-overline text-weight-bolder" style="font-size: 35px">
                          TRIAGE (WINDOW 1)
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12">
            <q-card square class="fit bg-primary">
              <q-card-section class="fit q-pa-none">
                <div class="justify-center column wrap fit q-col-gutter-y-md">
                  <div class="col">
                    <q-card square class="bg-primary shadow-0 fit q-pa-none">
                      <q-card-section
                        class="fit flex flex-center q-pa-none"
                        v-if="Object.keys(this.currentQueues).length > 0"
                      >
                        <q-card square class="fit q-mx-md">
                          <q-card-section class="flex flex-center fit" :ref="'REGSECTION'">
                            <div class="text-weight-bolder" style="font-size: 80px">
                              {{ this.currentQueues.hashMaps['REGSECTION'].queue_number ?? '-' }}
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div>
                    <q-card square class="shadow-0 fit q-pa-none">
                      <q-card-section class="q-pa-sm bg-secondary text-primary">
                        <div class="text-overline text-weight-bolder" style="font-size: 35px">
                          REGISTRATION (WINDOW 2)
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12">
            <q-card square class="fit bg-primary">
              <q-card-section class="fit q-pa-none">
                <div class="justify-center column wrap fit q-col-gutter-y-md">
                  <div class="col">
                    <q-card square class="bg-primary shadow-0 fit q-pa-none">
                      <q-card-section
                        class="fit flex flex-center q-pa-none"
                        v-if="Object.keys(this.currentQueues).length > 0"
                      >
                        <q-card square class="fit q-mx-md">
                          <q-card-section class="flex flex-center fit" :ref="'SSSECTION'">
                            <div class="text-weight-bolder" style="font-size: 80px">
                              {{ this.currentQueues.hashMaps['SSSECTION'].queue_number ?? '-' }}
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div>
                    <q-card square class="shadow-0 fit q-pa-none">
                      <q-card-section class="q-pa-sm bg-secondary text-primary">
                        <div class="text-overline text-weight-bolder" style="font-size: 35px">
                          SOCIAL SERVICE
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- <div class="col">
            <q-card class="fit">
              <q-card-section class="fit q-pa-none">
                <div class="justify-center column wrap fit q-col-gutter-y-sm">
                  <div class="col">
                    <q-card class="shadow-0 fit q-pa-none">
                      <q-card-section
                        class="fit flex flex-center q-pa-none"
                        v-if="Object.keys(this.currentQueues).length > 0"
                        :ref="'CASHIERSECTION'"
                      >
                        <div
                          class="text-weight-bolder"
                          style="font-size: 85px"
                          v-if="Object.keys(this.currentQueues).length > 0"
                        >
                          {{ this.currentQueues.hashMaps['CASHIERSECTION'].queue_number ?? '-' }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div>
                    <q-card square class="shadow-0 fit q-pa-none">
                      <q-card-section class="q-pa-sm bg-primary text-secondary">
                        <div class="text-overline text-weight-bolder" style="font-size: 35px">
                          CASHIER
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div> -->
        </div>
      </div>
      <div class="q-ma-sm"></div>
      <div class="col-9" style="overflow-y: auto">
        <q-card square class="fit">
          <q-card-section class="q-pa-md bg-primary fit">
            <div class="grid-cards">
              <!-- <q-card v-for="clinicQueues in this.currentQueuesClinic.options" :key="clinicQueues">
            <q-card-section class="fit q-pa-none">

            </q-card-section>
          </q-card> -->
              <div v-for="clinicQueues in this.currentQueuesClinic.options" :key="clinicQueues">
                <div class="row justify-center fit wrap">
                  <div class="col-12">
                    <q-card square class="fit q-pa-none">
                      <q-card-section
                        class="q-pa-none fit"
                        v-if="Object.keys(this.currentQueuesClinic).length > 0"
                        :ref="clinicQueues.code"
                        :class="{
                          'blinking-background': clinicQueues.blinking,
                        }"
                      >
                        <div class="row items-center q-px-sm fit">
                          <div
                            class="col-6 text-weight-bolder text-left"
                            style="font-size: 56px !important"
                          >
                            <q-icon :name="clinicQueues.icon"></q-icon>
                            {{ clinicQueues.code }}
                          </div>
                          <div class="col-6">
                            <div class="text-weight-bolder" style="font-size: 56px">
                              {{ clinicQueues.queue_number ?? '-' }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12">
                    <q-card square class="shadow-0 q-pa-none">
                      <q-card-section class="q-pa-xs bg-secondary text-primary">
                        <div class="text-overline text-weight-bolder" style="font-size: 30px">
                          {{ clinicQueues.name }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
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

export default defineComponent({
  name: 'OPDDisplay',
  data() {
    return {
      queueStore: useQueueStore(),
      departmentStore: useDepartmentStore(),
      sectionStore: useSectionStore(),
      userStore: useUserStore(),
      helperStore: useHelperStore(),
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
      const data = await this.queueStore.getCurrentQueues()
      const dataClinic = await this.queueStore.getCurrentClinicQueues()

      if (data.length > 0) {
        this.currentQueues.hashMaps = utils.buildHashTable(data, 'code')
        this.currentQueues.options = utils.buildOptionsArray(data, 'code', 'name')
      }

      if (dataClinic.length > 0) {
        this.currentQueuesClinic.hashMaps = utils.buildHashTable(dataClinic, 'code')
        this.currentQueuesClinic.options = utils.buildOptionsArray(dataClinic, 'code', 'name')
      }
    },

    async speakQueueNumber(queueDetails) {
      console.log(queueDetails, 'speak')
      const queueLabel = queueDetails.payload.actual_queue_number

      const departmentName =
        this.sectionStore.sectionsHashMap[queueDetails.payload.queuing_section_code].name ===
        undefined
          ? ''
          : this.sectionStore.sectionsHashMap[queueDetails.payload.queuing_section_code].name

      // if (departmentName === 'TRIAGE') {
      //   return
      // }

      let departmentCode = queueDetails.payload.department_code

      if (queueDetails.payload.referring_department_code !== null) {
        departmentCode = queueDetails.payload.referring_department_code
      }

      let talkText = ''
      if (departmentName !== '') {
        if (!queueDetails.payload.calledOut) {
          if (departmentName === 'CLINICS') {
            talkText = `...     Now serving, ${queueLabel.replace('-', ' ')}. Please proceed to the ${this.departmentStore.departmentsHashMap[departmentCode].pronunciation} department.`
          } else {
            talkText = `...     Now serving, ${queueLabel.replace('-', ' ')}. Please proceed to the ${departmentName} section.`
          }
        } else {
          if (departmentName === 'CLINICS') {
            talkText = `...     A gentle reminder for queue number ${queueLabel.replace('-', ' ')}. Please proceed to the ${this.departmentStore.departmentsHashMap[departmentCode].pronunciation} department.`
          } else {
            talkText = `...     A gentle reminder for queue number ${queueLabel.replace('-', ' ')}. Please proceed to the ${departmentName} section.`
          }
        }

        // speechSynthesis.speak(new SpeechSynthesisUtterance(' '))
        // speechSynthesis.speak(new SpeechSynthesisUtterance('   '))
        // const text = `${talkText}` // 'N-006' => 'N 006'
        // const utterance = new SpeechSynthesisUtterance(text)
        // utterance.lang = 'en-US'
        // utterance.rate = 0.9 // Slightly slower for clarity
        // utterance.pitch = 1.1 // Slightly higher pitch for a more natural tone
        // speechSynthesis.speak(utterance)
        // speechSynthesis.speak(utterance)

        // this.getTTS(talkText)
        this.queue.push(talkText)

        if (!this.isPlaying) {
          this.playNextInQueue()
        }

        await utils.delay(1500)

        if (departmentName === 'CLINICS') {
          this.$refs[departmentCode][0].$el.classList.add('blinking-background')
        } else {
          this.$refs[queueDetails.payload.queuing_section_code].$el.classList.add(
            'blinking-background',
          )
        }

        await utils.delay(19000)

        if (departmentName === 'CLINICS') {
          this.$refs[departmentCode][0].$el.classList.remove('blinking-background')
        } else {
          this.$refs[queueDetails.payload.queuing_section_code].$el.classList.remove(
            'blinking-background',
          )
        }
      }
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
</style>
