<script lang="ts" setup>
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

      <div v-if="kids">
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
    </NuxtLayout>
  </div>
</template>
