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

const { playConfettiAnimation } = useConfetti()
const { grownUp } = useCurrentUser()
const runtimeConfig = useRuntimeConfig()
const { convertToLocalCurrency, cookieExpirationDate, favoriteColor } = useStringFormatter()

const previousTotalCookie = useCookie<number>(`${props.kid.slug}:previous-total`, {
  default: () => 0,
  maxAge: cookieExpirationDate()
})

const helpText = ref('')
const totalValue = computed(() => {
  return props.kid?.adjustments?.[0].totalToDate ?? 0
})
const total = computed(() => {
  return convertToLocalCurrency(totalValue.value)
})

function playConfettiIfTotalDiff () {
  if (runtimeConfig.public.fun && previousTotalCookie.value !== null) {
    if (totalValue.value > previousTotalCookie.value) {
      playConfettiAnimation()
    }

    if (process.client) {
      previousTotalCookie.value = totalValue.value
    }
  }
}

watch(totalValue, () => playConfettiIfTotalDiff())

function onAdjustmentAdded () {
  emit('adjustment-added')
}

onMounted(() => {
  playConfettiIfTotalDiff()
})
</script>

<template>
  <div v-if="kid" class="@container group">
    <div
      class="block space-y-2 bg-white border border-primary-300 rounded-lg text-favorite shadow-md dark:opacity-90"
      :style="{
        borderColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.2 }) : null,
        color: favoriteColor({ kid })
      }"
      @mouseover="helpText = 'View details'"
    >
      <NuxtLink
        :class="{ 'cursor-pointer hover:grayscale': enableLink }"
        element-type="button"
        :to="enableLink ? `${kid.slug}/adjustments` : null"
      >
        <div class="block p-8 pb-6 font-bold text-3xl text-center @xs:text-5xl @sm:text-6xl">
          {{ total }}
        </div>
        <div
          class="flex items-center justify-center gap-3 p-4 h-16 bg-primary border-t border-t-solid border-t-primary/20 rounded-b-[0.4rem] text-white @xs:h-24"
          :style="{ backgroundColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.07 }) : null, borderTopColor: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid, opacity:.1 }) : null }"
        >
          <img v-if="kid.photoUrl" class="w-10 h-10 rounded-full object-cover shadow border-4 @xs:w-16 @xs:h-16" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
          <div class="text-3xl text-primary-100 dark:text-primary-800" :style="{ color: favoriteColor({ kid }).startsWith('rgb') ? favoriteColor({ kid }) : null }">
            {{ kid.name }}
          </div>
        </div>
      </NuxtLink>
      <p v-if="enableLink" class="absolute top-full text-sm text-primary-600 opacity-0 transition duration-300 group-hover:delay-1000 group-hover:opacity-100">
        {{
          helpText }}
      </p>
    </div>

    <AddAdjustmentForm v-if="!enableLink && grownUp" class="mt-4" :kid="kid" @adjustment-added="onAdjustmentAdded" @mouseover-element="helpText = $event.tooltip" />
  </div>
</template>
