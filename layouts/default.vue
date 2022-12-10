<script setup lang="ts">
const { canViewAdmin } = useCurrentUser()
</script>

<template>
  <div class="border-2 border-blue">
    <h1>Layout: default</h1>
    <slot />
    <div>
      <slot name="action-buttons">
        <NuxtLink v-if="canViewAdmin" to="/admin">
          Admin
        </NuxtLink>
      </slot>
      <NuxtLink to="/logout">
        Log Out
      </NuxtLink>
    </div>
  </div>
</template>
