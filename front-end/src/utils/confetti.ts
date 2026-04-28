import confetti, { Shape } from 'canvas-confetti'
import { log } from '@/utils/console.ts'

export default class Confetti {
  #confettiInstance
  #scalar = 0
  #shapes: Shape[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.#confettiInstance = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })

    this.#scalar = 3
    const bagOfMoney = confetti.shapeFromText({ text: '💰', scalar: this.#scalar })
    const cash = confetti.shapeFromText({ text: '💵', scalar: this.#scalar })
    const creditCard = confetti.shapeFromText({ text: '💳', scalar: this.#scalar })
    const diamond = confetti.shapeFromText({ text: '💎', scalar: this.#scalar })
    const hongbao = confetti.shapeFromText({ text: '🧧', scalar: this.#scalar })
    const flyingCash = confetti.shapeFromText({ text: '💸', scalar: this.#scalar })

    this.#shapes = [bagOfMoney, cash, creditCard, diamond, hongbao, flyingCash]
  }

  shootConfetti() {
    log('Playing confetti animation')
    // Launch confetti from the left edge
    this.#confettiInstance({
      angle: 40,
      drift: 0.5,
      gravity: 0.25,
      origin: { x: 0, y: 0.8 },
      particleCount: 150,
      spread: 110,
      scalar: this.#scalar,
      shapes: this.#shapes,
    })
    // Launch confetti from the right edge
    this.#confettiInstance({
      angle: 140,
      drift: -0.5,
      gravity: 0.25,
      origin: { x: 1, y: 0.8 },
      particleCount: 150,
      spread: 110,
      scalar: this.#scalar,
      shapes: this.#shapes,
    })
  }
}
