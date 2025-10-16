<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',

  watch: {
    // IMPORTANT: Do not make this watcher "immediate".
    '$router.currentRoute.value.name': {
      async handler() {
        // await this.checkAuth();
        // this.initStore();
      },
      deep: true,
      // immediate: true,
    },
  },
})
</script>
