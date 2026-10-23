import { spawn } from 'node:child_process'
import process from 'node:process'

process.chdir(import.meta.dirname)

const child = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  shell: true,
})

child.on('error', (err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (code !== null) {
    process.exit(code)
  } else if (signal) {
    process.kill(process.pid, signal)
  }
})

process.on('SIGINT', () => {
  child.kill('SIGINT')
})

process.on('SIGTERM', () => {
  child.kill('SIGTERM')
})
