import { PrismaClient } from '@prisma/client'
import { argv, exit } from 'process'

const prisma = new PrismaClient()

function parseArgv() {
  const args = {
    autoAdjust: []
  }

  argv.forEach((arg) => {
    if (arg.startsWith('-kid=')) {
      args.kidSlug = arg.split('=')[1];
    } else if (arg.startsWith('-dollar=')) {
      args.dollarAdjustment = parseFloat(arg.split('=')[1]);
    } else if (arg.startsWith('-interest=')) {
      args.percentAdjustment = parseFloat(arg.split('=')[1]);
    } else if (arg === '-allowance') {
      args.autoAdjust.push('allowance')
    } else if (arg === '-interest') {
      args.autoAdjust.push('interest')
    }
  })

  return args;
}

async function main () {
  const args = parseArgv()

  if (typeof args.kidSlug === 'undefined') {
    console.error('Kid argument missing. Add one using the `-kid` argument:\n  node scripts/add-adjustment.mjs -kid=kid-slug -interest')
    exit(1)
  }
  if (parseArgv().autoAdjust.length > 1) {
    console.error('Both -allowance and -interest were set. Please remove one or the other and try again.')
    exit(1)
  }

  let previousAdjustment = 0
  const kid = await prisma.kid.findUnique({
    include: {
      adjustments: {
        orderBy: {
          id: 'desc'
        },
        take: 1
      }
    },
    where: {
      slug: args.kidSlug,
    },
  })

  if (!kid) {
    console.error(`Kid with slug, ${args.kidSlug}, not found. Check the slug for the kid in Settings and try again.`)
    exit(1)
  }

  if (kid?.adjustments?.[0] ?? false) {
    previousAdjustment = kid.adjustments[0].totalToDate
  }

  console.log(`Adding adjustment for kid: ${kid.name}`)

  const updateData = {}

  if (parseArgv().dollarAdjustment) {
    updateData.dollarAdjustment = parseArgv().dollarAdjustment
  } else if (parseArgv().autoAdjust.includes('allowance') && kid.allowance > 0) {
    updateData.dollarAdjustment = kid.allowance
  } else if (parseArgv().percentAdjustment) {
    updateData.percentAdjustment = parseArgv().percentAdjustment
  } else if (parseArgv().autoAdjust.includes('interest') && kid.interest > 0) {
    updateData.percentAdjustment = kid.interest
  }

  if (updateData.percentAdjustment) {
    updateData.dollarAdjustment = (updateData.percentAdjustment * 0.01) * previousAdjustment
  }

  updateData.totalToDate = updateData.dollarAdjustment + previousAdjustment

  const user = await prisma.kid.update({
    data: {
      adjustments: {
        // @ts-ignore
        create: updateData
      }
    },
    where: {
      id: kid.id
    }
  })

  console.log(`Adjustment added for ${kid.name}:`)
  console.log(updateData)
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
