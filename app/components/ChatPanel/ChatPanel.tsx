import { useState, memo } from "react";
import Textarea from "react-textarea-autosize";

import { useEnterSubmit } from "~/lib/hooks/use-enter-submit";

import styles from "./ChatPanel.module.css";

const SendIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 -960 960 960">
    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
  </svg>
);

export interface ChatPanelProps {
  loading: boolean;
  addNewMessage: (value: string) => void;
}

export function ChatPanelComponent({ loading, addNewMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    // Blur focus on mobile to close keyboard
    if (window.innerWidth < 600) {
      e.target["message"]?.blur();
    }

    const userMessage = input.trim();
    setInput("");

    if (!userMessage || loading) return;

    addNewMessage(userMessage);
  };

  return (
    <div className={styles.chat_panel}>
      <form ref={formRef} onSubmit={onFormSubmit}>
        <div className={styles.chat_panel_send}>
          <Textarea
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="How may I help you?"
            className={styles.chat_panel_message}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={styles.chat_panel_action}>
            <SendIcon className={styles.chat_panel_icon} />
          </button>
        </div>
      </form>
    </div>
  );
}

export const ChatPanel = memo(ChatPanelComponent);
