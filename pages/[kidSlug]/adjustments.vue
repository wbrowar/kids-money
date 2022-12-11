<script lang="ts" setup>
const route = useRoute()
const { convertToLocalCurrency } = useStringFormatter()

const kidSlug = ref(route.params.kidSlug)

const { data: kid, refresh: refreshKid } = await useFetch('/api/get-kid-adjustments', {
  body: {
    slug: kidSlug.value
  },
  method: 'post'
})
</script>

<template>
  <div v-if="kid">
    <p>Name: {{ kid.name }}</p>
    <p>Slug: {{ kidSlug }}</p>
    <AddAdjustmentForm :kid-id="kid.id" @adjustment-added="refreshKid" />
    <table>
      <thead>
        <tr>
          <th>Dollar Adjustment</th>
          <th>Percent Adjustment</th>
          <th>Total to Date</th>
        </tr>
      </thead>
      <tbody v-if="kid.adjustments">
        <tr v-for="adjustment in kid.adjustments" :key="adjustment.id">
          <td>
            {{ convertToLocalCurrency(adjustment.dollarAdjustment) }}
          </td>
          <td>
            {{ adjustment.percentAdjustment }}%
          </td>
          <td>
            {{ convertToLocalCurrency(adjustment.totalToDate) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
