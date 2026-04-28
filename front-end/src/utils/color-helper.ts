import { KidColors } from '@types'

/**
 *
 * @param color
 */
export function getLightDarkColorsFromColor(color: string): KidColors {
  let light = color
  let dark = color

  // Create temporary element
  const spanElement = document.createElement('span')
  spanElement.style.color = color
  spanElement.style.colorScheme = 'light'

  // Add element to DOM
  document.body.appendChild(spanElement)

  // Get computed color for light mode
  const lightStyle = getComputedStyle(spanElement)
  light = lightStyle.getPropertyValue('color').trim() ?? color

  // Change color scheme to dark
  spanElement.style.colorScheme = 'dark'

  // Get computed color for dark mode
  const darkStyle = getComputedStyle(spanElement)
  dark = darkStyle.getPropertyValue('color').trim() ?? color

  // Remove temporary element
  document.body.removeChild(spanElement)

  return { light, dark }
}

export function getThemeColorForColorScheme(themeColors: KidColors) {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? themeColors.dark : themeColors.light
}
