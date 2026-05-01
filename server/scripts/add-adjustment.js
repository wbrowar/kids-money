import { dollarAdjustmentFromInterestPercentage, interestFromInterestThresholds } from '../src/utils/adjustments.ts'
import { prisma } from '../src/utils/prisma.ts'
import { argv, exit } from 'process'

function parseArgv() {
  const args = {}

  argv.forEach((arg) => {
    if (arg.startsWith('--kid=')) {
      args.kidId = parseInt(arg.split('=')[1])
    } else if (arg.startsWith('--dollar=')) {
      args.adjustmentType = 'dollar'
      args.dollarAdjustment = parseFloat(arg.split('=')[1])
    } else if (arg.startsWith('--interest')) {
      args.adjustmentType = 'interest'
    } else if (arg.startsWith('--reason')) {
      args.reason = arg.split('=')[1]
    }
  })

  return args
}

async function main() {
  const args = parseArgv()

  if (typeof args.kidId !== 'number') {
    console.error(
      'Kid argument missing. Add one using the `--kid` argument:\n  node scripts/add-adjustment.js --kid=1 --interest'
    )
    exit(1)
  }

  let previousAdjustment = 0
  const kid = await prisma.kid.findUnique({
    include: {
      adjustments: {
        orderBy: {
          id: 'desc',
        },
        take: 1,
      },
    },
    where: {
      id: args.kidId,
    },
  })

  if (!kid) {
    console.error(`Kid with ID, ${args.kidId}, not found. Check the ID for the kid in Settings and try again.`)
    exit(1)
  }

  if (kid?.adjustments?.[0] ?? false) {
    previousAdjustment = kid.adjustments[0].totalToDate
  }

  console.log(`Adding adjustment for kid: ${kid.name}`)

  let createParams = {}
  if (args.adjustmentType === 'dollar') {
    createParams = {
      dollarAdjustment: args.dollarAdjustment,
      reason: args.reason ?? '',
      totalToDate: args.dollarAdjustment + previousAdjustment,
    }
  } else if (args.adjustmentType === 'interest') {
    const interestPecentage = interestFromInterestThresholds(
      previousAdjustment,
      kid.interest,
      JSON.parse(kid.interestThresholds ?? '[]')
    )
    const calculatedDollarAdjustment = dollarAdjustmentFromInterestPercentage(interestPecentage, previousAdjustment)
    createParams = {
      dollarAdjustment: calculatedDollarAdjustment,
      percentAdjustment: interestPecentage,
      totalToDate: calculatedDollarAdjustment + previousAdjustment,
    }
  }

  const user = await prisma.kid.update({
    data: {
      adjustments: {
        // @ts-ignore
        create: createParams,
      },
    },
    where: {
      id: kid.id,
    },
  })

  console.log(`Adjustment added for ${kid.name}:`)
  console.log(createParams)
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
