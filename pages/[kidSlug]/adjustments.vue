<script lang="ts" setup>
import { Kid } from '~/types'

const route = useRoute()
// const { canViewAdmin } = useCurrentUser()
const { favoriteColor, formatUTCDate, convertToLocalCurrency } = useStringFormatter()

const kidSlug = ref(route.params.kidSlug)
const tableFilter = ref<'all' | 'dollar' | 'interest'>('all')

const { data: kid, refresh: refreshKid } = await useFetch<Kid>('/api/get-kid-adjustments', {
  body: {
    slug: kidSlug.value
  },
  method: 'post'
})
if (!kid.value) {
  showError({ statusCode: 500, statusMessage: 'There was an error loading this page.' })
}

const filteredAdjustments = computed(() => {
  if (kid.value) {
    if (tableFilter.value === 'dollar') {
      return kid.value.adjustments.filter(adjustment => adjustment.percentAdjustment === 0)
    }
    if (tableFilter.value === 'interest') {
      return kid.value.adjustments.filter(adjustment => adjustment.percentAdjustment !== 0)
    }

    return kid.value.adjustments
  }
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
        <div class="grid items-end gap-8 lg:grid-cols-[minmax(200px,500px)_1fr]">
          <KidSummary
            class="max-w-[500px]"
            :kid="kid"
            @adjustment-added="refreshKid"
          />

          <div class="text-right">
            <span class="isolate inline-flex rounded-md shadow-sm">
              <button
                class="relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'all', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'all' }"
                type="button"
                @click="tableFilter = 'all'"
              >All</button>
              <button
                class="relative -ml-px inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'dollar', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'dollar' }"
                type="button"
                @click="tableFilter = 'dollar'"
              >Dollar</button>
              <button
                class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-favorite-50)] dark:border-gray-800"
                :class="{ 'bg-[var(--color-favorite-100)] text-white': tableFilter === 'interest', 'bg-white text-gray-700 hover:bg-gray-50': tableFilter !== 'interest' }"
                type="button"
                @click="tableFilter = 'interest'"
              >Interest</button>
            </span>
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
              <tr v-for="adjustment in filteredAdjustments" :key="adjustment.id">
                <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm text-white sm:w-auto sm:max-w-none sm:pl-6">
                  {{ convertToLocalCurrency(adjustment.dollarAdjustment) }}
                  <dl class="font-normal sm:hidden">
                    <dt class="sr-only">
                      Percent Adjustment
                    </dt>
                    <dd class="mt-1 truncate text-white">
                      {{ adjustment.percentAdjustment }}%
                    </dd>
                    <dt class="sr-only">
                      Created Date
                    </dt>
                    <dd class="mt-1 truncate text-white">
                      {{ formatUTCDate(adjustment.createdDate) }}
                    </dd>
                    <div class="mt-1 flex gap-2">
                      <dt class="sm:hidden">
                        Total to Date
                      </dt>
                      <dd class="truncate text-white sm:hidden">
                        {{ convertToLocalCurrency(adjustment.totalToDate) }}
                      </dd>
                    </div>
                  </dl>
                </td>
                <td class="hidden px-3 py-4 text-sm text-white sm:table-cell">
                  {{ adjustment.percentAdjustment }}%
                </td>
                <td class="hidden px-3 py-4 text-sm text-white sm:table-cell">
                  {{ formatUTCDate(adjustment.createdDate) }}
                </td>
                <td class="hidden px-3 py-4 font-bold text-sm text-white sm:table-cell">
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
