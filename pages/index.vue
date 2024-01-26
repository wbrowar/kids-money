<script lang="ts" setup>
const { canViewAdmin } = useCurrentUser()

const screenshotModeCookie = useCookie<boolean>('screenshot-mode', {
  default: () => false
})

const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  body: {
    includeAdjustments: true,
    screenshotMode: screenshotModeCookie.value
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

      <div v-if="kids.length" class="space-y-8 md:space-y-14">
        <div class="flex flex-wrap justify-center gap-8 px-2 md:px-8 md:gap-16" :style="{ '--count': kids.length }">
          <KidSummary
            v-for="kid in kids"
            :key="kid.slug"
            class="basis-[200px] flex-grow max-w-[500px]"
            enable-link
            :kid="kid"
            @adjustment-added="refreshKids"
          />
        </div>

        <div>
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
