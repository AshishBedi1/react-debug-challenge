import { useEffect, useRef } from 'react'

export function useEventListener(eventName, handler, element) {
  const targetElement = element || window
  const savedHandler = useRef(handler)

  // Keep handler ref current
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventHandler = (event) => savedHandler.current(event)

    targetElement.addEventListener(eventName, eventHandler)

    return () => {
      targetElement.removeEventListener(eventName, eventHandler)
    }
  }, [eventName, targetElement])
}
