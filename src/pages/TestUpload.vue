<template>
  <q-page class="row fit text-center q-pa-md">
    <div class="col-12">
      <q-form @submit="this.testUpload()">
        <q-file v-model="file" label="Upload File"></q-file>
        <q-btn label="SUBMIT" type="submit"></q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useCandidateStore } from 'src/stores/candidate'

export default defineComponent({
  name: 'TestUpload',
  data() {
    return {
      userStore: useUserStore(),
      candidateStore: useCandidateStore(),
      file: null,
    }
  },
  mounted() {},
  methods: {
    async testUpload() {
      const formData = new FormData()
      formData.append('file', this.file)
      await this.candidateStore.testUpload(formData)
    },
  },
})
</script>
