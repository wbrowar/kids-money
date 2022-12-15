<script lang="ts" setup>
import { PropType } from 'vue'
import { Kid } from '~/types'
import { addPercentAdjustmentToTotal } from '~/utils/adjustments'

const emit = defineEmits(['adjustment-added', 'mouseover-element'])
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
const gridColumns = computed(() => {
  if (props.kid?.allowance > 0 && props.kid.interest > 0) {
    return '1fr max-content max-content'
  } else if (props.kid?.allowance > 0 || props.kid.interest > 0) {
    return '1fr max-content'
  }

  return '1fr'
})

async function addAdjustment ({ mode }: { mode: 'add' | 'subtract' } = { mode: 'add' }) {
  if (canAdd.value) {
    debounceAdd()
  } else {
    return
  }

  log('Adding adjustment for kid', dollarAdjustment.value, props.kid.name)

  validateDollarAdjustment()

  if (dollarAdjustment.value === 0 || typeof dollarAdjustment.value !== 'number') {
    return
  }

  const dollarValue = mode === 'subtract' ? dollarAdjustment.value * -1 : dollarAdjustment.value

  const { data } = await useFetch('/api/save-kid-adjustment', {
    body: {
      dollarAdjustment: dollarValue,
      id: props.kid.id
    },
    method: 'post'
  })

  if (data.value) {
    dollarAdjustment.value = undefined
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
  if (dollarAdjustment.value < 0) {
    dollarAdjustment.value = dollarAdjustment.value * -1
  }
}
</script>

<template>
  <div class="@container/adjustment-form">
    <form action="">
      <div class="grid grid-cols-2 gap-4 w-full @sm/adjustment-form:grid-cols-[var(--grid-cols)]" :style="{ '--grid-cols': gridColumns }">
        <div class="grid grid-cols-[1fr_45px_45px] gap-2 col-span-2 @sm/adjustment-form:col-span-1">
          <label for="email" class="sr-only">Add Adjustment</label>
          <input
            id="dollarAdjustment"
            v-model.number="dollarAdjustment"
            class="block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-primary focus:ring-primary dark:opacity-90"
            autocomplete="off"
            inputmode="decimal"
            name="dollarAdjustment"
            pattern="[0-9]+([\.,][0-9]+)?"
            type="text"
            :placeholder="dollarAdjustmentInputPlaceholder"
            @blur="validateDollarAdjustment"
            @mouseover="emit('mouseover-element', { target: 'field', tooltip: `Enter an amount to add or subtract from total` })"
          >
          <LinkButton
            class="!px-0 !py-0 bg-positive"
            :disabled="dollarAdjustment === 0"
            element-type="button"
            type="button"
            retain-style
            @click="addAdjustment"
            @mouseover="emit('mouseover-element', { target: 'add', tooltip: `Add $${dollarAdjustment ?? 0} to total` })"
          >
            <div class="sr-only">
              Add
            </div>
            <IconAdd class="w-5 h-5" />
          </LinkButton>
          <LinkButton
            class="!px-0 !py-0 bg-negative"
            :disabled="dollarAdjustment === 0"
            element-type="button"
            type="button"
            retain-style
            @click="addAdjustment({ mode: 'subtract' })"
            @mouseover="emit('mouseover-element', { target: 'subtract', tooltip: `Subtract $${dollarAdjustment ?? 0} from total` })"
          >
            <div class="sr-only">
              Subtract
            </div>
            <IconSubtract class="w-5 h-5" />
          </LinkButton>
        </div>

        <LinkButton
          v-if="kid.allowance > 0"
          class="bg-primary"
          :class="{ 'bg-gray-200 cursor-not-allowed': kid.allowance <= 0 }"
          element-type="button"
          type="button"
          retain-style
          @click="addAllowance"
          @mouseover="emit('mouseover-element', { target: 'allowance', tooltip: `Add $${kid.allowance} allowance to total` })"
        >
          <IconAdd class="w-4 h-4" />
          <span>Allowance</span>
        </LinkButton>

        <LinkButton
          v-if="kid.interest > 0"
          class="bg-primary"
          :class="{ 'bg-gray-200 cursor-not-allowed': kid.interest <= 0 }"
          element-type="button"
          type="button"
          retain-style
          @click="addInterest"
          @mouseover="emit('mouseover-element', { target: 'allowance', tooltip: `Add ${kid.allowance}% interest to total` })"
        >
          <IconAdd class="w-4 h-4" />
          <span>Interest</span>
        </LinkButton>
      </div>
    </form>
  </div>
</template>
