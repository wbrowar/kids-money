import { css, unsafeCSS } from 'lit'
import variableKidsCss from '@/assets/css/automated/variables-kid.css?raw' with { type: 'css' }

export const variableKids = css`
  ${unsafeCSS(variableKidsCss)}
`
