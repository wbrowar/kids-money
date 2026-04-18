/**
 * Utility to wait for an event to be dispatched.
 *
 * @param element The element to listen on
 * @param eventName The event name to listen for
 * @param action A function that triggers the event (e.g., clicking a button or setting an attribute)
 * @returns A promise that resolves to the event object
 *
 * Usage:
 * ```typescript
 * const event = await waitForEvent(el, 'opened', () => el.setAttribute('visible', ''));
 * expect(event).toBeInstanceOf(AlertOpenedEvent);
 * ```
 */
export async function waitForEvent<T extends Event = Event>(
  element: HTMLElement | EventTarget,
  eventName: string,
  action?: () => void | Promise<void>,
): Promise<T> {
  return new Promise(async (resolve) => {
    element.addEventListener(eventName, (e) => resolve(e as T), { once: true });
    if (action) {
      await action();
    }
  });
}