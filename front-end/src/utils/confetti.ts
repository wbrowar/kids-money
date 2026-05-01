import confetti, { Shape } from 'canvas-confetti'
import { log } from '@/utils/console.ts'

/**
 * Sets up the confetti anamation used to celebrate when a kid has increased their total.
 *
 * @param {HTMLCanvasElement} canvas A canvas element that the confetti will be rendered on.
 */
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

  /**
   * Fires an animation that shows confetti shooting out from the bottom left and right corners of the screen.
   */
  shootConfetti() {
    log('Playing confetti animation')
    // Launch confetti from the left edge
    this.#confettiInstance({
      angle: 45,
      drift: 1,
      origin: { x: 0, y: 0.8 },
      particleCount: 150,
      spread: 100,
      scalar: this.#scalar,
      shapes: this.#shapes,
    })
    // Launch confetti from the right edge
    this.#confettiInstance({
      angle: 135,
      drift: -1,
      origin: { x: 1, y: 0.8 },
      particleCount: 150,
      spread: 100,
      scalar: this.#scalar,
      shapes: this.#shapes,
    })
  }
}
