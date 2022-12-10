<script setup lang="ts">
const { canViewAdmin } = useCurrentUser()
const { kids, kidsLookup } = useKids()

</script>

<template>
  <div>
    <h1>Page: index</h1>
    <div>
      <h2>Kids</h2>
      <div v-if="!kids.length">
        No kids

        <NuxtLink v-if="canViewAdmin" to="/admin">
          Admin
        </NuxtLink>
      </div>
      <div v-for="kid in kidsLookup" v-else :key="kid.slug">
        <p>Grown Up: {{ kid.name }}</p>
        <p>Slug: {{ kid.slug }}</p>
      </div>
    </div>
  </div>
</template>
