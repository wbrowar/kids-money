import { argv, exit } from 'process'
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { statSync, unlink } from 'node:fs'
import { join } from 'node:path'

function parseArgv() {
  const args = {}

  argv.forEach((arg) => {
    if (arg.startsWith('--limit=')) {
      args.limit = parseInt(arg.split('=')[1])
    }
  })

  return args
}

async function main() {
  const args = parseArgv()

  const limit = args.limit ?? 14
  const dbFilePath = '../prisma/db/kids-money.db'
  const backupPath = '../prisma/backups'

  try {
    console.log('Create backup directory if it doesn’t exist.')
    const backupDirectory = await stat(backupPath)
    if (backupDirectory.isDirectory()) {
      console.log('Found backup directory.')
    } else {
      console.log('Backup path is not a directory.')
      exit(1)
    }
  } catch (error) {
    console.log('Creating backup directory.')
    await mkdir(backupPath, { recursive: true })
  }

  try {
    console.log('Creating backup file.')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `kids-money-${timestamp}.db`

    const existingDbFile = await stat(dbFilePath)
    await copyFile(dbFilePath, join(backupPath, backupFileName))
    console.log(`Backup file created: ${backupFileName}`)
  } catch (err) {
    console.error(err)
  }

  try {
    console.log(`Deleting older backups based on limit, ${limit}.`)
    const backupFiles = await readdir(backupPath, { withFileTypes: true }).then((files) =>
      files.filter((file) => file.isFile() && file.name.endsWith('.db')).map((file) => file.name)
    )

    // Map files with their path and modification time
    const fileStats = backupFiles.map((file) => {
      const filePath = join(backupPath, file)
      return {
        path: filePath,
        mtime: statSync(filePath).mtime,
      }
    })

    // Sort files by modified time (oldest to newest)
    fileStats.sort((a, b) => a.mtime - b.mtime)

    // If number of files exceeds limit, delete the oldest
    if (fileStats.length > limit) {
      const filesToDelete = fileStats.slice(0, fileStats.length - limit)
      filesToDelete.forEach((file) => {
        unlink(file.path, (err) => {
          if (err) console.error(`Error deleting ${file.path}:`, err)
          else console.log(`Deleted: ${file.path}`)
        })
      })
    } else {
      console.log('No files to delete.')
    }
  } catch (err) {
    console.error(err)
  }
}

main()
