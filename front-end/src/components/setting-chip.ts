import { css, html, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

export class SettingChip extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    .display {
      anchor-name: --display;
      appearance: none;
      background-color: transparent;
      border: none;
      transition: opacity var(--duration-hover) ease-out;
      cursor: pointer;

      &:not(.unstyled) {
        display: inline-block;
        padding: 5px;
        background-color: color-mix(
          var(--component-setting-chip-color, var(--kid-color-text-on-favorite, currentColor)) 3%,
          transparent
        );
        border: 1px solid var(--component-setting-chip-color, var(--kid-color-text-on-favorite, currentColor));
        border-radius: 4px;
        font-size: var(--font-size-xs);
        text-box: trim-both cap alphabetic;
        color: var(--component-setting-chip-color, var(--kid-color-text-on-favorite, currentColor));
      }
      &:hover {
        opacity: 0.5;
      }
    }
    #settings {
      position-anchor: --display;
      position: fixed;
      position-area: block-end;
      position-try-fallbacks: block-start;
      margin: 3px;
      padding: 18px;
      max-width: 300px;
      background-color: color-mix(var(--kid-color-bg-light, var(--component-setting-chip-popover-bg)) 70%, transparent);
      border: 1px solid var(--kid-color-favorite, var(--component-setting-chip-popover-color));
      border-radius: var(--border-radius-md);
      box-shadow: var(--kid-box-shadow-element, var(--box-shadow-element));
      backdrop-filter: blur(13px);
      color: var(--kid-color-text-on-bg-light, contrast-color(var(--component-setting-chip-popover-bg)));

      &::backdrop {
        backdrop-filter: saturate(90%) brightness(70%);
      }
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
  @property({ attribute: 'data-disabled', type: Boolean })
  disabled = false

  /**
   * TODO
   */
  @property({ attribute: 'data-unstyled', type: Boolean })
  unstyled = false

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const buttonClasses = {
      display: true,
      unstyled: this.unstyled,
    }

    if (this.disabled) {
      return html`<slot name="label"></slot>`
    }

    return html`
      <button class="${classMap(buttonClasses)}" popovertarget="settings"><slot name="label"></slot></button>
      <div
        id="settings"
        popover
        part="popover"
        @toggle="${(e: ToggleEvent) =>
          e.newState === 'closed' ? this.dispatchEvent(new SettingChipClosedEvent()) : nothing}"
      >
        <slot></slot>
      </div>
    `
  }
}

export class SettingChipClosedEvent extends Event {
  static readonly eventName = 'closed'

  constructor() {
    super(SettingChipClosedEvent.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'setting-chip': SettingChip
  }
}
