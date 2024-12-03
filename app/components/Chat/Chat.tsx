import { ChatList } from "~/components/ChatList/ChatList";
import { ChatPanel } from "~/components/ChatPanel/ChatPanel";
import { ChatLoader } from "~/components/ChatLoader/ChatLoader";
import { EmptyMessage } from "~/components/EmptyMessage/EmptyMessage";
import { WhatToAsk } from "~/components/WhatToAsk/WhatToAsk";
import { RelatedQuestions } from "~/components/RelatedQuestions/RelatedQuestions";

import { useChatMessages } from "~/lib/chat/actions";
import { useScrollAnchor } from "~/lib/hooks/use-scroll-anchor";

import styles from "./Chat.module.css";

export default function Chat() {
  const {
    isLoading,
    messages,
    addNewMessage,
    relatedQuestions,
    currentMessage,
  } = useChatMessages();

  const lastMessageRef = useScrollAnchor(messages, currentMessage);

  return (
    <>
      <div className={styles.chat_messages}>
        {messages.length ? (
          <>
            <ChatList messages={messages} currentMessage={currentMessage} />
            {relatedQuestions.length > 0 && (
              <RelatedQuestions
                questions={relatedQuestions}
                addNewMessage={addNewMessage}
              />
            )}
          </>
        ) : (
          <>
            <EmptyMessage />
            <WhatToAsk addNewMessage={addNewMessage} />
          </>
        )}
        <div ref={lastMessageRef} className={styles.chat_end} />
      </div>
      {isLoading && <ChatLoader />}
      <ChatPanel loading={isLoading} addNewMessage={addNewMessage} />
    </>
  )
}
