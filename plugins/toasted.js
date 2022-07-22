import { onGlobalSetup, defineNuxtPlugin } from '@nuxtjs/composition-api'
import { provideToast } from 'vue-toastification/composition'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(({ app }) => {
  onGlobalSetup(() => {
    provideToast({ timeout: 5000 })
  })
})
