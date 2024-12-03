import { FormEvent } from "react";
import clsx from "clsx";

import styles from "./ChatFeedback.module.css";

import {
  ThumbUpIcon,
  ThumbDownIcon,
  CheckIcon,
} from "~/components/Icons/Icons";

export interface ChatFeedbackProps {
  messageID: string;
  reaction: 1 | -1;
  isSendingFeedback: boolean;
  isFeedbackComplete: boolean;
  onClose: () => void;
  onAddFeedback: (reaction: number, message: string, tags: string) => void;
}

const feedback_tags = [
  "Relevance",
  "Accuracy",
  "Responsiveness",
  "User experience",
];

export function ChatFeedback({
  messageID,
  reaction,
  isSendingFeedback,
  isFeedbackComplete,
  onAddFeedback,
  onClose,
}: ChatFeedbackProps) {

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const feedback_message: string = formData.get("feedback_message") as string;
    const selectedTags = feedback_tags.filter((f) => formData.get(f) === "on");
    const tags = selectedTags.length > 0 ? selectedTags.join(",") : "";
    onAddFeedback(reaction, feedback_message, tags);
  };

  const reaction_message = reaction === 1 ? "like" : "not like";

  return (
    <div className={styles.chat_feedback}>
      {isFeedbackComplete ? (
        <div className={styles.chat_feedback_complete}>
          <CheckIcon className={styles.chat_feedback_complete_icon} />
          <span>Thank you for your feedback</span>
        </div>
      ) : (
        <form onSubmit={onFormSubmit}>
          <div className={styles.chat_feedback_heading}>
            {reaction === 1 ? (
              <ThumbUpIcon className={styles.chat_feedback_emotion} />
            ) : (
              <ThumbDownIcon className={styles.chat_feedback_emotion} />
            )}
            <p className={styles.chat_feedback_title}>
              Share Detailed Feedback
            </p>
          </div>

          <p className={styles.chat_feedback_question}>
            What did you {reaction_message}?
          </p>

          <div className={styles.chat_feedback_tags}>
            {feedback_tags.map((t) => (
              <div key={t}>
                <input
                  type="checkbox"
                  className={styles.chat_feedback_checkbox}
                  id={`${messageID}${t}`}
                  name={t}
                />
                <label
                  className={styles.chat_feedback_tag}
                  htmlFor={`${messageID}${t}`}
                >
                  {t}
                </label>
              </div>
            ))}
          </div>

          <textarea
            name={"feedback_message"}
            className={styles.chat_feedback_message}
            placeholder="Provide detailed feedback"
            rows={4}
          />

          <div className={styles.chat_feedback_desclaimer}>
            Your feedback could be used to improve the accuracy of future responses.
          </div>

          <div className={styles.chat_feedback_actions}>
            <button
              className={clsx(
                styles.chat_feedback_action,
                styles.chat_feedback_cancel
              )}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className={clsx(
                styles.chat_feedback_action,
                styles.chat_feedback_submit
              )}
              disabled={isSendingFeedback}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
