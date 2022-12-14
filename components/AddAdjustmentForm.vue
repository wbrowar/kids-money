<script lang="ts" setup>
import { PropType } from 'vue'
import { Kid } from '~/types'
import { addPercentAdjustmentToTotal } from '~/utils/adjustments'

const emit = defineEmits(['adjustment-added'])
const props = defineProps({
  kid: {
    required: true,
    type: Object as PropType<Kid>
  }
})

const { convertToLocalCurrency } = useStringFormatter()

const canAdd = ref(true)
const dollarAdjustment = ref()
const dollarAdjustmentInputPlaceholder = computed(() => {
  return convertToLocalCurrency(0, { signDisplay: 'never' })
})
const submitButtonValue = computed(() => {
  return dollarAdjustment.value < 0 ? '-' : '+'
})

async function addAdjustment () {
  if (canAdd.value) {
    debounceAdd()
  } else {
    return
  }

  log('Adding adjustment for kid', dollarAdjustment.value, props.kid.name)

  validateDollarAdjustment()

  if (dollarAdjustment.value === 0) {
    return
  }

  const { data } = await useFetch('/api/save-kid-adjustment', {
    body: {
      dollarAdjustment: dollarAdjustment.value,
      id: props.kid.id
    },
    method: 'post'
  })

  if (data.value) {
    dollarAdjustment.value = 0
    emit('adjustment-added')
  }

  return data.value
}

async function addAllowance () {
  if (canAdd.value) {
    debounceAdd()
  } else {
    return
  }

  log('Adding allowance for kid', props.kid?.allowance, props.kid.name)

  if (props.kid?.allowance === 0) {
    return
  }

  const { data } = await useFetch('/api/save-kid-adjustment', {
    body: {
      dollarAdjustment: props.kid.allowance,
      id: props.kid.id
    },
    method: 'post'
  })

  if (data.value) {
    emit('adjustment-added')
  }

  return data.value
}

async function addInterest () {
  if (canAdd.value) {
    debounceAdd()
  } else {
    return
  }

  log('Adding allowance for kid', props.kid?.interest, props.kid.name)

  const adjustment = addPercentAdjustmentToTotal(props.kid.interest, props.kid?.adjustments[0].totalToDate ?? 0)

  if (adjustment === 0) {
    return
  }

  const { data } = await useFetch('/api/save-kid-adjustment', {
    body: {
      percentAdjustment: props.kid.interest,
      id: props.kid.id
    },
    method: 'post'
  })

  if (data.value) {
    emit('adjustment-added')
  }

  return data.value
}

function debounceAdd () {
  canAdd.value = false

  setTimeout(() => {
    canAdd.value = true
  }, 500)
}

function validateDollarAdjustment () {
  if (typeof dollarAdjustment.value !== 'number') {
    dollarAdjustment.value = 0
  }
}
</script>

<template>
  <div class="@container/adjustment-form">
    <form action="" @submit.prevent="addAdjustment">
      <div class="grid grid-cols-2 gap-4 w-full @sm/adjustment-form:grid-cols-[1fr_max-content_max-content]">
        <div class="grid grid-cols-[1fr_45px] gap-2 col-span-2 @sm/adjustment-form:col-span-1">
          <label for="email" class="sr-only">Add Adjustment</label>
          <input
            id="dollarAdjustment"
            v-model.number="dollarAdjustment"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:opacity-90"
            autocomplete="off"
            type="text"
            name="dollarAdjustment"
            :placeholder="dollarAdjustmentInputPlaceholder"
          >
          <LinkButton
            class="!px-0 !py-0"
            :class="{ 'bg-negative': submitButtonValue === '-', 'bg-positive': submitButtonValue === '+' }"
            :disabled="dollarAdjustment === 0"
            element-type="button"
            retain-style
          >
            <div class="sr-only">
              {{ submitButtonValue === '+' ? 'Add' : 'Subtract' }}
            </div>
            <IconAdd v-if="submitButtonValue === '+'" class="w-5 h-5" />
            <IconSubtract v-else class="w-5 h-5" />
          </LinkButton>
        </div>

        <LinkButton
          class="bg-primary"
          :class="{ 'bg-gray-300 cursor-not-allowed': kid.allowance <= 0 }"
          :disabled="kid.allowance <= 0"
          element-type="button"
          type="button"
          retain-style
          @click="addAllowance"
        >
          <IconAdd class="w-4 h-4" />
          <span>Allowance</span>
        </LinkButton>

        <LinkButton
          class="bg-primary"
          :class="{ 'bg-gray-300 cursor-not-allowed': kid.interest <= 0 }"
          :disabled="kid.interest <= 0"
          element-type="button"
          type="button"
          retain-style
          @click="addInterest"
        >
          <IconAdd class="w-4 h-4" />
          <span>Interest</span>
        </LinkButton>
      </div>
    </form>
  </div>
</template>
