import styles from "./WhatToAsk.module.css";

export interface WhatToAskProps {
  addNewMessage: (value: string) => void;
}

export function WhatToAsk({ addNewMessage }: WhatToAskProps) {
  const suggested_questions = [
    "How can I improve my productivity at work or school?",
    "What are the latest trends in technology or AI?",
    "Can you help me plan a trip?",
    "What's the best way to learn a new language?",
  ];

  return (
    <div className={styles.wta}>
      <h3 className={styles.wta_title}>{"Don't know what to ask?"}</h3>
      <p className={styles.wta_subtitle}>Suggested questions</p>

      <div className={styles.wta_suggested_questions}>
        {suggested_questions.map((q, i) => (
          <button
            type="button"
            key={i}
            className={styles.wta_suggested_question} 
            onClick={() => addNewMessage(q)}
            >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
