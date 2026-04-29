import { css, html, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { query, state } from 'lit/decorators.js'
import {
  currentUserIsAdmin,
  currentUserKidId,
  kids,
  kidsColors,
  selectedCurrency,
  selectedKidIndex,
} from '@/constants/signals.ts'
import { AdjustmentDto, AdjustmentType, Kid } from '@types'
import { dollarAdjustmentFromInterestPercentage, estimateInterestTotalOverTime } from '@/utils/adjustments.ts'
import { formatTotalForCurrency } from '@/utils/currency.ts'
import { log } from '@/utils/console.ts'
import { Db } from '@/utils/db.ts'
import { classMap } from 'lit/directives/class-map.js'
import { prepareKidForSave } from '@/utils/api-helper.ts'
import { KidUpdated } from '@/components/kid-editor.ts'
import { savingForGoalEstimate } from '@/utils/save-for.ts'
import { variableKids } from '@/assets/css/css.ts'
import { ServerRoute } from '@server/constants/constants.ts'
import { Currency, currencyDetails } from '@/constants/currencies.ts'

export class KmPageAdjustments extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = [
    variableKids,
    css`
      :host {
        container-name: page;
        container-type: inline-size;
        display: block;
      }
      .container {
        display: grid;
        grid-template-areas:
          'kidcard'
          'interestpreview'
          'savingfor'
          'adjustmentscontrols'
          'chart'
          'adjustmentstable';
        grid-template-columns: 1fr;
        gap: 20px 40px;

        &.admin {
          grid-template-areas:
            'kidcard'
            'adjustmentform'
            'interestpreview'
            'savingfor'
            'adjustmentscontrols'
            'chart'
            'adjustmentstable';
        }

        @container (width > 1000px) {
          & {
            grid-template-areas:
              'kidcard savingfor'
              'interestpreview savingfor'
              '. adjustmentscontrols'
              'chart chart'
              'adjustmentstable adjustmentstable';
            grid-template-columns: clamp(200px, 40vw, 600px) 1fr;

            &.admin {
              grid-template-areas:
                'kidcard savingfor'
                'adjustmentform savingfor'
                'interestpreview savingfor'
                '. adjustmentscontrols'
                'chart chart'
                'adjustmentstable adjustmentstable';
            }
          }
        }
        @container (width > 1700px) {
          & {
            grid-template-areas:
              'kidcard savingfor .'
              'interestpreview savingfor .'
              '. . adjustmentscontrols'
              'chart chart chart'
              'adjustmentstable adjustmentstable adjustmentstable';
            grid-template-columns: clamp(200px, 40vw, 600px) clamp(200px, 40vw, 600px) 1fr;

            &.admin {
              grid-template-areas:
                'kidcard savingfor .'
                'interestpreview savingfor .'
                'interestpreview adjustmentform .'
                '. . adjustmentscontrols'
                'chart chart chart'
                'adjustmentstable adjustmentstable adjustmentstable';
            }
          }
        }
      }
      .card {
        background-color: var(--kid-color-bg-light);
        background-image: var(--kid-color-bg-gradient);
        border: 2px solid var(--kid-color-border);
        border-radius: var(--border-radius-md);
        box-shadow: var(--box-shadow-element);
        color: var(--kid-color-favorite);
      }
      .kid-card {
        grid-area: kidcard;
      }
      .adjustment-form {
        grid-area: adjustmentform;
        display: grid;
        grid-template-columns: 1fr 1fr 40px 40px;
        grid-template-rows: 40px;
        gap: 5px;

        input {
          box-sizing: border-box;
          padding-inline: 0.5em;
          width: 100%;
          border-radius: var(--border-radius-sm);
          background-color: var(--kid-color-bg-light);
          border: 1px solid var(--kid-color-border);
          border-radius: var(--border-radius-sm);
          font-size: var(--font-size-lg);
          text-box: trim-both cap alphabetic;
          color: var(--kid-color-favorite);

          &[name='reason']::placeholder {
            opacity: 0.6;
          }
        }
        button {
          appearance: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          border-radius: var(--border-radius-sm);
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: var(--font-size-xl);
          color: white;
          cursor: pointer;
          transition: background-color var(--duration-hover) ease-out;

          span {
            display: block;
            padding-block-start: 0.1em;
            text-box: trim-both ex alphabetic;
          }

          &.add-button {
            background-color: var(--color-direction-add);

            &:hover {
              background-color: color-mix(var(--color-direction-add) 90%, black);
            }
          }
          &.subtract-button {
            background-color: var(--color-direction-subtract);

            &:hover {
              background-color: color-mix(var(--color-direction-subtract) 90%, black);
            }
          }
        }
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

          li {
            anchor-scope: --interst-value;
            list-style: none;
            padding-block: 1.5em;

            &:first-child {
              background-color: color-mix(var(--kid-color-bg-light) 90%, var(--kid-color-favorite));
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
              color: color-mix(currentColor 40%, transparent);
            }
          }

          @container (width > 500px) {
            & {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        }
      }
      .saving-for {
        grid-area: savingfor;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        align-self: end;
        justify-content: space-between;
        gap: 30px;
        padding: 30px;
        text-align: center;

        > div {
          display: grid;
          flex: 1 1 auto;

          .value {
            font-size: var(--font-size-lg);
            text-wrap: balance;
            color: var(--kid-color-favorite);

            label {
              font-size: var(--font-size-md);
            }

            &.emoji {
              font-size: var(--font-size-2xl);
            }
          }
          .label {
            font-size: var(--font-size-sm);
          }
        }
        form-input {
          input {
            font-size: var(--font-size-lg);
          }
        }
      }
      .adjustments-controls {
        grid-area: adjustmentscontrols;
        display: flex;
        flex-flow: row wrap;
        justify-content: end;
        gap: 13px 20px;

        .button-group {
          display: grid;
          grid-template-columns: max-content max-content max-content;
          grid-template-rows: 40px;
          border-radius: var(--border-radius-sm);

          button {
            appearance: none;
            padding-inline: 14px;
            background-color: var(--kid-color-bg-light);
            background-image: var(--kid-color-bg-gradient);
            border: 1px solid var(--kid-color-border);
            text-box: trim-both cap alphabetic;
            color: var(--kid-color-text-on-bg-light);
            cursor: pointer;

            &:first-child {
              border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
            }
            &:nth-child(2) {
              border-inline: none;
            }
            &:last-child {
              border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
            }
            &.active {
              background-color: var(--kid-color-favorite);
              background-image: none;
              color: var(--kid-color-text-on-favorite);
            }
          }
        }
      }
      .adjustments-table {
        grid-area: adjustmentstable;
        background-color: var(--kid-color-favorite);
        border-radius: var(--border-radius-md);
        color: var(--kid-color-text-on-favorite);

        @container (width > 599px) {
          & {
            border-collapse: collapse;

            th,
            td {
              padding: 20px;
              text-box: trim-both cap alphabetic;
            }
            th {
              text-align: start;
            }
            tbody {
              tr {
                border-block-start: 1px solid color-mix(var(--kid-color-text-on-favorite) 10%, transparent);
                transition: background-color var(--duration-hover) ease-out;

                &.direction-subtract {
                  background-color: color-mix(var(--kid-color-favorite) 80%, var(--color-direction-subtract));
                }
                &:hover {
                  background-color: color-mix(var(--kid-color-bg-light) 10%, transparent);
                }
              }
            }
            td {
              color: color-mix(var(--kid-color-text-on-favorite) 60%, var(--kid-color-favorite));

              /* Change */
              &:nth-child(1) {
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-semibold);
                color: var(--kid-color-text-on-favorite);
              }
              /* Reason */
              &:nth-child(2) {
                justify-self: end;

                &.dollar {
                  &.emoji {
                    font-size: var(--font-size-lg);
                  }
                }
              }
              /* Created Date */
              &:nth-child(3) {
                font-size: var(--font-size-sm);
              }
              /* Total to Date */
              &:nth-child(4) {
                justify-self: end;
                font-size: var(--font-size-sm);
              }
            }
          }
        }

        @container (width < 600px) {
          & {
            display: grid;
            grid-template-columns: repeat(2, auto);
            grid-template-rows: repeat(2, auto);
            width: 100%;

            thead {
              display: none;
            }
            tbody {
              display: contents;
            }
            tr {
              display: grid;
              grid-template-columns: subgrid;
              grid-template-rows: subgrid;
              grid-column: 1 / -1;
              grid-row: span 2;
              gap: 20px 10px;
              padding: 12px;

              &:not(:first-child) {
                border-block-start: 1px solid color-mix(var(--kid-color-text-on-favorite) 20%, transparent);
              }

              th,
              td {
                display: flex;
                text-box: trim-both cap alphabetic;
                color: color-mix(var(--kid-color-text-on-favorite) 60%, var(--kid-color-favorite));

                /* Change */
                &:nth-child(1) {
                  grid-column: 1 / 2;
                  grid-row: 1 / 2;
                  font-size: var(--font-size-xl);
                  font-weight: var(--font-weight-semibold);
                  color: var(--kid-color-text-on-favorite);
                }
                /* Reason */
                &:nth-child(2) {
                  grid-column: 2 / 3;
                  grid-row: 1 / 3;
                  justify-self: end;
                  font-size: var(--font-size-lg);

                  &.dollar {
                    &.emoji {
                      font-size: var(--font-size-xl);
                    }
                  }
                }
                /* Created Date */
                &:nth-child(3) {
                  grid-column: 1 / 2;
                  grid-row: 2 / 3;
                  font-size: var(--font-size-sm);
                }
                /* Total to Date */
                &:nth-child(4) {
                  grid-column: 2 / 3;
                  grid-row: 2 / 3;
                  justify-self: end;
                  font-size: var(--font-size-sm);
                }
              }
            }
          }
        }
      }
      .chart {
        grid-area: chart;
      }
    `,
  ]

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
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
   * TODO
   */
  @state()
  private _adjustmentsType: AdjustmentType | 'all' = 'all'

  /**
   * TODO
   */
  @state()
  private _isSaving = false

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
    if (this._dollarAdjustmentInput.value && this._reasonInput.value) {
      const dollarAdjustmentValue = parseFloat(this._dollarAdjustmentInput.value)
      this._isSaving = true

      const saved = await Db.postRequest(ServerRoute.CreateAdjustment, {
        adjustmentType: 'dollar',
        dollarAdjustment: direction === 'subtract' ? dollarAdjustmentValue * -1 : dollarAdjustmentValue,
        kidId,
        reason: this._reasonInput.value,
      } as AdjustmentDto)
      if (saved.success) {
        this.dispatchEvent(new AdjustmentCreated())
        this._dollarAdjustmentInput.value = ''
        this._reasonInput.value = ''
      }
      this._isSaving = false
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
  private _getInterestPreviews(days: number[], kid: Kid, currency: keyof typeof Currency) {
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
   * TODO
   */
  private async _onPopoverToggle(kidId: number, property: keyof Kid, existingValue: unknown) {
    const propertyInput = this.shadowRoot?.querySelector(`#${property}`) as HTMLInputElement
    if (propertyInput && kidId && !this._isSaving) {
      log('Checking settings', property)

      if (propertyInput.value !== (existingValue ?? '').toString()) {
        log('Saving settings for kid', kidId, property, propertyInput.value)
        try {
          this._isSaving = true
          const saved = await Db.postRequest(
            ServerRoute.CreateUpdateKid,
            prepareKidForSave(kidId, { [property]: propertyInput.value })
          )
          if (saved.success) {
            this.dispatchEvent(new KidUpdated())
          }
        } finally {
          this._isSaving = false
        }
      } else {
        log('Settings are the same. Not saving kid.')
      }
    }
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  disconnectedCallback() {
    super.disconnectedCallback()
    document.documentElement.removeAttribute('data-color-favorite')
  }
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)
      const kid = kidsData[selectedKidIndex.get()]
      const userCanEdit = currentUserIsAdmin.get() || currentUserKidId.get() === kid.id
      document.documentElement.setAttribute('data-color-favorite', kid.color)

      if (kid) {
        const kidTotalValue = kid.adjustments?.[0]?.totalToDate ?? 0

        const containerClasses = {
          admin: currentUserIsAdmin.get(),
          container: true,
          'kid-variables': true,
        }

        const kidCard = html`<div class="kid-card">
          <kid-total-card data-kid-index="${selectedKidIndex.get()}"></kid-total-card>
        </div>`

        const reasonPlaceholder = ['🤖', '🏀', '🎸', '📷', '🦩', '🏎️', '🦄']
        const adjustmentForm = currentUserIsAdmin.get()
          ? html`<form class="adjustment-form" autocomplete="off" @submit="${(e: SubmitEvent) => e.preventDefault()}">
              <input
                id="dollar-adjustment"
                name="dollar-adjustment"
                type="text"
                inputmode="decimal"
                placeholder="$0.00"
                @input="${this._forceNumberInput}"
              />
              <input
                type="text"
                id="reason"
                name="reason"
                name="reason"
                maxlength="10"
                placeholder="${reasonPlaceholder[Math.floor(Math.random() * reasonPlaceholder.length)]}"
              />
              <button class="add-button" @click="${() => this._createAdjustment('add', kid?.id ?? -1)}">
                <svg-icon name="add"></svg-icon>
              </button>
              <button class="subtract-button" @click="${() => this._createAdjustment('subtract', kid?.id ?? -1)}">
                <svg-icon name="subtract"></svg-icon>
              </button>
            </form>`
          : html`<div class="adjustment-form"><!-- Oh, hello non-admin. --></div>`

        const interestPreview = html`<div class="interest-preview card">
          <ul>
            <li>
              <span
                >${formatTotalForCurrency(
                  dollarAdjustmentFromInterestPercentage(kid.interest, kidTotalValue),
                  selectedCurrency.get()
                )}</span
              >
              <span>Daily</span>
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

        const savingForText = kid.savingFor ?? '💰'
        const savingForTextAsEmoji = savingForText.length <= 3
        const savingForEstimate = savingForGoalEstimate(
          kid.savingForValue,
          kidTotalValue,
          kid.interest,
          JSON.parse(kid.interestThresholds ?? '[]')
        )
        const savingFor = html`<div class="saving-for card">
          <div>
            <setting-chip
              data-unstyled
              ?data-disabled="${!userCanEdit}"
              @closed="${() => this._onPopoverToggle(kid.id, 'savingFor', kid?.savingFor)}"
            >
              <span slot="label"
                ><div class="value ${savingForTextAsEmoji ? 'emoji' : nothing}">${savingForText}</div></span
              >
              <form-input>
                <label for="savingFor">What are you saving for?</label>
                <input id="savingFor" name="savingFor" maxlength="25" type="text" value="${kid.savingFor}" />
              </form-input>
            </setting-chip>

            ${savingForTextAsEmoji ? nothing : html`<div class="label">Saving Goal</div>`}
          </div>
          <div>
            <setting-chip
              data-unstyled
              ?data-disabled="${!userCanEdit}"
              @closed="${() => this._onPopoverToggle(kid.id, 'savingForValue', kid?.savingForValue)}"
            >
              <span class="value" slot="label"
                >${formatTotalForCurrency(kid.savingForValue ?? 100, selectedCurrency.get())}</span
              >
              <form-input>
                <label for="savingForValue">How much will it cost?</label>
                <input id="savingForValue" name="savingForValue" type="text" value="${kid.savingForValue}" />
              </form-input>
            </setting-chip>
            <div class="label">Cost</div>
          </div>
          <div>
            <div class="value">${savingForEstimate === 500 ? '500+' : savingForEstimate}</div>
            <div class="label">Days</div>
          </div>
        </div>`

        const adjustmentsControls = html`
          <div class="adjustments-controls">
            <div class="button-group">
              <button
                class="${this._adjustmentsDaysLimit === 30 ? 'active' : ''}"
                @click="${() => (this._adjustmentsDaysLimit = 30)}"
              >
                30 Day
              </button>
              <button
                class="${this._adjustmentsDaysLimit === 60 ? 'active' : ''}"
                @click="${() => (this._adjustmentsDaysLimit = 60)}"
              >
                60 Day
              </button>
              <button
                class="${this._adjustmentsDaysLimit === -1 ? 'active' : ''}"
                @click="${() => (this._adjustmentsDaysLimit = -1)}"
              >
                1 Year
              </button>
            </div>
            <div class="button-group">
              <button
                class="${this._adjustmentsType === 'all' ? 'active' : ''}"
                @click="${() => (this._adjustmentsType = 'all')}"
              >
                All
              </button>
              <button
                class="${this._adjustmentsType === 'dollar' ? 'active' : ''}"
                @click="${() => (this._adjustmentsType = 'dollar')}"
              >
                ${currencyDetails[selectedCurrency.get()].symbol || '$'}
              </button>
              <button
                class="${this._adjustmentsType === 'interest' ? 'active' : ''}"
                @click="${() => (this._adjustmentsType = 'interest')}"
              >
                %
              </button>
            </div>
          </div>
        `

        let filteredAdjustmentsByDate = kid.adjustments ?? []
        if (this._adjustmentsDaysLimit > 0) {
          // Limit results based on `tableRowLimit`
          const today = new Date()
          const compareToDate = new Date(new Date().setDate(today.getDate() - this._adjustmentsDaysLimit))

          filteredAdjustmentsByDate = filteredAdjustmentsByDate.filter((adjustment) => {
            return new Date(adjustment.createdDate).getTime() > compareToDate.getTime()
          })
        }

        const filteredAdjustmentsByType =
          this._adjustmentsType === 'all'
            ? filteredAdjustmentsByDate
            : filteredAdjustmentsByDate.filter((adjustment) => {
                const isTypeInterest = adjustment.percentAdjustment > 0
                return (
                  (this._adjustmentsType === 'interest' && isTypeInterest) ||
                  (this._adjustmentsType === 'dollar' && !isTypeInterest)
                )
              })

        const chart = html`<chart-adjustments
          class="chart"
          data-adjustments="${JSON.stringify(filteredAdjustmentsByType)}"
          data-kid-color="${JSON.parse(kidsColors.get())[selectedKidIndex.get()]}"
        ></chart-adjustments>`

        const adjustmentRows = filteredAdjustmentsByType.map((adjustment) => {
          const isTypeInterest = adjustment.percentAdjustment > 0
          const reasonClasses = {
            dollar: !isTypeInterest,
            interest: isTypeInterest,
            emoji: adjustment.reason?.length <= 3,
          }

          return html`<tr class="direction-${adjustment.dollarAdjustment >= 0 ? 'add' : 'subtract'}">
            <td>${formatTotalForCurrency(adjustment.dollarAdjustment, selectedCurrency.get())}</td>
            <td class="${classMap(reasonClasses)}">
              ${adjustment.percentAdjustment > 0 ? `${adjustment.percentAdjustment}%` : (adjustment.reason ?? '')}
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
                <th>Change</th>
                <th>Reason</th>
                <th>Created Date</th>
                <th>Total to Date</th>
              </tr>
            </thead>
            <tbody>
              ${adjustmentRows}
            </tbody>
          </table>
        `

        return html`
          <article class="${classMap(containerClasses)}" style="--color-favorite: ${kid.color};">
            ${kidCard}${currentUserIsAdmin.get()
              ? adjustmentForm
              : nothing}${interestPreview}${savingFor}${adjustmentsControls}${chart}${adjustmentsTable}
          </article>
        `
      }
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
