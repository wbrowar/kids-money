<script lang="ts" setup>
import { useStringFormatter } from '~/composables/useStringFormatter'
import { Kid } from '~/types'

const route = useRoute()

const { colorIsRgb, hexToRgb, favoriteColor, rgbToHex } = useStringFormatter()

const kidSlug = ref(route.params.kidSlug)
const colorEditable = ref(false)
const editedKidColorPicker = ref('#1FD22C')

const { data: kid, refresh: refreshKid } = await useFetch<{
  kid: Kid;
  refreshKid: Function;
}>('/api/get-kid-adjustments', {
  body: {
    slug: kidSlug.value
  },
  method: 'post'
})

if (kid.value) {
  colorEditable.value = true
  if (kid.value.color) {
    if (colorIsRgb(kid.value.color)) {
      const rgb = kid.value.color.split(' ')
      editedKidColorPicker.value = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))
    } else if (kid.value.color.startsWith('#')) {
      editedKidColorPicker.value = kid.value.color
    }
  }
} else {
  showError({ statusCode: 500, statusMessage: 'There was an error loading this page.' })
}

async function updateColor () {
  if (kid.value && kid.value.color !== editedKidColorPicker.value) {
    colorEditable.value = false

    const saved = await useFetch('/api/save-kid', {
      body: {
        color: hexToRgb(editedKidColorPicker.value),
        id: kid.value.id
      },
      method: 'post'
    })

    if (saved) {
      refreshKid()
    }

    colorEditable.value = true
  }
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <Head>
      <Title>💰 {{ kid.name }}’s Settings : Kids Money</Title>
    </Head>

    <NuxtLayout name="default">
      <div v-if="kid" class="flex flex-col items-center justify-center space-y-8">
        <div class="block space-y-2 bg-white border border-primary-300 rounded-lg text-favorite shadow-md dark:opacity-90">
          <div
            class="flex items-center justify-center gap-3 p-6 h-16 bg-primary border border-solid border-primary/20 rounded-[0.4rem] text-white @xs:h-24"
            :style="{ backgroundColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.07 }) : null, borderColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null }"
          >
            <img v-if="kid.photoUrl" class="w-10 h-10 rounded-full object-cover shadow border-4 @xs:w-16 @xs:h-16" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
            <div class="text-3xl text-primary-100 dark:text-primary-800" :style="{ color: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid }) : null }">
              {{ kid.name }}
            </div>
          </div>
        </div>

        <div class="block space-y-2 bg-white border border-primary-300 rounded-lg text-favorite shadow-md dark:opacity-90">
          <div
            class="flex items-center justify-center gap-3 p-6 h-16 bg-primary border border-solid border-primary/20 rounded-[0.4rem] text-white @xs:h-24"
            :style="{ backgroundColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.07 }) : null, borderColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null, color: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid }) : null }"
          >
            <div class="flex items-center gap-2">
              <input v-model="editedKidColorPicker" type="color" class="w-9 h-9 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" @blur="updateColor">
              <span class="text-lg">Favorite Color</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
