<script lang="ts" setup>
import ConfettiContainer from '~/components/ConfettiContainer.vue'
import CurrencySelect from '~/components/CurrencySelect.vue'

const { canViewAdmin, loggedIn } = useCurrentUser()
</script>

<template>
  <div>
    <div class="fixed top-0 w-screen h-[100dvh]">
      <ConfettiContainer />
    </div>
    <div class="container relative mx-auto px-4 py-16 lg:py-20">
      <slot />

      <CurrencySelect v-if="$route.path === '/' || $route.path.endsWith('/adjustments')" class="mt-16 mx-auto max-w-[900px]" />
    </div>

    <div v-if="loggedIn" class="inline-block absolute top-3 right-3 space-x-2">
      <LinkButton
        v-if="$route.path !== '/'"
        class="bg-primary"
        retain-style
        theme="round"
        title="Home"
        to="/"
      >
        <div class="sr-only">
          Home
        </div>
        <IconHome />
      </LinkButton>
      <slot name="action-buttons" />
      <LinkButton
        v-if="canViewAdmin"
        class="bg-primary"
        retain-style
        label-text="Settings"
        theme="small"
        title="Settings"
        to="/admin"
      >
        <div class="sr-only">
          Settings
        </div>
        <IconAdmin />
      </LinkButton>
      <LinkButton
        class="bg-primary"
        retain-style
        label-text="Log Out"
        theme="small"
        title="Log Out"
        to="/logout"
      >
        <div class="sr-only">
          Log Out
        </div>
        <IconLogOut />
      </LinkButton>
    </div>

    <!--    <footer class="fixed bottom-0 w-full">-->
    <!--      <div class="container mx-auto p-4 bottom-0 h-12 bg-secondary/70 rounded-t-xl backdrop-blur-sm text-white text-sm opacity-80 duration-300 hover:opacity-100 lg:w-min">-->
    <!--        <p>whattt</p>-->
    <!--      </div>-->
    <!--    </footer>-->
  </div>
</template>
