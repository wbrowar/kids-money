<script lang="ts" setup>
const { canViewAdmin, loggedIn } = useCurrentUser()
</script>

<template>
  <div class="container mx-auto px-4 py-10 lg:py-20">
    <slot />
    <div v-if="loggedIn" class="inline-block absolute top-3 right-3 space-x-2">
      <LinkButton
        v-if="$route.path !== '/'"
        class="bg-primary"
        retain-style
        theme="small"
        title="Home"
        to="/"
      >
        <div class="sr-only">
          Home
        </div>
        <IconHome />
      </LinkButton>
      <slot name="action-buttons">
        <LinkButton
          v-if="canViewAdmin"
          class="bg-primary"
          retain-style
          label-text="Admin"
          theme="small"
          title="Admin"
          to="/admin"
        >
          <div class="sr-only">
            Admin
          </div>
          <IconAdmin />
        </LinkButton>
      </slot>
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
  </div>
</template>
