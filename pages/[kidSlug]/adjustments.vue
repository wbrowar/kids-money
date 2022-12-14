<script lang="ts" setup>
const route = useRoute()
const { canViewAdmin } = useCurrentUser()
const { formatUTCDate, convertToLocalCurrency } = useStringFormatter()

const kidSlug = ref(route.params.kidSlug)

const { data: kid, refresh: refreshKid } = await useFetch('/api/get-kid-adjustments', {
  body: {
    slug: kidSlug.value
  },
  method: 'post'
})
</script>

<template>
  <div v-if="kid">
    <KidSummary
      class="max-w-[400px]"
      :kid="kid"
      @adjustment-added="refreshKid"
    />

    <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Dollar Adjustment
            </th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              Percent Adjustment
            </th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              Created Date
            </th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
              Total to Date
            </th>
            <th v-if="canViewAdmin" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="adjustment in kid.adjustments" :key="adjustment.id">
            <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
              {{ convertToLocalCurrency(adjustment.dollarAdjustment) }}
              <dl class="font-normal sm:hidden">
                <dt class="sr-only">
                  Percent Adjustment
                </dt>
                <dd class="mt-1 truncate text-gray-700">
                  {{ adjustment.percentAdjustment }}%
                </dd>
                <dt class="sr-only">
                  Created Date
                </dt>
                <dd class="mt-1 truncate text-gray-700">
                  {{ formatUTCDate(adjustment.createdDate) }}
                </dd>
                <div class="mt-1 flex gap-2">
                  <dt class="sm:hidden">
                    Total to Date
                  </dt>
                  <dd class="truncate text-gray-500 sm:hidden">
                    {{ convertToLocalCurrency(adjustment.totalToDate) }}
                  </dd>
                </div>
              </dl>
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {{ adjustment.percentAdjustment }}%
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {{ formatUTCDate(adjustment.createdDate) }}
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {{ convertToLocalCurrency(adjustment.totalToDate) }}
            </td>
            <td v-if="canViewAdmin" class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <LinkButton
                class="bg-primary"
                retain-style
                theme="small"
                title="Edit Adjustment"
              >
                <div class="sr-only">
                  Edit
                </div>
                <IconEdit />
              </LinkButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
