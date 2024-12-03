import styles from "./ChatLoader.module.css";
import clsx from "clsx";

export function ChatLoader() {

  return (
    <div className={styles.loader}>
      
      <div className={styles.dot_loader}>
        <div className={clsx(styles.loader_dot, styles.loader_dot_one)}></div>
        <div className={clsx(styles.loader_dot, styles.loader_dot_two)}></div>
        <div className={clsx(styles.loader_dot, styles.loader_dot_three)}></div>
        <div className={clsx(styles.loader_dot, styles.loader_dot_four)}></div>
      </div>
    </div>
  );
}
