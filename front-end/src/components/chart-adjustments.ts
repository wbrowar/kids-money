import { css, html, LitElement, PropertyValues } from 'lit'
import { property, query } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { Adjustment } from '@types'
import { selectedCurrency } from '@/constants/signals.ts'
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
      height: clamp(90px, 50cqw, 500px);
      color: var(--color-favorite);
    }
  `

  /**
   * TODO
   */
  private _chart: Chart<keyof ChartTypeRegistry, { x: string; y: number }[]> | undefined = undefined

  /**
   * TODO
   */
  private _datasets: ChartDataset<keyof ChartTypeRegistry, { x: string; y: number }[]>[] = []

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
  @property({ attribute: 'data-kid-color' })
  kidColor = ''

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
  @query('#chart')
  _chartElement!: HTMLCanvasElement

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
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

    log('thing chnaged', this.kidColor)

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
