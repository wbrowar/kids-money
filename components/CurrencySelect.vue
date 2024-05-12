<script lang="ts" setup>
import { Currency, currencyDetails } from '~/constants/currencies'

const { selectedCurrency, convertCurrencyToUsd, convertUsdToCurrency } = useCurrency()

const valueUsd = ref(1)
const valueConverted = ref(1)

function updateConvertedValue () {
  valueConverted.value = parseFloat(convertUsdToCurrency(valueUsd.value).toFixed(2))
}

function updateUsdValue () {
  valueUsd.value = parseFloat(convertCurrencyToUsd(valueConverted.value).toFixed(2))
}

watch(selectedCurrency, () => {
  updateConvertedValue()
})

onMounted(() => {
  updateConvertedValue()
})
</script>

<template>
  <div class="@container">
    <div class="grid grid-cols-[1fr_1.5rem_1fr] gap-x-2 gap-y-4 @lg:grid-cols-[minmax(200px,400px)_minmax(100px,1fr)_1.5rem_minmax(100px,1fr)]">
      <div class="col-span-3 @lg:col-span-1">
        <h2 class="text-2xl">
          Set Currency
        </h2>
        <p class="pr-4 text-sm">
          Set the currency used for displaying dollar values and for adding adjustments.
        </p>
      </div>

      <div class="col-span-3 row-start-3 @lg:col-start-2 @lg:row-start-1">
        <h2 class="text-2xl">
          Preview Currency
        </h2>
        <p class="pr-4 text-sm">
          Check the conversion between USD ($: {{ currencyDetails[Currency.UnitedStatesDollar].title }}) and selected currency ({{ `${currencyDetails[selectedCurrency].symbol}: ${currencyDetails[selectedCurrency].title}` }}).
        </p>
      </div>

      <div class="col-span-3 @lg:col-span-1">
        <label for="currency" class="block text-sm font-medium leading-6 text-gray-900">Currency</label>
        <select id="currency" v-model="selectedCurrency" name="currency" class="block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-primary focus:ring-primary dark:opacity-90">
          <option v-for="currency in Currency" :key="currency" :value="currency">
            {{ currencyDetails[currency].symbol }}: {{ currencyDetails[currency].title }}
          </option>
        </select>
      </div>

      <div>
        <label for="value-usd">{{ currencyDetails[Currency.UnitedStatesDollar].symbol }}</label>
        <input
          id="value-usd"
          v-model.number="valueUsd"
          class="block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-primary focus:ring-primary dark:opacity-90"
          autocomplete="off"
          inputmode="decimal"
          name="dollarAdjustment"
          pattern="[0-9]+([\.,][0-9]+)?"
          type="text"
          placeholder="$0.00"
          @input="updateConvertedValue"
        >
      </div>

      <div class="self-end pb-2 text-primary">
        <IconArrowsRightLeft />
      </div>

      <div>
        <label for="value-converted">{{ currencyDetails[selectedCurrency].symbol }}</label>

        <input
          id="value-converted"
          v-model.number="valueConverted"
          class="block w-full rounded-md border-gray-300 text-gray-800 shadow-sm focus:border-primary focus:ring-primary dark:opacity-90"
          autocomplete="off"
          inputmode="decimal"
          name="dollarAdjustment"
          pattern="[0-9]+([\.,][0-9]+)?"
          type="text"
          :placeholder="`Converted to ${selectedCurrency}`"
          @input="updateUsdValue"
        >
      </div>
    </div>
  </div>
</template>
