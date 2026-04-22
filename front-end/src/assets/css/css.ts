import { css } from 'lit'

export const kidCardGrid = css`
  & {
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: calc(max-content - 20px) max-content max-content;
    gap: 10px 40px;

    @container (width > 1000px) {
      & {
        grid-template-columns: repeat(2, max-content 1fr max-content);
      }
    }
  }
`
