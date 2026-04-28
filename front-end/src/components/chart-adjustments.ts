import { css, html, LitElement, PropertyValues } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { Adjustment, Kid } from '@types'
import { kids, selectedCurrency } from '@/constants/signals.ts'
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
      min-height: 500px;
      color: var(--color-favorite);
    }
  `

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
  @query('#chart')
  _chartElement!: HTMLCanvasElement

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * TODO
   */
  @property({ attribute: 'data-adjustments', type: Array })
  adjustments: Adjustment[] = []

  /**
   * TODO
   */
  @property({ attribute: 'data-kid-index', type: Number })
  kidIndex = -1

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */
  /**
   * TODO
   */
  @state()
  private _chart: Chart<keyof ChartTypeRegistry, { x: string; y: number }[]> | undefined = undefined

  /**
   * TODO
   */
  @state()
  private _datasets: ChartDataset<keyof ChartTypeRegistry, { x: string; y: number }[]>[] = []

  /**
   * TODO
   */
  @state()
  private _kid: Kid | undefined = undefined

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private _formatDatasets() {
    log('Updating datasets')
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

    const rootStyle = getComputedStyle(this)
    const chartColor = rootStyle.getPropertyValue('color').trim()

    this._datasets = [
      {
        backgroundColor: chartColor,
        borderColor: chartColor,
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
   * TODO
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

      log('Chart', this._chart)
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

    if (changedProperties.has('kidIndex')) {
      // Set the ID of the kid based on loaded value.
      const kidsJson = kids.get()

      if (kidsJson) {
        const kidsData: Kid[] = JSON.parse(kidsJson)
        const kid = kidsData[this.kidIndex]

        if (kid) {
          this._kid = kid
        }
      }
    }

    this._setupChart()
  }

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties)

    if (changedProperties.has('adjustments')) {
      this._formatDatasets()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chart-adjustments': ChartAdjustments
  }
}
