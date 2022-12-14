<script lang="ts" setup>
import { PropType } from 'vue'
import { useStringFormatter } from '~/composables/useStringFormatter'
import { Kid } from '~/types'

const emit = defineEmits(['adjustment-added'])
const props = defineProps({
  enableLink: {
    default: false,
    type: Boolean
  },
  kid: {
    required: true,
    type: Object as PropType<Kid>
  }
})

const { canViewAdmin } = useCurrentUser()
const { convertToLocalCurrency, favoriteColor } = useStringFormatter()

const total = computed(() => {
  return convertToLocalCurrency(props.kid?.adjustments?.[0].totalToDate ?? 0)
})

function onAdjustmentAdded () {
  emit('adjustment-added')
}
</script>

<template>
  <div v-if="kid" class="@container/main">
    <NuxtLink
      class="block space-y-2 bg-white border border-primary-300 rounded-lg text-favorite dark:opacity-90"
      :class="{ 'hover:transition hover:rotate-[2deg] hover:translate-y-[-10px]': enableLink }"
      :style="{
        borderColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null,
        color: favoriteColor({ kid })
      }"
      :to="enableLink ? `${kid.slug}/adjustments` : null"
    >
      <div class="p-8 pb-6 font-bold text-3xl text-center @xs/main:text-5xl @sm/main:text-6xl">
        {{ total }}
      </div>
      <div class="flex items-center justify-center gap-3 p-4 h-16 bg-gray-100 border-t border-t-solid border-t-primary/20 rounded-b-lg @xs/main:h-24" :style="{ backgroundColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.07 }) : null, borderTopColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null }">
        <img v-if="kid.photoUrl" class="w-10 h-10 rounded-full object-cover shadow border-4 @xs/main:w-16 @xs/main:h-16" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
        <div class="text-3xl" :style="{ color: favoriteColor({ kid }) }">
          {{ kid.name }}
        </div>
      </div>
    </NuxtLink>

    <AddAdjustmentForm v-if="canViewAdmin" class="mt-4" :kid="kid" @adjustment-added="onAdjustmentAdded" />
  </div>
</template>
