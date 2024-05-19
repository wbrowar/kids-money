<script lang="ts" setup>
import type { Kid } from '~/types'
import { Currency } from '~/constants/currencies'

const chart = ref()

const route = useRoute()
const { selectedCurrency } = useCurrency()
const { convertToLocalCurrency, favoriteColor, formatUTCDate } = useStringFormatter()

const kidSlug = ref(route.params.kidSlug)
const tableFilter = ref<'all' | 'dollar' | 'interest'>('all')
const tableRowLimit = ref<'30' | '60' | 'all'>('30')

const screenshotModeCookie = useCookie<boolean>('screenshot-mode', {
  default: () => false
})

const { data: kid, refresh: refreshKid } = await useFetch<Kid>('/api/get-kid-adjustments', {
  body: {
    screenshotMode: screenshotModeCookie.value,
    slug: kidSlug.value
  },
  method: 'post'
})
if (!kid.value) {
  showError({ statusCode: 500, statusMessage: 'There was an error loading this page.' })
}

const totalValue = computed(() => {
  return kid.value?.adjustments[0]?.totalToDate ?? 0
})

const filteredAdjustments = computed(() => {
  if (kid.value) {
    // Filter by adjustment type
    if (tableFilter.value === 'dollar') {
      return kid.value.adjustments.filter(adjustment => adjustment.percentAdjustment === 0)
    }
    if (tableFilter.value === 'interest') {
      return kid.value.adjustments.filter(adjustment => adjustment.percentAdjustment !== 0)
    }

    return kid.value.adjustments
  }

  return []
})

const limitedAdjustments = computed(() => {
  if (tableRowLimit.value !== 'all') {
    // Limit results based on `tableRowLimit`
    let compareToDate: Date

    const today = new Date()
    switch (tableRowLimit.value) {
      case '30':
        compareToDate = new Date(new Date().setDate(today.getDate() - 30))
        break
      case '60':
        compareToDate = new Date(new Date().setDate(today.getDate() - 60))
        break
    }

    if (compareToDate) {
      return filteredAdjustments.value.filter((adjustment) => {
        return new Date(adjustment.createdDate).getTime() > compareToDate.getTime()
      })
    }
  }

  return filteredAdjustments.value
})

watch(() => limitedAdjustments, () => {
  chart.value.updateChart()
})

