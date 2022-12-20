<script lang="ts" setup>
import { create } from 'canvas-confetti'
import ConfettiModule from 'canvas-confetti/dist/confetti.module.mjs'

const confettiContainer = ref()
const showConfetti = useState('show-confetti', () => false)

let confettiInstance: ConfettiModule

function playConfettiAnimation () {
  if (confettiContainer.value) {
    confettiInstance = create(confettiContainer.value, {
      resize: true,
      useWorker: true
    })

    confettiInstance({
      particleCount: 100,
      spread: 200
    })
    setTimeout(() => {
      confettiInstance.reset()
      showConfetti.value = false
    }, 5000)
  }
}

watch(showConfetti, () => {
  if (showConfetti.value) {
    playConfettiAnimation()
  }
})
</script>

<template>
  <canvas ref="confettiContainer" class="w-full h-full" />
</template>
