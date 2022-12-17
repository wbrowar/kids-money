<script lang="ts" setup>
import Chart from 'chart.js/auto'
import GroupBy from 'lodash-es/groupBy'
import Sum from 'lodash-es/sum'
import { PropType } from 'vue'
import { Kid } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const props = defineProps({
  kids: {
    required: true,
    type: Object as PropType<Kid[]>
  }
})

const { favoriteColor } = useStringFormatter()

const chartRef = ref()
let chart

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const labels = computed(() => {
  const months = []
  const today = new Date()
  today.setDate(1)
  for (let i = 0; i <= 11; i++) {
    today.setMonth(today.getMonth() + 1)
    months.push(`${MONTHS[today.getMonth()]} ${today.getFullYear() - 1}`)
  }
  return months
})

const datasets = computed(() => {
  return props.kids?.map((kid) => {
    const data: Record<string, number> = {}

    const dataByMonth = GroupBy(kid.adjustments, ({ createdDate }) => new Date(createdDate).getMonth())
    Object.keys(dataByMonth).forEach((key) => {
      const monthData = dataByMonth[key]

      const lastTotalToDates = monthData[0].totalToDate

      const rowYear = new Date(monthData[0].createdDate)

      data[`${MONTHS[parseInt(key)]} ${rowYear.getFullYear()}`] = lastTotalToDates
    })

    return {
      backgroundColor: favoriteColor({ kid, opacity: 0.5 }),
      borderColor: favoriteColor({ kid }),
      data,
      label: kid.name
    }
  })
})

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(
      chartRef.value,
      {
        type: 'line',
        data: {
          labels: labels.value,
          datasets: datasets.value
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Totals per Month'
            }
          }
        }
      }
    )
  }
})

watch(() => props.kids, () => {
  if (chart) {
    chart.data.datasets = datasets.value
    chart.update()
  }
})
</script>

<template>
  <div>
    <div class="w-full max-w-[60rem] mx-auto">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>

<style scoped></style>
