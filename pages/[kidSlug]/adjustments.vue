<script lang="ts" setup>
const route = useRoute()

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
    <p>Name: {{ kid.name }}</p>
    <p>Slug: {{ kidSlug }}</p>
  </div>
</template>
