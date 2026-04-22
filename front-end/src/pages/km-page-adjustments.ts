import { css, html, LitElement, unsafeCSS } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { query, state } from 'lit/decorators.js'
import { kids, selectedCurrency, selectedKidIndex } from '@/constants/signals.ts'
import { AdjustmentDto, AdjustmentType, Currency, Kid, ServerRoute } from 'types'
import { dollarAdjustmentFromInterestPercentage, estimateInterestTotalOverTime } from '@/utils/adjustments.ts'
import { formatTotalForCurrency } from '@/utils/currency.ts'
import { log } from '@/utils/console.ts'
import { Db } from '@/utils/db.ts'
import { classMap } from 'lit/directives/class-map.js'
import variableKids from '@/assets/css/automated/variables-kid.css?inline' with { type: 'css' }

export class KmPageAdjustments extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      container-name: page;
      container-type: inline-size;
      display: block;
    }
    .container {
      ${unsafeCSS(variableKids)}
      display: grid;
      grid-template-areas:
        'kidcard'
        'adjustmentform'
        'interestpreview'
        'adjustmentstable';
      grid-template-columns: 1fr;
      gap: 40px;

      @container (width > 1000px) {
        & {
          grid-template-areas:
            'kidcard .'
            'adjustmentform .'
            'interestpreview .'
            'adjustmentstable adjustmentstable';
          grid-template-columns: clamp(200px, 40vw, 600px) 1fr;
        }
      }
    }
    .kid-card {
      grid-area: kidcard;
    }
    .adjustment-form {
      grid-area: adjustmentform;
    }
    .interest-preview {
      container-name: interest-preview;
      container-type: inline-size;
      grid-area: interestpreview;

      ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        margin: 0;
        padding: 0;
        background-color: var(--kid-color-bg-light);
        background-image: var(--kid-color-bg-gradient);
        border: 2px solid var(--kid-color-border);
        border-radius: var(--border-radius-md);
        box-shadow: var(--box-shadow-element);
        color: var(--kid-color-favorite);

        li {
          anchor-scope: --interst-value;
          list-style: none;
          padding-block: 1.5em;

          &:first-child {
            background-color: color-mix(in oklch, var(--kid-color-bg-light) 90%, var(--kid-color-favorite));
            border-radius: var(--border-radius-md) 0 var(--border-radius-md) 0;

            span:first-child {
              font-weight: var(--font-weight-semibold);
            }

            @container (width > 500px) {
              & {
                border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
              }
            }
          }
          span:first-child {
            display: block;
            text-align: center;
            font-size: var(--font-size-lg);
          }
          span:nth-child(2) {
            anchor-name: --interst-value;
            display: block;
            text-align: center;
            font-size: var(--font-size-sm);
          }
          span:nth-child(3) {
            position: absolute;
            position-area: center block-end;
            position-anchor: --interst-value;
            font-size: var(--font-size-xs);
            color: color-mix(in oklch, currentColor 40%, transparent);
          }
        }

        @container (width > 500px) {
          & {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      }
    }
    .adjustments-table {
      grid-area: adjustmentstable;
    }
  `

  @query('#dollar-adjustment')
  _dollarAdjustmentInput!: HTMLInputElement

  @query('#reason')
  _reasonInput!: HTMLInputElement

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */
  /**
   * TODO
   */
  @state()
  private _adjustmentsDaysLimit = 30

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _createAdjustment(direction: 'add' | 'subtract', kidId: number) {
    log('Creating adjustment', direction, this._dollarAdjustmentInput.value, this._reasonInput.value)
    if (this._dollarAdjustmentInput.value) {
      const dollarAdjustmentValue = parseFloat(this._dollarAdjustmentInput.value)

      const saved = await Db.postRequest(ServerRoute.CreateAdjustment, {
        adjustmentType: AdjustmentType.Dollar,
        dollarAdjustment: direction === 'subtract' ? dollarAdjustmentValue * -1 : dollarAdjustmentValue,
        kidId,
        reason: this._reasonInput.value ?? undefined,
      } as AdjustmentDto)
      if (saved.success) {
        this.dispatchEvent(new AdjustmentCreated())
      }
    }
  }

  /**
   * TODO
   */
  private _forceNumberInput(e: Event) {
    const input = e.target as HTMLInputElement
    const value = input.value.replace(/[^0-9.]/g, '')
    input.value = value
  }

  /**
   * TODO
   */
  private _getInterestPreviews(days: number[], kid: Kid, currency: Currency) {
    return days.map((day) => {
      const labels: Record<number, string> = {
        7: '1 week',
        365: '1 year',
      }
      const totalValue = estimateInterestTotalOverTime(
        day,
        kid.interest,
        kid.adjustments?.[0]?.totalToDate ?? 0,
        kid.interestThresholds ? JSON.parse(kid.interestThresholds) : undefined
      )
      const total = formatTotalForCurrency(totalValue, currency)
      const differenceValue = totalValue - (kid.adjustments?.[0]?.totalToDate ?? 0)
      const difference = formatTotalForCurrency(differenceValue, currency)
      const direction = differenceValue < 0 ? '-' : '+'
      return {
        day,
        difference,
        direction,
        label: labels[day] ?? `${day} days`,
        total,
      }
    })
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)
      const kid = kidsData[selectedKidIndex.get()]
      const kidTotalValue = kid.adjustments?.[0]?.totalToDate ?? 0

      const containerClasses = {
        container: true,
      }

      const kidCard = html`<div class="kid-card">
        <kid-total-card data-kid-index="${selectedKidIndex.get()}"></kid-total-card>
      </div>`

      const reasonPlaceholder = ['🤖', '🏀', '🎸', '📷', '🦩', '🏎️', '🦄']
      const adjustmentForm = html`<form
        class="adjustment-form"
        autocomplete="off"
        @submit="${(e: SubmitEvent) => e.preventDefault()}"
      >
        <input
          id="dollar-adjustment"
          name="dollar-adjustment"
          type="text"
          inputmode="decimal"
          placeholder="${formatTotalForCurrency(0, selectedCurrency.get())}"
          @input="${this._forceNumberInput}"
        />
        <input
          type="text"
          id="reason"
          name="reason"
          placeholder="${reasonPlaceholder[Math.floor(Math.random() * reasonPlaceholder.length)]}"
        />
        <button class="add-button" @click="${() => this._createAdjustment('add', kid.id)}">+</button>
        <button class="subtract-button" @click="${() => this._createAdjustment('subtract', kid.id)}">-</button>
      </form>`

      const interestPreview = html`<div class="interest-preview">
        <ul>
          <li>
            <span
              >${formatTotalForCurrency(
                dollarAdjustmentFromInterestPercentage(kid.interest, kidTotalValue),
                selectedCurrency.get()
              )}</span
            >
            <span>Per day</span>
          </li>
          ${this._getInterestPreviews([7, 30, 365], kid, selectedCurrency.get()).map(
            (preview) =>
              html`<li>
                <span>${preview.total}</span><span>${preview.label}</span
                ><span>${preview.direction + preview.difference}</span>
              </li>`
          )}
        </ul>
      </div>`

      let filteredAdjustments = kid.adjustments ?? []
      if (this._adjustmentsDaysLimit > 0) {
        // Limit results based on `tableRowLimit`
        const today = new Date()
        const compareToDate = new Date(new Date().setDate(today.getDate() - this._adjustmentsDaysLimit))

        filteredAdjustments = filteredAdjustments.filter((adjustment) => {
          return new Date(adjustment.createdDate).getTime() > compareToDate.getTime()
        })
      }

      const adjustmentRows = filteredAdjustments.map((adjustment) => {
        return html`<tr>
          <td>${formatTotalForCurrency(adjustment.dollarAdjustment, selectedCurrency.get())}</td>
          <td>
            ${adjustment.percentAdjustment > 0
              ? html`Interest <span>${adjustment.percentAdjustment}</span>`
              : (adjustment.reason ?? '')}
          </td>
          <td>
            ${new Date(adjustment.createdDate).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </td>
          <td>${formatTotalForCurrency(adjustment.totalToDate, selectedCurrency.get())}</td>
        </tr>`
      })

      const adjustmentsTable = html`
        <table class="adjustments-table">
          <thead>
            <tr>
              <td>Change</td>
              <td>Reason</td>
              <td>Created Date</td>
              <td>Total to Date</td>
            </tr>
          </thead>
          <tbody>
            ${adjustmentRows}
          </tbody>
        </table>
      `

      return html`
        <article class="${classMap(containerClasses)}" style="--color-favorite: ${kid.color};">
          ${kidCard}${adjustmentForm}${interestPreview}${adjustmentsTable}
        </article>
      `
    }
  }
}

/**
 * Event fired when kid is saved.
 */
export class AdjustmentCreated extends Event {
  static readonly eventName = 'adjustment-created'

  constructor() {
    super(AdjustmentCreated.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-adjustments': KmPageAdjustments
  }
}
