import { Kid } from '~/types'

export const useKids = async () => {
  const kids = ref<Kid[]>([])
  const kidsLookup = computed(() => {
    const lookup: Record<string, Kid> = {}

    kids.value.forEach((kid) => {
      lookup[kid.slug] = kid
    })

    return lookup
  })

  const { data, refresh } = await useFetch('/api/get-kids', {
    method: 'post'
  })
  kids.value = data.value ?? []

  function refreshKids () {
    refresh()
    kids.value = data.value ?? []
  }

  return {
    kids,
    kidsLookup,
    refreshKids
  }
}
