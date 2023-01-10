<script lang="ts" setup>
import Chart from 'chart.js/auto'
import GroupBy from 'lodash-es/groupBy'
import { PropType } from 'vue'
import { Adjustment, Kid } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const props = defineProps({
  kids: {
    required: true,
    type: Object as PropType<Kid[]>
  }
})

const { favoriteColor } = useStringFormatter()

const chartRef = ref()
let chart: Chart

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
    const data: number[] = []
    const monthsData: Record<string, number> = {}

    // Group all data by month
    const dataByMonth = GroupBy(kid.adjustments, ({ createdDate }: {createdDate: Date}) => new Date(createdDate).getMonth())

    // Get totals from each month and key them to match labels
    Object.keys(dataByMonth).forEach((key) => {
      const monthData = dataByMonth[key] as Adjustment[]

      const lastTotalToDates = monthData[0].totalToDate

      const rowYear = new Date(monthData[0].createdDate)

      monthsData[`${MONTHS[parseInt(key)]} ${rowYear.getFullYear()}`] = lastTotalToDates
    })

    // Add data in order of labels
    labels.value.forEach((label) => {
      data.push(monthsData[label] ?? 0)
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
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Totals per Month'
            }
          },
          responsive: true,
          scales: {
            x: {
              grid: {
                color: '#CECECE83'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#CECECE83'
              },
              ticks: {
                padding: 20
              }
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
    <div class="w-full max-w-[60rem] h-[400px] mx-auto md:h-[500px]">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>

<style scoped></style>
