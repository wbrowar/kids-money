<script lang="ts" setup>

defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="container flex items-center justify-center mx-auto px-4 py-10 min-h-[100dvh] lg:py-20">
    <div class="text-center">
      <div class="text-2xl text-primary-800">
        {{ error }}
      </div>

      <LinkButton class="gap-2 mx-auto mt-8 bg-primary" label-text="Try again" element-type="button" @click="handleError">
        <IconRefresh />
        Try again
      </LinkButton>
    </div>
  </div>
</template>
