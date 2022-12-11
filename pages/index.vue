<script lang="ts" setup>
import { Kid } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const { convertToLocalCurrency } = useStringFormatter()
const { canViewAdmin } = useCurrentUser()

function kidsTotal (kid: Kid) {
  return convertToLocalCurrency(kid?.adjustments?.[0]?.totalToDate ?? 0)
}

const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  body: {
    includeAdjustments: true
  },
  method: 'post'
})

</script>

<template>
  <div>
    <h1>Page: index</h1>
    <div v-if="kids">
      <h2>Kids</h2>
      <div v-if="!kids.length">
        No kids

        <NuxtLink v-if="canViewAdmin" to="/admin">
          Admin
        </NuxtLink>
      </div>
      <div v-for="kid in kids" v-else :key="kid.slug">
        <NuxtLink :to="`${kid.slug}/adjustments`">
          {{ kid.name }}
        </NuxtLink>
        <p>{{ kid.slug }}</p>
        <p>Total: {{ kidsTotal(kid) }}</p>
        <AddAdjustmentForm :kid-id="kid.id" @adjustment-added="refreshKids" />
      </div>
    </div>
  </div>
</template>
