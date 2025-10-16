<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-secondary">
          UERM PatientPath -
          <span class="text-uppercase">{{ this.userStore.userLoginInfo.description }}</span>
        </q-toolbar-title>
        <q-space> </q-space>
      </q-toolbar>
    </q-header> -->

    <q-page-container class="fit">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserStore } from 'src/stores/user'

export default defineComponent({
  name: 'DisplayLayout',
  data() {
    return {
      userStore: useUserStore(),
    }
  },
  // mounted() {
  //   console.log(this.userStore.userLoginInfo)
  // },
})
</script>
