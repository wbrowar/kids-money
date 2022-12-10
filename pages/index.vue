<script setup lang="ts">
const { kidsLookup } = useKids()

</script>

<template>
  <div>
    <h1>Page: index</h1>
    <div>
      <h2>Kids</h2>
      <div v-for="kid in kidsLookup" :key="kid.slug">
        <p>Grown Up: {{ kid.name }}</p>
        <p>Slug: {{ kid.slug }}</p>
      </div>
    </div>
  </div>
</template>
