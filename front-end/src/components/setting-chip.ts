import { css, html, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

/**
 * Provides a popover that appears when the slotted label is clicked. An event is fired when the popover closes, so an action can take place.
 */
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
    [popover] {
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
      transition:
        display var(--duration-overlay) ease-out allow-discrete,
        overlay var(--duration-overlay) ease-out allow-discrete,
        opacity var(--duration-overlay) ease-out;

      &::backdrop {
        backdrop-filter: saturate(90%) brightness(70%);
        opacity: 0;
        transition:
          display var(--duration-overlay) ease-out allow-discrete,
          overlay var(--duration-overlay) ease-out allow-discrete,
          opacity var(--duration-overlay) ease-out;
      }
      &:popover-open::backdrop {
        opacity: 1;

        @starting-style {
          opacity: 0;
        }
      }
    }
  `

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * Disabled the popover. The label is still displayed on the page.
   */
  @property({ attribute: 'data-disabled', type: Boolean })
  disabled = false

  /**
   * Disables the default styles around the label.
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
          e.newState === 'closed' && !this.disabled ? this.dispatchEvent(new SettingChipClosedEvent()) : nothing}"
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
