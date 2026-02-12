import { useState, useEffect } from 'react'

export function useSubscription(channel) {
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setConnected(true)
    setMessages([])

    const intervalId = setInterval(() => {
      const newMessage = {
        id: Date.now(),
        channel,
        text: `Message from ${channel} at ${new Date().toLocaleTimeString()}`,
      }
      setMessages((prev) => [...prev.slice(-9), newMessage])
    }, 3000)

    return () => {
      clearInterval(intervalId)
      setConnected(false)
    }
  }, [channel])

  return { messages, connected }
}
