import { css, html, LitElement } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'

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
      display: inline-block;
      padding: 5px;
      background-color: color-mix(in oklch, var(--kid-color-text-on-favorite) 3%, transparent);
      border: 1px solid var(--kid-color-text-on-favorite);
      border-radius: 4px;
      font-size: var(--font-size-xs);
      text-box: trim-both cap alphabetic;
      color: var(--kid-color-text-on-favorite);
      cursor: pointer;

      &:hover {
        border-color: color-mix(in oklch, var(--kid-color-text-on-favorite) 60%, transparent);
        color: color-mix(in oklch, var(--kid-color-text-on-favorite) 60%, transparent);
      }
    }
    #settings {
      position-anchor: --display;
      position: fixed;
      position-area: block-end;
      position-try-fallbacks: block-start;
      margin-block: 3px;
      padding: 14px;
      background-color: color-mix(
        in oklch,
        var(--kid-color-favorite) 70%,
        light-dark(rgb(0 0 0 / 0.2), rgb(255 255 255 / 0.2))
      );
      border: 1px solid var(--kid-color-favorite);
      border-radius: 16px;
      box-shadow: var(--kid-box-shadow-element);
      backdrop-filter: blur(13px);
      color: var(--kid-color-text-on-favorite);
    }
  `

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`
      <button class="display" popovertarget="settings"><slot name="label"></slot></button>
      <div id="settings" popover>
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'setting-chip': SettingChip
  }
}
