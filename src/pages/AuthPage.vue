<template>
  <q-page class="row items-center justify-center full-width q-pa-md">
    <div class="col-xl-3 col-lg-3 col-md-auto col-sm-auto col-xs-auto">
      <q-card class="login-card">
        <q-form ref="authForm" @submit="submitForm">
          <q-card-section class="bg-primary">
            <div class="column items-center q-col-gutter-md justify-center">
              <div class="text-overline text-weight-bolder text-secondary" style="font-size: 15px">
                Lendell Core
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-pa-xs q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  square
                  filled
                  v-model="loginInfo.username"
                  autofocus
                  stack-label
                  label-slot
                  ref="username"
                  hide-bottom-space
                  dense
                  :rules="[(val) => !!val || 'Username is required']"
                >
                  <template v-slot:label>
                    Username
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  square
                  filled
                  type="password"
                  v-model="loginInfo.password"
                  stack-label
                  label-slot
                  dense
                  hide-bottom-space
                  :rules="[(val) => !!val || 'Password is required']"
                >
                  <template v-slot:label>
                    Password
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="header-bg-bottom q-mt-sm">
            <q-btn
              label="LOGIN"
              icon="fa fa-person-walking-dashed-line-arrow-right"
              color="primary"
              text-color="secondary"
              class="full-width q-pa-md"
              type="submit"
            ></q-btn>

            <!--

              type="submit"
            -->
          </q-card-section>
          <q-inner-loading :showing="this.bools.loginLoading">
            <q-spinner-puff size="100px" color="primary" />
            <span class="q-pt-md text-overline">{{ loadingMessage }} ...</span>
          </q-inner-loading>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useHelperStore } from 'src/stores/helper'

import * as utils from 'src/util'

export default defineComponent({
  name: 'AuthPage',
  data() {
    return {
      userStore: useUserStore(),
      helperStore: useHelperStore(),
      bools: {
        loginLoading: false,
        enableSubmit: false,
        showRecaptcha: true,
      },
      loadingMessage: '',
      loginInfo: {
        username: null,
        password: null,
      },
      text: 'Hello, this is working now!',
      voices: [],
    }
  },
  // computed: {
  //   ...mapGetters({
  //     currentScreenProperty: 'helpers/currentScreenProperty',
  //     currentScreen: 'helpers/currentScreen',
  //     userLoginInfo: 'users/userLoginInfo',
  //     moduleLinks: 'helpers/moduleLinks',
  //     notification: 'helpers/notification',
  //   }),
  // },
  created() {
    this.setInit()
  },
  methods: {
    setInit() {
      this.loginInfo.username = ''
      this.loginInfo.password = ''
    },
    submitForm() {
      this.$refs.authForm.validate().then(async (valid) => {
        if (!valid) {
          return false
        }

        await this.authenticate()
      })
    },
    async authenticate() {
      this.loadingMessage = 'AUTHENTICATING'
      this.bools.loginLoading = true

      const payload = {
        username: this.loginInfo.username,
        password: this.loginInfo.password,
      }

      const auth = await this.userStore.authenticate(payload)

      if (auth !== undefined) {
        if (!auth) {
          this.bools.loginLoading = false
          this.setInit()
          this.$refs.username.focus()
          await utils.delay(2000)
          const notifInitPayload = {
            displayNotify: false,
            message: '',
            type: '',
          }

          this.helperStore.setNotification(notifInitPayload)
          return false
        }
      }

      // if (filterGroup.length > 0) {
      //   Object.assign(this.userStore.userLoginInfo, {
      //     module: filterGroup[0].moduleName.replace(' Group', ''),
      //   })
      // }

      this.$refs.username.focus()

      let successNotifPayload = {
        displayNotify: true,
        message: `Welcome to the UERM PatientPath`,
        type: 'positive',
      }

      this.helperStore.setNotification(successNotifPayload)
      this.setInit()

      if (utils.isObjAndNotEmpty(this.userStore.userLoginInfo)) {
        if (this.userStore.userLoginInfo.type === 2) {
          this.$router.push('/display')
        } else {
          this.$router.push('/home')
        }
      }

      await utils.delay(2000)

      this.setInit()
      this.bools.loginLoading = false
      const notifInitPayload = {
        displayNotify: false,
        message: '',
        type: '',
      }

      this.helperStore.setNotification(notifInitPayload)
    },
  },
})
</script>

<style>
.login-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.header-bg {
  border-radius: 8px 8px 0 0;
  background: #03a9f4;
  /* background: linear-gradient(135deg, #00b8ff, #00719c); */
}

.header-bg-bottom {
  border-radius: 0 0 8px 8px;
  /* background: linear-gradient(135deg, #00b8ff, #00719c); */
}
</style>
