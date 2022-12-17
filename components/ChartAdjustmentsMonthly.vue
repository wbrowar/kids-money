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

const chart = ref()

onMounted(() => {
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

  const datasets = props.kids?.map((kid) => {
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

  log('the data', datasets)

  const labels = Utils.months({ count: 12 })

  if (chart.value) {
    new Chart(
      chart.value,
      {
        type: 'line',
        data: {
          labels,
          datasets
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

</script>

<template>
  <div>
    <div class="w-full max-w-[60rem] mx-auto">
      <canvas ref="chart" />
    </div>
  </div>
</template>

<style scoped></style>
