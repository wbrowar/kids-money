<script lang="ts" setup>
const { logIn } = useCurrentUser()

definePageMeta({
  layout: 'blank'
})
</script>

<template>
  <div>
    <h1>Page: login</h1>
    <div>
      <button @click="logIn({ password: 'my-pass', redirect: '/', username: 'phil' })">
        Log In
      </button>
    </div>
  </div>
</template>
