<template>
  <div>
    <h2>Now Serving: {{ current?.number || '---' }}</h2>
    <button @click="getNext">Call Next</button>
    <h3>Waiting List:</h3>
    <ul>
      <li v-for="item in queue" :key="item.number">#{{ item.number }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'

const queue = ref([])
const current = ref(null)
const socket = io('http://localhost:9090')

socket.on('queue-updated', (data) => {
  queue.value = data.queue
  current.value = data.current
})

const getNext = async () => {
  await axios.post('http://localhost:9090/next')
}

onMounted(async () => {
  const res = await axios.get('http://localhost:9090/queue')
  queue.value = res.data.queue
  current.value = res.data.current
})
</script>
