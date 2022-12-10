<script setup lang="ts">
const { currentUser } = useCurrentUser()
const { kidsLookup } = useKids()
// const { dbGetAll } = await useDb()

// function checkDb () {
//   const results = dbGetAll('SELECT * from users')
//
//   log('Check DB results:', results)
// }
//
// onMounted(() => {
//   checkDb()
// })

log('kidsLookup', kidsLookup)

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
        <p>Grown Up: {{ currentUser.grownUp }}</p>
        <p>ID: {{ currentUser.id }}</p>
        <p>Username: {{ currentUser.username }}</p>
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
