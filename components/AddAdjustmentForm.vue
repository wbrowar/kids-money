<script lang="ts" setup>
const emit = defineEmits(['adjustment-added'])
const props = defineProps({
  kidId: {
    required: true,
    type: Number
  }
})

const { convertToLocalCurrency } = useStringFormatter()

const dollarAdjustment = ref()
const dollarAdjustmentInputPlaceholder = computed(() => {
  return convertToLocalCurrency(0, { signDisplay: 'never' })
})
const submitButtonValue = computed(() => {
  return dollarAdjustment.value < 0 ? '-' : '+'
})

async function addAdjustment () {
  log('Adding adjustment for ID', dollarAdjustment.value, props.kidId)

  validateDollarAdjustment()

  if (dollarAdjustment.value === 0) {
    return
  }

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
      <div class="grid grid-cols-[1fr_40px] gap-2 w-full sm:max-w-xs">
        <div>
          <label for="email" class="sr-only">Add Adjustment</label>
          <input
            id="dollarAdjustment"
            v-model.number="dollarAdjustment"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            type="number"
            step="0.50"
            name="dollarAdjustment"
            :placeholder="dollarAdjustmentInputPlaceholder"
          >
        </div>
        <LinkButton
          :class="{ 'bg-negative': submitButtonValue === '-', 'bg-positive': submitButtonValue === '+' }"
          :disabled="dollarAdjustment === 0"
          element-type="input"
          type="submit"
          :value="submitButtonValue"
        />
      </div>
    </form>
  </div>
</template>
