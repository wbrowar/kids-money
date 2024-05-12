<script lang="ts" setup>
import type { Kid } from '~/types'
import { Currency } from '~/constants/currencies'

const emit = defineEmits(['adjustment-added', 'mouseover-element'])
const props = defineProps({
  kid: {
    required: true,
    type: Object as PropType<Kid>
  }
})

const { selectedCurrency, convertCurrencyToUsd } = useCurrency()
const { convertToLocalCurrency } = useStringFormatter()

const canAdd = ref(true)
const dollarAdjustment = ref()
const dollarAdjustmentInputPlaceholder = computed(() => {
  return convertToLocalCurrency(0, { signDisplay: 'never' })
})
const gridColumns = computed(() => {
  if (selectedCurrency.value !== Currency.UnitedStatesDollar) {
    return '1fr max-content'
  }

  return '1fr'
})

const dollarAdjustmentInUsd = computed(() => {
  if (selectedCurrency.value === Currency.UnitedStatesDollar) {
    return dollarAdjustment.value
  }

  return convertCurrencyToUsd(dollarAdjustment.value ?? 0)
})

async function addAdjustment ({ mode }: { mode: 'add' | 'subtract' } = { mode: 'add' }) {
  if (canAdd.value) {
    debounceAdd()
  } else {
    return
  }

  log('Adding adjustment for kid', dollarAdjustmentInUsd.value, props.kid.name)

  validateDollarAdjustment()

  if (dollarAdjustmentInUsd.value === 0 || typeof dollarAdjustmentInUsd.value !== 'number') {
    return
  }

  const dollarValue = mode === 'subtract' ? dollarAdjustmentInUsd.value * -1 : dollarAdjustmentInUsd.value

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
      <div class="grid grid-cols-[1fr_100px] items-center gap-4 w-full @md/adjustment-form:grid-cols-[var(--grid-cols)]" :style="{ '--grid-cols': gridColumns }">
        <div class="grid grid-cols-[1fr_45px_45px] gap-2">
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

        <div v-if="selectedCurrency !== Currency.UnitedStatesDollar">
          {{ convertToLocalCurrency(dollarAdjustmentInUsd, {}, { currency: Currency.UnitedStatesDollar }) }}
        </div>
      </div>
    </form>
  </div>
</template>
