import styles from "./ChatList.module.css";

import { ChatMessage } from "~/components/ChatMessage/ChatMessage";
import { Message } from "~/lib/types";

export interface ChatListProps {
  messages: Message[];
  currentMessage: Message | undefined;
}

export function ChatList({ messages, currentMessage }: ChatListProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className={styles.chat_list}>
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      {currentMessage && <ChatMessage message={currentMessage} />}
    </div>
  );
}
