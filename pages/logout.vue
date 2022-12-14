<script lang="ts" setup>
const { logOut } = useCurrentUser()

onMounted(() => {
  logOut()
})

definePageMeta({
  layout: 'blank'
})
</script>

<template>
  <Head>
    <Title>🪵 Logout : Kids Money</Title>
  </Head>
</template>
