/*
 * Enable confetti in the ConfettiContainer to be triggerred from any component.
 */
export const useConfetti = () => {
  const showConfetti = useState('show-confetti', () => false)

  /*
   * Trigger confetti animation.
   *
   * Usage:
   * ```
   * const { playConfettiAnimation } = useConfetti()
   * playConfettiAnimation()
   * ```
   */
  function playConfettiAnimation () {
    showConfetti.value = true
  }

  return {
    playConfettiAnimation,
    showConfetti
  }
}
