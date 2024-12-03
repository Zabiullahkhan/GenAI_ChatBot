import { useRef, useEffect } from 'react'
import { Message } from '../types';

export const useScrollAnchor = (messages: Message [], currentMessage: Message | undefined) => {
  const lastMessage = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, currentMessage])

  return lastMessage;
}
