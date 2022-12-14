import { PrismaClient } from '@prisma/client'
import { argv, exit } from 'process'

const prisma = new PrismaClient()

function parseArgv() {
  const args = {}

  argv.forEach((arg) => {
    if (arg.startsWith('-u=')) {
      args.username = arg.split('=')[1];
    } else if (arg.startsWith('-p=')) {
      args.password = arg.split('=')[1];
    } else if (arg.startsWith('-admin=')) {
      args.grownUp = arg.split('=')[1] === 'true';
    }
  })

  return args;
}

async function main () {
  const args = parseArgv()

  if (typeof args.username === 'undefined') {
    console.error('Username argument missing. Add one using the `-u` argument:\n  node scripts/update-user.mjs -u=my-username. -p=my-password')
    exit(1)
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: args.username,
    },
  })

  console.log(`Updating username: ${args.username}`)

  const newGrownUpStatus = args.grownUp ?? args.grownUp ?? false

  const user = await prisma.user.update({
    data: {
      username: args.username,
      password: args.password ?? existingUser.password,
      grownUp: newGrownUpStatus
    },
    where: {
      id: existingUser.id
    }
  })

  console.log(`User updated with username: ${args.username} and grownUp status: ${newGrownUpStatus ? 'true' : 'false'}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    exit(1)
  })
