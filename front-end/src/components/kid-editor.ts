import { css, html, LitElement, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid } from '@types'
import { log } from '@/utils/console.ts'
import { kids } from '@/constants/signals.ts'
import { Db } from '@/utils/db.ts'
import { prepareKidForSave } from '@/utils/api-helper.ts'
import { variableKids } from '@/assets/css/css.ts'
import { ServerRoute } from '@server/constants/constants.ts'

export class KidEditor extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      display: block;
    }
    :heading {
      color: var(--color-text-header);
    }
    img {
      display: block;
      max-width: 100%;
      border-radius: 50%;
    }
    form {
      ${variableKids}
      --component-setting-chip-color: var(--kid-color-favorite);
      display: grid;
      grid-template-columns: repeat(2, max-content);
      gap: 15px;
      padding: 25px;
      background-color: var(--kid-color-bg-light);
      background-image: var(--kid-color-bg-gradient);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--box-shadow-card);
      color: var(--kid-color-text-on-bg-light);

      .editor-field {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        align-items: center;

        h3 {
          margin: 0;
          text-align: end;
        }
        setting-chip {
          &::part(popover) {
            max-width: 300px;
          }

          input,
          button {
            box-sizing: border-box;
            padding-inline: 10px;
            width: 300px;
            height: 30px;
          }
          p {
            text-wrap: pretty;
          }
        }
      }
    }
    .color-preview {
      aspect-ratio: 5 / 3;
      width: 100px;
      background-image:
        linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 20px 20px;
      background-position:
        0 0,
        0 10px,
        10px -10px,
        -10px 0px;
      border-radius: var(--border-radius-md);
      color: contrast-color(var(--color-favorite));

      [slot='label']:has(&) {
        display: flex;
        flex-flow: row nowrap;
        gap: 5px;
      }
      &:nth-child(1) {
        color-scheme: light;
      }
      &:nth-child(2) {
        color-scheme: dark;
      }
      & > span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: var(--font-size-md);
        border-radius: var(--border-radius-md);
      }
    }
    .editor-field {
      anchor-scope: --editor-button;
    }
    button[popovertarget] {
      anchor-name: --editor-button;
      display: inline-block;
      cursor: pointer;
    }
    [popover] {
      position-anchor: --editor-button;
      position: fixed;
      position-area: block-end;
      position-try-fallbacks: block-start;
      background-color: var(--color-fpo);
    }
  `

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
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
  private _isSaving = false

  /**
   * TODO
   */
  @state()
  private _kidId = -1

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _onPopoverToggle(property: keyof Kid, existingValue: unknown) {
    const propertyInput = this.shadowRoot?.querySelector(`#${property}`) as HTMLInputElement
    if (propertyInput && !this._isSaving) {
      log('Checking settings', property)

      if (propertyInput.value !== (existingValue ?? '').toString()) {
        log('Saving settings for kid', this._kidId, property, propertyInput.value)
        try {
          this._isSaving = true
          const saved = await Db.postRequest(
            ServerRoute.CreateUpdateKid,
            prepareKidForSave(this._kidId, { [property]: propertyInput.value })
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

  private async _removeKid() {
    if (!this._isSaving) {
      try {
        this._isSaving = true
        const saved = await Db.postRequest(ServerRoute.RemoveKid, { id: this._kidId })
        if (saved.success) {
          this.dispatchEvent(new KidUpdated())
        }
      } finally {
        this._isSaving = false
      }
    }
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
      const kid = kidsData[this.kidIndex]

      if (kid) {
        const colorHasDarkMode = kid.color.includes('light-dark')

        return html`
          <form style="--color-favorite: ${kid.color}" @submit="${(e: SubmitEvent) => e.preventDefault()}">
            <div class="editor-field">
              <h3>Name</h3>

              <setting-chip @closed="${() => this._onPopoverToggle('name', kid.name)}">
                <span slot="label">${kid.name || 'Not set'}</span>
                <form-input>
                  <label for="name">Name</label>
                  <input id="name" name="name" type="text" value="${kid.name}" />
                </form-input>
                <p>The name of the kid, however you want to spell it. You can even use emoji 🎉</p>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Photo</h3>

              <setting-chip data-unstyled @closed="${() => this._onPopoverToggle('photoUrl', kid.photoUrl)}">
                <span slot="label"
                  >${kid.photoUrl
                    ? html`<img src="${kid.photoUrl}" alt="Avatar image for selected kid" width="150" height="150" />`
                    : 'Not set'}</span
                >
                <form-input>
                  <label for="photoUrl">Photo URL</label>
                  <input id="photoUrl" name="photoUrl" type="text" value="${kid.photoUrl}" />
                </form-input>
                <p>
                  The URL of a square-ish photo to help your kid identify themselves. This should be a URL to a JPG,
                  PNG, SVG, or GIF that is hosted somewhere with a public URL.
                </p>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Color</h3>

              <setting-chip data-unstyled @closed="${() => this._onPopoverToggle('color', kid.color)}">
                <span slot="label"
                  ><div class="color-preview">
                    <span style="background-color: ${kid.color};">${colorHasDarkMode ? 'Light' : 'Text'}</span>
                  </div>
                  ${colorHasDarkMode
                    ? html`<div class="color-preview">
                        <span style="background-color: ${kid.color};">Dark</span>
                      </div>`
                    : nothing}</span
                >
                <form-input>
                  <label for="color">Favorite Color</label>
                  <input id="color" name="color" type="text" value="${kid.color}" />
                </form-input>
                <p>
                  Whatever color you would like! Maybe the kid’s favorite color? Any CSS color value will work. You can
                  even use named CSS colors, like <span style="color: green;">green</span> or
                  <span style="color: rebeccapurple;">rebeccapurple</span>. If you want different colors for
                  <strong>light mode</strong> and <strong>dark mode</strong>, you can use the
                  <strong>light-dark()</strong> CSS function.
                </p>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Interest</h3>

              <setting-chip @closed="${() => this._onPopoverToggle('interest', kid.interest)}">
                <span slot="label">${kid.interest}</span>
                <form-input>
                  <label for="interest">Default Interest</label>
                  <input id="interest" name="interest" type="text" value="${kid.interest}" />
                </form-input>
                <p>
                  A percentage of the current total that is added whenever an <strong>Add Interest</strong> command is
                  run.
                </p>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Interest Thresholds</h3>

              <setting-chip @closed="${() => this._onPopoverToggle('interestThresholds', kid.interestThresholds)}">
                <span slot="label">${kid.interestThresholds || 'Not set'}</span>
                <form-input>
                  <label for="interestThresholds">Interest Thresholds</label>
                  <input
                    id="interestThresholds"
                    name="interestThresholds"
                    type="text"
                    value="${kid.interestThresholds}"
                  />
                </form-input>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Saving Goal</h3>

              <setting-chip @closed="${() => this._onPopoverToggle('savingFor', kid.savingFor)}">
                <span slot="label">${kid.savingFor || 'Not set'}</span>
                <form-input>
                  <label for="savingFor">Saving For</label>
                  <input id="savingFor" name="savingFor" maxlength="25" type="text" value="${kid.savingFor}" />
                </form-input>
              </setting-chip>
            </div>

            <div class="editor-field">
              <h3>Saving Goal Value</h3>

              <setting-chip @closed="${() => this._onPopoverToggle('savingForValue', kid.savingForValue)}">
                <span slot="label">${kid.savingForValue ?? 'Not set'}</span>
                <form-input>
                  <label for="savingForValue">Saving For Value</label>
                  <input id="savingForValue" name="savingForValue" type="text" value="${kid.savingForValue}" />
                </form-input>
              </setting-chip>
            </div>

            <div class="editor-field" style="--kid-color-favorite: var(--color-alert-error);">
              <h3>Remove Kid</h3>
              <setting-chip>
                <span slot="label">Remove Kid</span>
                <div>
                  <p>Are you sure you want to remove this kid and all of the associated data?</p>
                  <button @click="${this._removeKid}">REMOVE</button>
                </div>
              </setting-chip>
            </div>
          </form>
        `
      }
    }
  }

  protected willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('kidIndex')) {
      // Set the ID of the kid based on loaded value.
      const kidsJson = kids.get()

      if (kidsJson) {
        const kidsData: Kid[] = JSON.parse(kidsJson)
        const kid = kidsData[this.kidIndex]

        if (kid) {
          this._kidId = kid.id
        }
      }
    }
  }
}

/**
 * Event fired when kid is saved.
 */
export class KidUpdated extends Event {
  static readonly eventName = 'kid-updated'

  constructor() {
    super(KidUpdated.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kid-editor': KidEditor
  }
}
