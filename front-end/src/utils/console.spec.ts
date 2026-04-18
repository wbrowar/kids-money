import { describe, expect, test, vi } from 'vitest'
import {
  dir,
  error,
  log,
  table,
  warn
} from './console'

describe('Console', () => {
  test('console.dir is fired', () => {
    const consoleSpy = vi.spyOn(console, 'dir')

    dir('hello')

    expect(consoleSpy).toHaveBeenCalled()

    dir(['hello'])

    expect(consoleSpy).toHaveBeenCalled()
  })

  test('console.error is fired', () => {
    const consoleSpy = vi.spyOn(console, 'error')

    error('hello')

    expect(consoleSpy).toHaveBeenCalled()
  })

  test('console.log is fired', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    log('hello')

    expect(consoleSpy).toHaveBeenCalled()
  })

  test('console.table is fired', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    table('hello')

    expect(consoleSpy).toHaveBeenCalled()
  })

  test('console.warn is fired', () => {
    const consoleSpy = vi.spyOn(console, 'warn')

    warn('hello')

    expect(consoleSpy).toHaveBeenCalled()
  })

  test('console.log output is correct for one argument', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    log('hello')

    expect(consoleSpy).toHaveBeenCalledWith('💰', 'hello')
  })

  test('console.log output is correct for two arguments', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    log('hello', 'hi')

    expect(consoleSpy).toHaveBeenCalledWith('💰', 'hello')
    expect(consoleSpy).toHaveBeenCalledWith('◉ 💰', 'hi')
  })
})
