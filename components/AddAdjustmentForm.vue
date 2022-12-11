<script lang="ts" setup>
const emit = defineEmits(['adjustment-added'])
const props = defineProps({
  kidId: {
    required: true,
    type: Number
  }
})

const dollarAdjustment = ref(0)
const submitButtonValue = computed(() => {
  return dollarAdjustment.value < 0 ? '-' : '+'
})

async function addAdjustment () {
  log('Adding adjustment for ID', dollarAdjustment.value, props.kidId)

  const { data } = await useFetch('/api/save-kid-adjustment', {
    body: {
      dollarAdjustment: dollarAdjustment.value,
      id: props.kidId
    },
    method: 'post'
  })

  if (data.value) {
    dollarAdjustment.value = 0
    emit('adjustment-added')
  }

  return data.value
}

function validateDollarAdjustment () {
  if (typeof dollarAdjustment.value !== 'number') {
    dollarAdjustment.value = 0
  }
}
</script>

<template>
  <div>
    <form action="" @submit.prevent="addAdjustment">
      <input id="dollarAdjustment" v-model.number="dollarAdjustment" type="text" name="dollarAdjustment" @blur="validateDollarAdjustment">
      <input :disabled="dollarAdjustment === 0" type="submit" :value="submitButtonValue">
    </form>
  </div>
</template>
