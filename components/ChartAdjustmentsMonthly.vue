<script lang="ts" setup>
import Chart from 'chart.js/auto'
import GroupBy from 'lodash-es/groupBy'
import Sum from 'lodash-es/sum'
import { PropType } from 'vue'
import * as Utils from '~/utils/chart-utils'
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

const datasets = computed(() => {
  return props.kids?.map((kid) => {
    const data: Record<string, number> = {}

    const dataByMonth = GroupBy(kid.adjustments, ({ createdDate }) => new Date(createdDate).getMonth())
    Object.keys(dataByMonth).forEach((key) => {
      const monthData = dataByMonth[key]

      const totalToDates = monthData.map((monthDataRow) => {
        return monthDataRow.dollarAdjustment
      })

      const sumOfTotals = Sum(totalToDates)

      data[MONTHS[parseInt(key)]] = sumOfTotals
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
  const labels = Utils.months({ count: 12 })

  if (chartRef.value) {
    chart = new Chart(
      chartRef.value,
      {
        type: 'line',
        data: {
          labels,
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
              text: 'Chart.js Line Chart'
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
