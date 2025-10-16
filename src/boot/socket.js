/* eslint-disable no-unused-vars */
import { io } from 'socket.io-client'

const socket = io(
  process.env.DEV
    ? process.env.DEV_HOST
    : process.env.NGROKTESTING
      ? process.env.NGROK_HOST
      : process.env.API_HOST,
  {
    reconnection: true, // default is true
    reconnectionAttempts: Infinity, // keep trying
    reconnectionDelay: 1000, // try every 1s
  },
)

export default async ({ app }) => {
  // socket.on('connect', () => {
  //   console.log('Connected to websocket server')
  // })
  // socket.on('queue:updated', (data) => {
  //   console.log(data)
  // })
  // socket.onAny((event, ...args) => {
  //   console.log(`[SOCKET EVENT] ${event}`, args)
  // })
  // socket.on('disconnect', () => {
  //   console.log('Disconnected, trying to reconnect...')
  // })
  // app.config.globalProperties.$socket = socket
}

export { socket }
