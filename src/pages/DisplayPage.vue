<template>
  <q-page class="row fit text-center q-pa-md">
    <div class="col-12">
      <component :is="this.userStore.userLoginInfo.display_component" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { useUserStore } from 'src/stores/user'

export default defineComponent({
  name: 'DisplayPage',
  data() {
    return {
      userStore: useUserStore(),
    }
  },
  components: {
    opdDisplay: defineAsyncComponent(
      () => import('src/components/DisplayComponents/OpdDisplay.vue'),
    ),
    imdDisplay: defineAsyncComponent(
      () => import('src/components/DisplayComponents/ImdDisplay.vue'),
    ),
    billingDisplay: defineAsyncComponent(
      () => import('src/components/DisplayComponents/BillingDisplay.vue'),
    ),
  },
  mounted() {},
  methods: {},
})
</script>
