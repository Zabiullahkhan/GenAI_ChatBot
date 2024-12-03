import styles from "./RelatedQuestions.module.css";

export interface RelatedQuestionsProps {
  questions: string[];
  addNewMessage: (value: string) => void;
}

export function RelatedQuestions({
  questions,
  addNewMessage,
}: RelatedQuestionsProps) {
  return (
    <div className={styles.related_questions}>
      <p className={styles.related_questions_title}>Related Questions</p>
      {questions.map((q, i) => (
        <button
          type="button"
          key={i}
          className={styles.related_question}
          onClick={() => addNewMessage(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
