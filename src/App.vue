<template>
  <router-view />
  <NotifyMessage
    v-if="this.helperStore.notification.displayNotify"
    :message="this.helperStore.notification.message"
    :type="this.helperStore.notification.type"
  ></NotifyMessage>
</template>

<script>
import * as utils from 'src/util'
import { defineComponent } from 'vue'
import { Cookies } from 'quasar'
import { useHelperStore } from 'src/stores/helper'
import { useUserStore } from 'src/stores/user'

import NotifyMessage from './components/Helpers/NotifyMessage.vue'

export default defineComponent({
  name: 'App',
  components: { NotifyMessage },
  data() {
    return {
      helperStore: useHelperStore(),
      userStore: useUserStore(),
    }
  },

  watch: {
    // IMPORTANT: Do not make this watcher "immediate".
    '$router.currentRoute.value.name': {
      async handler(val) {
        // await this.checkAuth();
        this.checkAuth(val)
      },
      deep: true,
      // immediate: true,
    },
    'helperStore.logoffUser': {
      async handler(val) {
        if (!val) {
          if (utils.isObjAndNotEmpty(this.userLoginInfo)) {
            // setTimeout(() => {
            //   this.initializeStore();
            // }, 1500);
          }
        } else {
          this.removeCookies()
          const notifInitPayload = {
            displayNotify: true,
            message: 'You have been logged out!',
            type: 'negative',
          }
          await this.$store.dispatch('helpers/setNotification', notifInitPayload)
        }
      },
      deep: true,
      // immediate: true,
    },
  },
  created() {
    this.checkAuth(this.$router.currentRoute.value.name)
  },
  methods: {
    async removeCookies() {
      Cookies.remove('user_data')

      await utils.delay(1500)
      this.$router.push('/')
    },

    // eslint-disable-next-line no-unused-vars
    async checkAuth(val) {
      // const cookieStatus = await this.checkCookie()
      // if (val === 'Auth') {
      //   if (cookieStatus) {
      //     if (utils.isObjAndNotEmpty(this.userStore.userLoginInfo)) {
      //       if (this.userStore.userLoginInfo.type === 2) {
      //         this.$router.push('/display')
      //       } else {
      //         this.$router.push('/home')
      //       }
      //     }
      //   } else {
      //     this.$router.push('/')
      //     return
      //   }
      // }
      // if (cookieStatus) {
      //   if (utils.isObjAndNotEmpty(this.userStore.userLoginInfo)) {
      //     if (this.userStore.userLoginInfo.type === 2) {
      //       this.$router.push('/display')
      //     } else {
      //       this.$router.push('/home')
      //     }
      //   }
      // } else {
      //   if (!utils.isObjAndNotEmpty(this.userStore.userLoginInfo)) {
      //     this.$router.push('/')
      //     return
      //   }
      // }
      // await this.initializeStore()
    },

    async initializeStore() {
      await this.helperStore.initStores()
    },

    async checkCookie() {
      if (Cookies.has('user_data')) {
        this.userStore.setUserCookies()
        return true
      }

      return false
    },
  },
})
</script>
