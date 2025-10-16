import { KeepAwake } from '@capacitor-community/keep-awake'

export default async () => {
  try {
    await KeepAwake.keepAwake()
    console.log('Screen will stay awake')
  } catch (err) {
    console.error('Failed to keep screen awake:', err)
  }
}
