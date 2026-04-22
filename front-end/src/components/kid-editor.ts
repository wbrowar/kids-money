import { css, html, LitElement, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid, ServerRoute } from 'types'
import { log } from '@/utils/console.ts'
import { prepareKidForSave } from '@/utils/kid-helper.ts'
import { Db } from '@/utils/db.ts'

export class KidEditor extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    img {
      display: block;
      max-width: 100%;
      border-radius: 50%;
    }
    .color-preview {
      aspect-ratio: 1;
      width: 100px;
      clip-path: circle(50%);
      background-image:
        linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 20px 20px;
      background-position:
        0 0,
        0 10px,
        10px -10px,
        -10px 0px;

      & > span {
        display: block;
        width: 100%;
        height: 100%;
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
  @property({ attribute: 'data-kid', type: Object })
  kid: Kid | undefined = undefined

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
  private async _onPopoverToggle(e: ToggleEvent, property: keyof Kid) {
    const propertyInput = this.shadowRoot?.querySelector(`#${property}`) as HTMLInputElement
    if (e.newState === 'closed' && this.kid && propertyInput && !this._isSaving) {
      log('Checking settings', property)

      if ((this.kid[property] ?? '').toString() !== propertyInput.value) {
        log('Saving settings for kid', property, propertyInput.value)
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

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`
      ${this.kid
        ? html`
            <form @submit="${(e: SubmitEvent) => e.preventDefault()}">
              <div class="editor-field">
                <h3>Name</h3>
                <button popovertarget="editor-name" type="button">${this.kid.name}</button>
                <div id="editor-name" popover @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'name')}">
                  <form-input>
                    <label for="name">Name</label>
                    <input id="name" name="name" type="text" />
                  </form-input>
                  <p>The name of the kid, however you want to spell it. You can even use emoji 🎉</p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Photo</h3>
                <button popovertarget="editor-photoUrl" type="button">
                  ${this.kid.photoUrl
                    ? html`<img
                        src="${this.kid.photoUrl}"
                        alt="Avatar image for selected kid"
                        width="150"
                        height="150"
                      />`
                    : 'Not set'}
                </button>
                <div
                  id="editor-photoUrl"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'photoUrl')}"
                >
                  <form-input>
                    <label for="photoUrl">Photo URL</label>
                    <input id="photoUrl" name="photoUrl" type="text" />
                  </form-input>
                  <p>
                    The URL of a square-ish photo to help your kid identify themselves. This should be a URL to a JPG,
                    PNG, SVG, or GIF that is hosted somewhere with a public URL.
                  </p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Color</h3>
                <button popovertarget="editor-color" type="button">
                  <div class="color-preview"><span style="background-color: ${this.kid.color};"></span></div>
                </button>
                <div
                  id="editor-color"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'color')}"
                >
                  <form-input>
                    <label for="color">Favorite Color</label>
                    <input id="color" name="color" type="text" />
                  </form-input>
                  <p>
                    Whatever color you would like! Maybe the kid’s favorite color? Any CSS color value will work. You
                    can even use named CSS colors, like <span style="color: green;">green</span> or
                    <span style="color: rebeccapurple;">rebeccapurple</span>. If you want different colors for
                    <strong>light mode</strong> and <strong>dark mode</strong>, you can use the
                    <strong>light-dark()</strong> CSS function.
                  </p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Interest</h3>
                <button popovertarget="editor-interest" type="button">${this.kid.interest}</button>
                <div
                  id="editor-interest"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'interest')}"
                >
                  <form-input>
                    <label for="interest">Default Interest</label>
                    <input id="interest" name="interest" type="text" />
                  </form-input>
                  <p>
                    A percentage of the current total that is added whenever an <strong>Add Interest</strong> command is
                    run.
                  </p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Interest Thresholds</h3>
                <button popovertarget="editor-interestThresholds" type="button">
                  ${this.kid.interestThresholds ?? 'Not set'}
                </button>
                <div
                  id="editor-interestThresholds"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'interestThresholds')}"
                >
                  <form-input>
                    <label for="interestThresholds">Interest Thresholds</label>
                    <input id="interestThresholds" name="interestThresholds" type="text" />
                  </form-input>
                  <p>dddd</p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Saving Goal</h3>
                <button popovertarget="editor-savingFor" type="button">${this.kid.savingFor ?? 'Not set'}</button>
                <div
                  id="editor-savingFor"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'savingFor')}"
                >
                  <form-input>
                    <label for="savingFor">Saving For</label>
                    <input id="savingFor" name="savingFor" maxlength="25" type="text" />
                  </form-input>
                  <p>dddd</p>
                </div>
              </div>

              <div class="editor-field">
                <h3>Saving Goal Value</h3>
                <button popovertarget="editor-savingForValue" type="button">
                  ${this.kid.savingForValue ?? 'Not set'}
                </button>
                <div
                  id="editor-savingForValue"
                  popover
                  @toggle="${(event: ToggleEvent) => this._onPopoverToggle(event, 'savingForValue')}"
                >
                  <form-input>
                    <label for="savingForValue">Saving For Value</label>
                    <input id="savingForValue" name="savingForValue" type="text" />
                  </form-input>
                  <p>dddd</p>
                </div>
              </div>
            </form>
          `
        : nothing}
    `
  }

  protected willUpdate(changedProperties: Map<string, any>) {
    if (changedProperties.has('kid')) {
      // Set the ID of the kid based on loaded value.
      if (this.kid?.id && this._kidId < 0) {
        this._kidId = this.kid.id
      }
    }
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('kid')) {
      // Convert non-string values to strings for the form inputs.
      const properties: (keyof Kid)[] = [
        'color',
        'interest',
        'interestThresholds',
        'name',
        'photoUrl',
        'savingFor',
        'savingForValue',
      ]
      properties.forEach((property: keyof Kid) => {
        const propertyInput = this.shadowRoot?.querySelector(`#${property}`) as HTMLInputElement
        if (this.kid && propertyInput) {
          propertyInput.value = this.kid[property]?.toString() ?? ''
        }
      })
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
