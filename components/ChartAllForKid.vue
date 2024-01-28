<script lang="ts" setup>
import Chart from 'chart.js/auto'
import type { Adjustment } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const props = defineProps({
  adjustments: {
    required: true,
    type: Object as PropType<Adjustment[]>
  },
  color: {
    default: 'rgb(31 210 44)',
    type: String
  }
})

const chartRef = ref()
let chart: Chart

const datasets = computed(() => {
  const data: {x: string; y: number}[] | {}[] = props.adjustments?.map((adjustment, index) => {
    if (index < 60) {
      return { x: new Date(adjustment.createdDate).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' }), y: adjustment.totalToDate }
    }
    return {}
  })

  return [{
    backgroundColor: props.color,
    borderColor: props.color,
    data: data.reverse(),
    label: 'Adjustments'
  }]
})

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(
      chartRef.value,
      {
        type: 'line',
        data: {
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
              text: '60 Most Recent'
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

watch(() => props.adjustments, () => {
  if (chart) {
    chart.data.datasets = datasets.value
    chart.update()
  }
})
</script>

<template>
  <div>
    <div class="w-full h-[200px] mx-auto md:h-[300px]">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>

<style scoped></style>
