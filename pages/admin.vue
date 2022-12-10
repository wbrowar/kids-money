<script setup lang="ts">
const { grownUp, username } = useCurrentUser()
const { kidsLookup } = useKids()

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #action-buttons>
        <NuxtLink to="/">
          Home
        </NuxtLink>
      </template>

      <h1>Page: admin</h1>
      <div>
        <h2>Current User</h2>
        <p>Grown Up: {{ grownUp }}</p>
        <p>Username: {{ username }}</p>
      </div>
      <div>
        <h2>Kids</h2>
        <div v-for="kid in kidsLookup" :key="kid.slug">
          <p>Grown Up: {{ kid.name }}</p>
          <p>Slug: {{ kid.slug }}</p>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
