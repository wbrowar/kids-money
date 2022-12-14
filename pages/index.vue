<script lang="ts" setup>
const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  body: {
    includeAdjustments: true
  },
  method: 'post'
})

</script>

<template>
  <div>
    <Head>
      <Title>🏠 : Kids Money</Title>
    </Head>

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
    </div>
  </div>
</template>
