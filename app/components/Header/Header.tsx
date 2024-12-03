import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img
          width={30}
          height={30}
          alt="Chatbot Logo"
          src={"/Chatbot-Icon.svg"}
        />
        <span>Ask Chatbot</span>
      </div>
      <div className={styles.header_actions}>
      </div>
    </header>
  );
}
