import { Kid } from '~/types'

export const useKids = () => {
  const kids = useState<Kid[]>('kids', () => [])
  const kidsLookup = computed(() => {
    const lookup: Record<string, Kid> = {}

    kids.value.forEach((kid) => {
      lookup[kid.slug] = kid
    })

    return lookup
  })

  if (!kids.value.length) {
    getKids()
  }

  async function getKids () {
    const { data } = await useFetch('/api/get-kids')
    log('data', data.value)
    kids.value = data.value ?? []
  }

  return {
    kids,
    kidsLookup
  }
}
