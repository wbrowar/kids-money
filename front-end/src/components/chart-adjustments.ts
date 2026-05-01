import { css, html, LitElement, PropertyValues } from 'lit'
import { property, query } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { Adjustment } from '@types'
import { selectedCurrency } from '@/signals.ts'
import {
  CategoryScale,
  Chart,
  ChartDataset,
  ChartTypeRegistry,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { convertUsdToCurrency, formatTotalForCurrency } from '@/utils/currency.ts'
import { log } from '@/utils/console.ts'

/**
 * Displays a set of adjustments in a line chart.
 */
export class ChartAdjustments extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      display: block;
      width: 100cqw;
      height: clamp(90px, 50cqw, 500px);
      color: var(--color-favorite);
    }
  `

  /**
   * The instance of the chart. This can be used to update the chart’s settings and pass in new data.
   */
  private _chart: Chart<keyof ChartTypeRegistry, { x: string; y: number }[]> | undefined = undefined

  /**
   * An array of datasets to be displayed in the chart. Each object in the array can include settings, like the color of the line.
   */
  private _datasets: ChartDataset<keyof ChartTypeRegistry, { x: string; y: number }[]>[] = []

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * The adjustments data to be passed into the dataset.
   */
  @property({ attribute: 'data-adjustments', type: Array })
  adjustments: Adjustment[] = []

  /**
   * The JavaScript-computed color extracted from the kid’s color setting.
   */
  @property({ attribute: 'data-kid-color' })
  kidColor = ''

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
    const data = this.adjustments.map((adjustment) => {
      return {
        x: new Date(adjustment.createdDate).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        y: convertUsdToCurrency(adjustment.totalToDate),
      }
    })

    this._datasets = [
      {
        backgroundColor: this.kidColor,
        borderColor: this.kidColor,
        data: data.reverse(),
        label: 'Adjustments',
        tension: 0.1,
      },
    ]

    if (this._chart) {
      this._chart.data.datasets = this._datasets
      this._chart.update()
    }
  }

  /**
   * Sets up the chart, provides it with data, and then mounts it to the chart element.
   */
  private _setupChart() {
    log('Setting up chart', this._datasets)
    if (!this._chart && this._chartElement) {
      Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Legend, Tooltip)
      this._chart = new Chart(this._chartElement, {
        type: 'line',
        data: {
          datasets: this._datasets ?? [],
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
  protected render() {
    return html`<canvas id="chart"></canvas>`
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties)

    this._setupChart()
  }

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties)

    if (changedProperties.has('adjustments') || changedProperties.has('kidColor')) {
      this._formatDatasets()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chart-adjustments': ChartAdjustments
  }
}
