<script lang="ts" setup>
import '@/assets/main.css'

</script>

<template>
  <div class="py-8 bg-primary-100 min-h-[100dvh]">
    <Head>
      <Meta charset="utf-8" />
      <Meta content="width=device-width,initial-scale=1.0" name="viewport" />
      <Meta name="theme-color" content="#1FD22C" />
      <Link rel="manifest" href="manifest.json" />
      <link rel="shortcut icon" href="/images/favicon.ico">
      <Link rel="icon" type="image/png" href="/images/icons-192.png" />
      <Link color="#0054ff" href="/images/icons-vector.svg" rel="mask-icon" />
    </Head>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
