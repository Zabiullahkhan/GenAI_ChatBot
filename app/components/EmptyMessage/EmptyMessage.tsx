import styles from "./EmptyMessage.module.css";

export function EmptyMessage() {
  return (
    <div className={styles.empty_message_container}>
      <div className={styles.empty_message}>
        <div className={styles.empty_message_greeting}>Greetings, </div>
        <div className={styles.empty_message_title}>
          Welcome to LLM Chatbot!
        </div>
        <div>
          How may I assist you?
        </div>
      </div>
      <div className={styles.empty_message_bot} />
    </div>
  );
}
