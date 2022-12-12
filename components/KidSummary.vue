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

const { convertToLocalCurrency } = useStringFormatter()

const total = computed(() => {
  return convertToLocalCurrency(props.kid?.adjustments?.[0].totalToDate ?? 0)
})

function favoriteColor (opacity = 1) {
  log('totaa', props.kid?.color)
  const color = props.kid?.color ?? '180 0 255'

  return /\d+ \d+ \d+/g.test(color) ? `rgb(${color} / ${opacity})` : color
}

function onAdjustmentAdded () {
  emit('adjustment-added')
}
</script>

<template>
  <div v-if="kid" class="@container/main">
    <NuxtLink
      class="block space-y-2 bg-white text-favorite shadow-md shadow-primary/20 rounded-lg"
      :class="{ 'hover:transition hover:rotate-[2deg] hover:translate-y-[-10px]': enableLink }"
      :style="{ '--tw-shadow-color': favoriteColor().startsWith('rgb') ? favoriteColor(.07) : null, color: favoriteColor() }"
      :to="enableLink ? `${kid.slug}/adjustments` : null"
    >
      <div class="p-8 pb-6 font-bold text-3xl text-center @xs/main:text-5xl @sm/main:text-6xl">
        {{ total }}
      </div>
      <div class="flex items-center justify-center gap-3 p-4 h-16 bg-primary/5 border-t border-t-solid border-t-primary/20 rounded-b-lg @xs/main:h-24" :style="{ backgroundColor: favoriteColor().startsWith('rgb') ? favoriteColor(.07) : null, borderTopColor: favoriteColor().startsWith('rgb') ? favoriteColor(.1) : null }">
        <img v-if="kid.photoUrl" class="w-10 h-10 rounded-full object-cover shadow border-4 @xs/main:w-16 @xs/main:h-16" :src="kid.photoUrl" :style="{ borderColor: favoriteColor(.7) }">
        <div class="text-3xl" :style="{ color: favoriteColor() }">
          {{ kid.name }}
        </div>
      </div>
    </NuxtLink>

    <AddAdjustmentForm class="mt-4" :kid-id="kid.id" @adjustment-added="onAdjustmentAdded" />
  </div>
</template>
