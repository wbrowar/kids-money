import { css, unsafeCSS } from 'lit'
import variableKidsCss from '@/assets/css/automated/variables-kid.css?raw' with { type: 'css' }

/**
 * CSS variables that are placed on the class selector, `.kid-variables`. These variables apply `color-mix` to
 */
export const variableKids = css`
  ${unsafeCSS(variableKidsCss)}
`
