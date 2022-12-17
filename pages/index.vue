<script lang="ts" setup>
const { canViewAdmin } = useCurrentUser()

const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  body: {
    includeAdjustments: true
  },
  method: 'post'
})
if (!kids.value) {
  showError({ statusCode: 500, statusMessage: 'There was an error loading this page.' })
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <Head>
      <Title>🏠 : Kids Money</Title>
    </Head>

    <NuxtLayout name="default">
      <template #action-buttons>
        <LinkButton
          class="bg-primary"
          retain-style
          theme="small"
          title="Refresh"
          @click="refreshKids"
        >
          <div class="sr-only">
            Refresh
          </div>
          <IconRefresh />
        </LinkButton>
      </template>

      <div v-if="kids.length">
        <div class="flex flex-wrap justify-center gap-16" :style="{ '--count': kids.length }">
          <KidSummary
            v-for="kid in kids"
            :key="kid.slug"
            class="basis-[200px] flex-grow max-w-[500px]"
            enable-link
            :kid="kid"
            @adjustment-added="refreshKids"
          />
        </div>

        <div class="mt-8">
          <ChartAdjustmentsMonthly :kids="kids" />
        </div>
      </div>
      <div v-else class="py-20 text-primary-800 text-center">
        <p class="text-xl">
          No kids have been added. Log in as and admin and go to Settings to add one.
        </p>

        <LinkButton
          v-if="canViewAdmin"
          class="mt-4 gap-2 bg-primary"
          retain-style
          label-text="Admin"
          theme="small"
          title="Admin"
          to="/admin"
        >
          <IconAdmin />
          Settings
        </LinkButton>
      </div>
    </NuxtLayout>
  </div>
</template>