const estimateTextClass = computed(() => {
  if ([Currency.MalaysianRinggit, Currency.SingaporeDollar].includes(selectedCurrency.value)) {
    return 'text-sm @sm:text-lg'
  }

  return 'text-xl'
})

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <Head>
      <Title>💰 {{ kid.name }}’s Adjustments : Kids Money</Title>
    </Head>

    <NuxtLayout name="default">
      <template #action-buttons>
        <LinkButton
          class="bg-primary"
          retain-style
          theme="small"
          title="Refresh"
          @click="refreshKid"
        >
          <div class="sr-only">
            Refresh
          </div>
          <IconRefresh />
        </LinkButton>

        <LinkButton
          v-if="kid"
          class="bg-primary"
          retain-style
          theme="small"
          title="Settings"
          :to="`/${kid.slug}/settings`"
        >
          <div class="sr-only">
            Settings
          </div>
          <IconSettings />
        </LinkButton>
      </template>

      <div
        v-if="kid"
        :style="{
          '--color-favorite-100': favoriteColor({kid}),
          '--color-favorite-80': favoriteColor({kid, opacity: 0.8}),
          '--color-favorite-50': favoriteColor({kid, opacity: 0.5})
        }"
      >
        <div class="@container grid items-end gap-8 lg:grid-cols-[minmax(200px,600px)_1fr]">
          <div>
            <KidSummary
              class="mb-4"
              :kid="kid"
              @adjustment-added="refreshKid"
            />

            <div
              class="@container block p-5 bg-white border border-primary-300 rounded-lg text-primary shadow-md dark:opacity-90"
              :style="{
                borderColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.2 }) : null,
                color: favoriteColor({ kid })
              }"
            >
              <dl class="grid grid-cols-2 justify-center gap-6 text-center @sm:grid-cols-4">
                <div
                  class="bg-primary/20 outline outline-8 rounded-sm"
                  :style="{
                    backgroundColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null,
                    outlineColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null,
                  }"
                >
                  <dd :class="estimateTextClass">
                    <span>{{ convertToLocalCurrency(dollarAdjustmentFromInterestPercentage(kid.interest, totalValue) ?? 0) }}</span>
                  </dd>
                  <dt class="text-xs">
                    Daily
                  </dt>
                </div>
                <div class="opacity-70">
                  <dd :class="estimateTextClass">
                    <span>{{ convertToLocalCurrency(estimateInterestTotalOverTime(7, kid.interest, totalValue) ?? 0) }}</span>
                  </dd>
                  <dt class="text-xs">
                    1 Week
                  </dt>
                </div>
                <div class="opacity-70">
                  <dd :class="estimateTextClass">
                    <span>{{ convertToLocalCurrency(estimateInterestTotalOverTime(30, kid.interest, totalValue) ?? 0) }}</span>
                  </dd>
                  <dt class="text-xs">
                    30 Days
                  </dt>
                </div>
                <div class="opacity-70">
                  <dd :class="estimateTextClass">
                    <span>{{ convertToLocalCurrency(estimateInterestTotalOverTime(365, kid.interest, totalValue) ?? 0) }}</span>
                  </dd>
                  <dt class="text-xs">
                    1 Year
                  </dt>
                </div>
              </dl>
            </div>
          </div>

          <div class="flex flex-col justify-end gap-4 @sm:items-end">
            <div class="flex-grow w-full">
              <ChartAllForKid ref="chart" :adjustments="limitedAdjustments" :color="favoriteColor({ kid })" />
            </div>
            <div class="flex flex-col gap-4 @sm:flex-row">
              <div class="isolate flex h-[42px] rounded-md @sm:shadow-sm">
                <button
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableRowLimit === '30', 'bg-white text-gray-700 hover:bg-gray-50': tableRowLimit !== '30' }"
                  type="button"
                  @click="tableRowLimit = '30'"
                >
                  30 Days
                </button>
                <button
                  class="relative -ml-px inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableRowLimit === '60', 'bg-white text-gray-700 hover:bg-gray-50': tableRowLimit !== '60' }"
                  type="button"
                  @click="tableRowLimit = '60'"
                >
                  60 Days
                </button>
                <button
                  class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableRowLimit === 'all', 'bg-white text-gray-700 hover:bg-gray-50': tableRowLimit !== 'all' }"
                  type="button"
                  @click="tableRowLimit = 'all'"
                >
                  All
                </button>
              </div>

              <div class="isolate flex h-[42px] rounded-md @sm:shadow-sm">
                <button
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'all', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'all' }"
                  type="button"
                  @click="tableFilter = 'all'"
                >
                  All
                </button>
                <button
                  class="relative -ml-px inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'dollar', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'dollar' }"
                  type="button"
                  @click="tableFilter = 'dollar'"
                >
                  Dollar
                </button>
                <button
                  class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                  :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'interest', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'interest' }"
                  type="button"
                  @click="tableFilter = 'interest'"
                >
                  Interest
                </button>
              </div>
            </div>
          </div>
        </div>

        <section class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table class="min-w-full divide-y divide-[var(--color-favorite-100)] bg-white dark:bg-slate-700">
            <thead class="bg-[var(--color-favorite-100)]">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                  Dollar Adjustment
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell">
                  Percent Adjustment
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell">
                  Created Date
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell">
                  Total to Date
                </th>
              <!--              <th v-if="canViewAdmin" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">-->
              <!--                <span class="sr-only">Actions</span>-->
              <!--              </th>-->
              </tr>
            </thead>

            <tbody class="divide-y divide-[var(--color-favorite-100)] bg-[var(--color-favorite-80)]">
              <tr v-for="adjustment in limitedAdjustments" :key="adjustment.id">
                <td class="w-full max-w-0 py-4 pl-4 pr-3 text-white sm:w-auto sm:max-w-none sm:pl-6">
                  <span class="hidden font-normal text-xl sm:inline" :title="`$${adjustment.dollarAdjustment}`">{{ convertToLocalCurrency(adjustment.dollarAdjustment) }}</span>
                  <dl class="grid grid-cols-[1fr_min-content] gap-2 font-normal sm:hidden">
                    <span class="font-bold text-4xl sm:font-normal sm:text-sm">{{ convertToLocalCurrency(adjustment.dollarAdjustment) }}</span>
                    <div>
                      <dt class="sr-only">
                        Percent Adjustment
                      </dt>
                      <dd class="mt-1 truncate text-white text-xl opacity-70">
                        <span v-if="adjustment.percentAdjustment !== 0">{{ adjustment.percentAdjustment }}%</span>
                      </dd>
                    </div>
                    <div>
                      <dt class="sr-only">
                        Created Date
                      </dt>
                      <dd class="mt-1 truncate text-white text-sm opacity-70">
                        <i>{{ formatUTCDate(adjustment.createdDate) }}</i>
                      </dd>
                    </div>
                    <div class="mt-1 flex gap-2 sm:hidden">
                      <dt class="sr-only">
                        Total to Date
                      </dt>
                      <dd class="truncate text-white text-sm opacity-90">
                        {{ convertToLocalCurrency(adjustment.totalToDate) }}
                      </dd>
                    </div>
                  </dl>
                </td>
                <td class="hidden px-3 py-4 text-sm text-white opacity-80 sm:table-cell">
                  <span v-if="adjustment.percentAdjustment !== 0" :title="`$${adjustment.dollarAdjustment}`">{{ adjustment.percentAdjustment }}%</span>
                </td>
                <td class="hidden px-3 py-4 text-sm text-white opacity-80 sm:table-cell">
                  {{ formatUTCDate(adjustment.createdDate) }}
                </td>
                <td class="hidden px-3 py-4 font-bold text-sm text-white sm:table-cell" :title="`$${adjustment.totalToDate}`">
                  {{ convertToLocalCurrency(adjustment.totalToDate) }}
                </td>
              <!--              <td v-if="canViewAdmin" class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">-->
              <!--                <LinkButton-->
              <!--                  class="bg-primary"-->
              <!--                  retain-style-->
              <!--                  theme="small"-->
              <!--                  title="Edit Adjustment"-->
              <!--                >-->
              <!--                  <div class="sr-only">-->
              <!--                    Edit-->
              <!--                  </div>-->
              <!--                  <IconEdit />-->
              <!--                </LinkButton>-->
              <!--              </td>-->
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>
