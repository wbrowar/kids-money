<script lang="ts" setup>
const { logIn } = useCurrentUser()

const username = ref('phil')
const password = ref('my-new-password')
</script>

<template>
  <div>
    <Head>
      <Title>🪵 Login : Kids Money</Title>
    </Head>

    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <IconLogo class="mx-auto w-20 h-20 text-primary" />
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
          Kids Money : Sign in
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md dark:opacity-90">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" action="#" @submit.prevent="logIn({ password, redirect: '/', username })">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <div class="mt-1">
                <input
                  id="username"
                  v-model="username"
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  name="username"
                  type="username"
                  autocomplete="username"
                  required
                >
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="password"
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                >
              </div>
            </div>

            <div>
              <LinkButton
                class="!flex w-full bg-primary sm:w-full"
                :disabled="username === '' || password === ''"
                element-type="input"
                type="submit"
                value="Sign in"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
