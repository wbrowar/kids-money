<script setup lang="ts">
const { logOut } = useCurrentUser()

onMounted(() => {
  logOut()
})

definePageMeta({
  layout: 'blank'
})
</script>
