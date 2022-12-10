<script setup lang="ts">
const { logIn } = useCurrentUser()

definePageMeta({
  layout: 'blank'
})
</script>

<template>
  <div>
    <h1>Page: login</h1>
    <div>
      <button @click="logIn">
        Log In
      </button>
    </div>
  </div>
</template>
