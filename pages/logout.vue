<script lang="ts" setup>
const { logOut } = useCurrentUser()

onMounted(() => {
  logOut()
})

definePageMeta({
  layout: 'blank'
})
</script>
