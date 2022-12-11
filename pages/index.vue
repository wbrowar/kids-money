<script lang="ts" setup>
const { canViewAdmin } = useCurrentUser()

const { data: kids } = await useFetch('/api/get-kids', {
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
        <AddAdjustmentForm />
      </div>
    </div>
  </div>
</template>
