<script lang="ts" setup>
import { PropType } from 'vue'

const emit = defineEmits(['clicked'])
const props = defineProps({
  ariaLabel: {
    default: '',
    type: String
  },
  disabled: {
    default: false,
    type: Boolean
  },
  elementType: {
    default: 'a',
    type: String
  },
  href: {
    default: '',
    type: String
  },
  labelText: {
    default: '',
    type: String
  },
  newWindow: {
    default: false,
    type: Boolean
  },
  outline: {
    default: false,
    type: Boolean
  },
  reset: {
    default: false,
    type: Boolean
  },
  retainStyle: {
    default: false,
    type: Boolean
  },
  smoothAnchor: {
    default: true,
    type: Boolean
  },
  target: {
    default: '',
    type: String
  },
  to: [Object, String],
  theme: {
    default: 'default',
    type: String as PropType<'default' | 'round' | 'small'>
  },
  unstyle: {
    default: false,
    type: Boolean
  }
})
const slots = useSlots()

const classes = computed(() => {
  const classes = []
  if (styleAsButton.value) {
    classes.push('inline-flex flex-row flex-no-wrap items-center justify-center')

    if (['default', 'round', 'small'].includes(props.theme)) {
      classes.push('border border-transparent font-medium text-white shadow-sm hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2')
    }
    switch (props.theme) {
      case 'default':
        classes.push('px-4 py-2 rounded-md text-sm sm:w-auto')
        break
      case 'round':
        classes.push('px-2 py-1 w-14 h-14 rounded-full text-xs')
        break
      case 'small':
        classes.push('px-2 py-1 rounded-md text-xs sm:w-auto')
        break
    }
    if (props.href) {
      classes.push('cursor-pointer')
    }
  }
  return classes
})

const formattedHref = computed(() => {
  if (props.href) {
    if (props.href === '/') {
      // Return the homepage
      return '/'
    } else if (props.href.startsWith('http://') || props.href.startsWith('https://') || props.href.startsWith('#')) {
      return props.href
    } else {
      // Make sure route is relative
      return (props.href.startsWith('/') ? '' : '/') + props.href
    }
  }
  return null
})

const formattedTo = computed(() => {
  let to = {}

  if (formattedHref.value) {
    if (formattedHref.value.startsWith('#')) {
      to.hash = formattedHref.value
    } else {
      to.path = formattedHref.value
    }
  }

  // Overwrite all changes
  if (props.to) {
    to = props.to
  }

  return to
})

const styleAsButton = computed(() => {
  return props.retainStyle || (props.unstyle === false && Object.keys(slots).length === 0)
})

function
onClick (event) {
  if (process.client) {
    if (formattedTo.value?.hash && props.smoothAnchor) {
      const element = document.querySelector(formattedTo.value.hash)
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        })
      }
    }
  }

  emit('clicked', event)
}
</script>

<template>
  <component
    :is="elementType"
    v-if="elementType !== 'a'"
    :class="classes"
    :aria-label="ariaLabel || null"
    :disabled="disabled"
    :target="newWindow ? '_blank' : target || null"
    :to="formattedTo"
    :rel="newWindow || target ? 'noopener' : null"
    @click="onClick"
  >
    <slot>{{ labelText }}</slot>
  </component>
  <NuxtLink
    :is="elementType"
    v-else
    :class="classes"
    :aria-label="ariaLabel || null"
    :disabled="disabled"
    :target="newWindow ? '_blank' : target || null"
    :to="formattedTo"
    :rel="newWindow || target ? 'noopener' : null"
    @click="onClick"
  >
    <slot>{{ labelText }}</slot>
  </NuxtLink>
</template>
