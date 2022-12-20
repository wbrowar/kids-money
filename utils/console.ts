/*
 * Log an object and show all of its properties and their values in the console.
 *
 * @param args Any amount of items to log. If an argument is just a string, it will be logged via console.log().
 *
 * ```
 * import { dir } from 'utils/console'
 *
 * dir('My object', myObject)
 * ```
 */
export function dir (...args: any[]) {
  logger('dir', args)
}

/*
 * Displays an error in the console along with a stack trace to help debug the origin of the error.
 *
 * @param args Any amount of items to log.
 *
 * ```
 * import { error } from 'utils/console'
 *
 * error('An error occured here.')
 * ```
 */
export function error (...args: any[]) {
  logger('error', args)
}

/*
 * Logs anything (string, number, array, object, etc...) to the console.
 *
 * @param args Any amount of items to log.
 *
 * ```
 * import { log } from 'utils/console'
 *
 * log('These are things I’d like to log', itemOne, itemTwo)
 * ```
 */
export function log (...args: any[]) {
  logger('log', args)
}
export function table (...args: any[]) {
  logger('log', args)
}
export function warn (...args: any[]) {
  logger('warn', args)
}
function logger (type: string, args: any[]) {
  const spirit = '💰'

  // TODO figure out how to check for `nuxt.config.dev`
  // if (appConfig.dev) {
  for (let i = 0; i < args.length; i++) {
    const spacer = i > 0 ? '◉ ' : ''
    switch (type) {
      case 'dir':
        if (typeof args[i] === 'string') {
          // eslint-disable-next-line no-console
          console.dir(spacer + spirit + ' ' + args[i])
        } else {
          // eslint-disable-next-line no-console
          console.dir(args[i])
        }
        break
      case 'error':
        // eslint-disable-next-line no-console
        console.error(spacer + spirit, args[i])
        break
      case 'log':
        // eslint-disable-next-line no-console
        console.log(spacer + spirit, args[i])
        break
      case 'table':
        // eslint-disable-next-line no-console
        console.table(args[i])
        break
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(spacer + spirit, args[i])
        break
    }
  }
// }
}
