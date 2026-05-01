import { css, html, LitElement, PropertyValues } from 'lit'
import { property, query } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { convertUsdToCurrency, formatTotalForCurrency } from '@/utils/currency.ts'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartDataset,
  ChartTypeRegistry,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Adjustment, Kid } from '@types'
import { kids, selectedCurrency } from '@/signals.ts'

/**
 * Displays a bar chart with a year’s worth of adjustments for each kid.
 *
 * The colors on the chart are pulled from each kid’s `color` setting.
 */
export class ChartAdjustmentsMonthly extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      display: block;
      width: 100cqw;
      height: clamp(200px, 50cqw, 500px);
      color: var(--color-favorite);
    }
  `

  /**
   * The instance of the chart. This can be used to update the chart’s settings and pass in new data.
   */
  private _chart: Chart<keyof ChartTypeRegistry> | undefined = undefined

  /**
   * An array of datasets to be displayed in the chart. Each object in the array can include settings, like the color of the line.
   */
  private _datasets: ChartDataset<keyof ChartTypeRegistry>[] = []

  /**
   * Formatted labels for the chart. They appear at the bottom of the chart and in the tooltip.
   */
  private _labels: string[] = []

  /**
   * A list of all months in a 12-month year.
   */
  private _months = [
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
    'December',
  ]

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * An array of JavaScript-computed colors for each kid. Each index of the array should match the index for each kid store in the `kids` signal.
   */
  @property({ attribute: 'data-kids-colors', type: Array })
  kidsColors: string[] = []

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
  /**
   * The canvas element that the chart is installed onto.
   */
  @query('#chart')
  _chartElement!: HTMLCanvasElement

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Takes the adjustments data and prepares it in the format required by the chart.
   *
   * Updates the chart with the new datasets.
   */
  private _formatDatasets() {
    const kidsData: Kid[] = JSON.parse(kids.get())
    this._datasets = kidsData.map((kid: Kid, index) => {
      const data: number[] = []
      const monthsData: Record<string, number> = {}

      // Group all data by month
      const dataByMonth: Partial<Record<string, Adjustment[]>> = kid.adjustments
        ? Object.groupBy(kid.adjustments, ({ createdDate }) => new Date(createdDate).getMonth())
        : []

      // Get totals from each month and key them to match labels
      Object.keys(dataByMonth).forEach((key) => {
        const monthData = dataByMonth[key] as Adjustment[]

        const lastTotalToDates = monthData[0].totalToDate

        const rowYear = new Date(monthData[0].createdDate)

        monthsData[`${this._months[parseInt(key)]} ${rowYear.getFullYear()}`] = convertUsdToCurrency(lastTotalToDates)
      })

      // Add data in order of labels
      this._labels.forEach((label) => {
        data.push(monthsData[label])
      })

      return {
        backgroundColor: this.kidsColors[index],
        borderColor: this.kidsColors[index],
        data,
        label: kid.name,
      }
    })

    if (this._chart) {
      this._chart.data.datasets = this._datasets
      this._chart.update()
    }
  }

  /**
   * Sets up the chart, provides it with data, and then mounts it to the chart element.
   */
  private _setupChart() {
    if (!this._chart && this._chartElement) {
      Chart.register(CategoryScale, LinearScale, BarController, BarElement, PointElement, Legend, Tooltip)

      this._formatDatasets()

      this._chart = new Chart(this._chartElement, {
        type: 'bar',
        data: {
          labels: this._labels,
          datasets: this._datasets,
        },
        options: {
          elements: {
            point: {
              hitRadius: 30,
            },
          },
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return formatTotalForCurrency(context.parsed.y ?? 0, selectedCurrency.get())
                },
              },
            },
          },
          responsive: true,
          scales: {
            x: {
              grid: {
                color: '#CECECE83',
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#CECECE83',
              },
            },
          },
        },
      })
    }
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  constructor() {
    super()

    // Set up labels by month
    const today = new Date()
    today.setDate(1)
    for (let i = 0; i <= 11; i++) {
      today.setMonth(today.getMonth() + 1)
      this._labels.push(`${this._months[today.getMonth()]} ${today.getFullYear() - 1}`)
    }
  }
  protected render() {
    return html`<canvas id="chart"></canvas>`
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties)

    this._setupChart()
  }

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties)

    if (changedProperties.has('kidsColors')) {
      this._formatDatasets()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chart-adjustments-monthly': ChartAdjustmentsMonthly
  }
}
