import { Kid } from '~/types'

export const useKids = () => {
  const kidsLookup = useState<Record<string, Kid>>('kidsLookup')
  log('kids val', kidsLookup.value)

  if (!kidsLookup.value) {
    log('no kids')
    getKidsLookup()
  }
  async function getKidsLookup () {
    const kidsResponse: Kid[] = await $fetch('/api/get-kids')

    kidsLookup.value = {}

    kidsResponse.forEach((kid) => {
      kidsLookup.value[kid.slug] = kid
    })
  }

  return {
    kidsLookup
  }
}
