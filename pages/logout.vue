<script lang="ts" setup>
const { grownUp, loggedIn, username, loggedInCookie } = useCurrentUser()

function logOut () {
  loggedInCookie.value = {}
  log('Logging out user:', username.value)
  grownUp.value = false
  loggedIn.value = false
  username.value = ''
  navigateTo('/login')
}

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
