<script lang="ts" setup>
import '@/assets/main.css'

</script>

<template>
  <div class="min-h-[100dvh]">
    <Head>
      <Meta charset="utf-8" />
      <Meta content="width=device-width,initial-scale=1.0" name="viewport" />
      <Meta name="theme-color" content="#010C01" />
      <Link rel="manifest" href="manifest.json" />
      <Link rel="shortcut icon" href="/images/favicon.ico" />
      <Link rel="icon" type="image/png" href="/images/icons-512.png" />
      <Link rel="icon" type="image/png" href="/images/icons-192.png" />
      <Link color="#1FD22C" href="/images/icons-vector.svg" rel="mask-icon" />
    </Head>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
