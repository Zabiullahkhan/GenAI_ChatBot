import { memo } from "react";
import clsx from "clsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";

import { ChatFeedback } from "~/components/ChatFeedback/ChatFeedback";
import { ThumbUpIcon, ThumbDownIcon } from "~/components/Icons/Icons";

import { Message } from "~/lib/types";
import { useChatFeedback } from "~/lib/chat/actions";

import styles from "./ChatMessage.module.css";

export interface ChatMessageProps {
  message: Message;
}

function ChatMessageComponent({ message }: ChatMessageProps) {
  const { id, type, content, sentAt, sources } = message;

  const {
    chatFeedbackType,
    setChatFeedbackType,
    isSendingFeedback,
    isFeedbackComplete,
    addFeedback,
  } = useChatFeedback(id);

  const shouldDisplayFeedback = type === "ai" && !isFeedbackComplete;
  const isFeedbackOpen = chatFeedbackType === 1 || chatFeedbackType === -1;

  return (
    <div
      className={clsx(
        type === "ai" && styles.ai_message,
        type === "user" && styles.user_message
      )}
    >
      <div className={styles.message_content}>
        <div className={styles.message_text}>
          <Markdown remarkPlugins={[remarkGfm, supersub]}>{content}</Markdown>
        </div>

        {/* GenAI Disclaimer */}
        {type === "ai" && (
          <div className={styles.message_disclaimer}>
            {
              "Responses might occasionally be inconsistent."
            }
          </div>
        )}

        {sources && sources.length > 0 && (
          <details className={styles.message_sources}>
            <summary className={styles.message_sources_title}>Sources</summary>
            {sources.map((s) => (
              <a
                target="_blank"
                href={s.link}
                className={styles.message_source}
                key={s.ref}
                rel="noreferrer"
              >
                {s.ref}
              </a>
            ))}
          </details>
        )}
      </div>

      <div className={styles.message_actions}>
        {/* Feedback controls for AI message */}
        {shouldDisplayFeedback && (
          <div className={styles.message_feedback_actions}>
            <button
              onClick={() => setChatFeedbackType(1)}
              type="button"
              className={clsx(
                styles.message_feedback_action,
                chatFeedbackType === 1 &&
                  styles.message_feedback_action_selected
              )}
            >
              <ThumbUpIcon className={styles.message_feedback_icon} />
            </button>
            <button
              onClick={() => setChatFeedbackType(-1)}
              type="button"
              className={clsx(
                styles.message_feedback_action,
                chatFeedbackType === -1 &&
                  styles.message_feedback_action_selected
              )}
            >
              <ThumbDownIcon className={styles.message_feedback_icon} />
            </button>
          </div>
        )}

        <p className={styles.message_sent}>{sentAt.toLocaleTimeString()}</p>
      </div>

      {isFeedbackOpen && (
        <ChatFeedback
          messageID={id}
          isSendingFeedback={isSendingFeedback}
          reaction={chatFeedbackType}
          isFeedbackComplete={isFeedbackComplete}
          onAddFeedback={addFeedback}
          onClose={() => setChatFeedbackType(0)}
        />
      )}

    </div>
  );
}

export const ChatMessage = memo(ChatMessageComponent);
