import type { MetaFunction } from "@remix-run/node";

import Header from "~/components/Header/Header";
import Chat from "~/components/Chat/Chat";

export const meta: MetaFunction = () => {
  return [
    { title: "GenAI Chatbot" },
    { name: "description", content: "GenAI Chatbot is an AI Powered Chatbot" },
  ];
};

export default function Index() {
  return (
    <div className={"llm-chatbot"}>
      <Header />
      <Chat />
    </div>
  );
}
