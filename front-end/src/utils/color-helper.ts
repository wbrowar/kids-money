import { KidColors } from '@types'

/**
 * Returns the light and dark colors that are parsed from a CSS color value.
 *
 * @param {string} color A CSS color value. Can contain CSS functions, such as `color-mix()` and `light-dark()`.
 * @return {KidColors} An object containing the light and dark versions of the color.
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

/**
 * Returns the output of `getLightDarkColorsFromColor()` and selects the correct value based on if the browser is in `light` or `dark` mode.
 *
 * @param {KidColors} themeColors The light and dark colors to choose from.
 * @return {string} The color corresponding to the current color scheme.
 */
export function getThemeColorForColorScheme(themeColors: KidColors) {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? themeColors.dark : themeColors.light
}
