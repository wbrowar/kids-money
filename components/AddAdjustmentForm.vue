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
      <div class="grid grid-cols-[1fr_40px] gap-2 w-full ">
        <div>
          <label for="email" class="sr-only">Add Adjustment</label>
          <input
            id="dollarAdjustment"
            v-model.number="dollarAdjustment"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            autocomplete="off"
            type="number"
            step="0.50"
            name="dollarAdjustment"
            :placeholder="dollarAdjustmentInputPlaceholder"
          >
        </div>

        <LinkButton
          class="px-0 py-0"
          :class="{ 'bg-negative': submitButtonValue === '-', 'bg-positive': submitButtonValue === '+' }"
          :disabled="dollarAdjustment === 0"
          element-type="button"
          retain-style
          value=""
        >
          <div class="sr-only">
            {{ submitButtonValue === '+' ? 'Add' : 'Subtract' }}
          </div>
          <IconAdd v-if="submitButtonValue === '+'" class="w-5 h-5" />
          <IconSubtract v-else class="w-5 h-5" />
        </LinkButton>
      </div>
    </form>
  </div>
</template>
