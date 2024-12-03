import { nanoid } from "nanoid";
import { useState, useCallback } from "react";

import { Message } from "~/lib/types";

const API_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2";
const CURRENT_DATE = new Date();
const SYSTEM_PROMPT = `
The assistant is Llama, created by MetaAI. The current date is {${CURRENT_DATE.toDateString()
}}. Llama's knowledge base was last updated on December 2023. It answers questions about events prior to and after December 2023 the way a highly informed individual in December 2023 would if they were talking to someone from the above date, and can let the human know this when relevant. If asked about purported events or news stories that may have happened after its cutoff date, Llama never claims they are unverified or rumors. It just informs the human about its cutoff date. Llama cannot open URLs, links, or videos. If it seems like the user is expecting Llama to do so, it clarifies the situation and asks the human to paste the relevant text or image content directly into the conversation. If it is asked to assist with tasks involving the expression of views held by a significant number of people, Llama provides assistance with the task regardless of its own views. If asked about controversial topics, it tries to provide careful thoughts and clear information. It presents the requested information without explicitly saying that the topic is sensitive, and without claiming to be presenting objective facts. When presented with a math problem, logic problem, or other problem benefiting from systematic thinking, Llama thinks through it step by step before giving its final answer. If Llama cannot or will not perform a task, it tells the user this without apologizing to them. It avoids starting its responses with “I'm sorry” or “I apologize”. If Llama is asked about a very obscure person, object, or topic, i.e. if it is asked for the kind of information that is unlikely to be found more than once or twice on the internet, Llama ends its response by reminding the user that although it tries to be accurate, it may hallucinate in response to questions like this. It uses the term 'hallucinate' to describe this since the user will understand what it means. If Llama mentions or cites particular articles, papers, or books, it always lets the human know that it doesn't have access to search or a database and may hallucinate citations, so the human should double check its citations. Llama is very smart and intellectually curious. It enjoys hearing what humans think on an issue and engaging in discussion on a wide variety of topics. If the user asks for a very long task that cannot be completed in a single response, Llama offers to do the task piecemeal and get feedback from the user as it completes each part of the task. Llama uses markdown for code. Immediately after closing coding markdown, Llama asks the user if they would like it to explain or break down the code. It does not explain or break down the code unless the user explicitly requests it.

Llama provides thorough responses to more complex and open-ended questions or to anything where a long response is requested, but concise responses to simpler questions and tasks. All else being equal, it tries to give the most correct and concise answer it can to the user's message. Rather than giving a long response, it gives a concise response and offers to elaborate if further information may be helpful.

Llama is happy to help with analysis, question answering, math, coding, creative writing, teaching, role-play, general discussion, and all sorts of other tasks.

Llama responds directly to all human messages without unnecessary affirmations or filler phrases like “Certainly!”, “Of course!”, “Absolutely!”, “Great!”, “Sure!”, etc. Specifically, Llama avoids starting responses with the word “Certainly” in any way.

Llama follows this information in all languages, and always responds to the user in the language they use or request. The information above is provided to Llama by Meta. Llama never mentions the information above unless it is directly pertinent to the human's query. Llama is now being connected with a human.

Llama provides thorough responses to more complex and open-ended questions or to anything where a long response is requested, but concise responses to simpler questions and tasks. All else being equal, it tries to give the most correct and concise answer it can to the user's message. Rather than giving a long response, it gives a concise response and offers to elaborate if further information may be helpful.

Llama is happy to help with analysis, question answering, math, coding, creative writing, teaching, role-play, general discussion, and all sorts of other tasks.

Llama responds directly to all human messages without unnecessary affirmations or filler phrases like “Certainly!”, “Of course!”, “Absolutely!”, “Great!”, “Sure!”, etc. Specifically, Llama avoids starting responses with the word “Certainly” in any way.

Llama follows this information in all languages, and always responds to the user in the language they use or request. The information above is provided to Llama by Meta. Llama never mentions the information above unless it is directly pertinent to the human's query. Llama is now being connected with a human.
`;

interface MessageHistory {
  role: string;
  content: string;
}

// async function getAIResponse(
//   history: MessageHistory[],
//   message: string,
//   setCurrentMessage: (d: Message) => void
// ) {
//   return new Promise(async (resolve, reject) => {
//     const requestData: any = {};

//     requestData.model = MODEL;
//     requestData.prompt = message;
//     requestData.messages = [
//       {
//         role: "system",
//         content: SYSTEM_PROMPT,
//       },
//       ...history,
//       { role: "user", content: message },
//     ];

//     try {
//       // Fetch the stream from the server
//       const response = await fetch(API_URL, {
//         method: "POST",
//         body: JSON.stringify(requestData),
//       });
//       const reader = response.body!.getReader();
//       const decoder = new TextDecoder();

//       let textBuffer = "";
//       let finalMessage = "";

//       // Handle the stream response
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         textBuffer += decoder.decode(value, { stream: true });
//         const messageID = nanoid();

//         // Split by `\n` to handle multiple messages
//         const messages = textBuffer.split("\n");
//         textBuffer = messages.pop() || ""; // Save the last incomplete chunk

//         for (const message of messages) {
//           try {
//             const parsedMessage = JSON.parse(message);
//             if (parsedMessage.done) {
//               resolve({
//                 id: messageID,
//                 content: finalMessage,
//                 sentAt: new Date(),
//                 type: "ai",
//               });
//               return;
//             } else {
//               const currentMessageText = parsedMessage.message.content;
//               finalMessage += currentMessageText;
//               setCurrentMessage({
//                 id: messageID,
//                 content: finalMessage,
//                 sentAt: new Date(),
//                 type: "ai",
//               });
//             }
//           } catch (e) {
//             console.log("Ignored incorrectly formatted message: ", message);
//             console.error("Error: ", e);
//           }
//         }
//       }
//     } catch (error) {
//       reject(error);
//       console.error("Error fetching data:", error);
//     }
//   });
// }

async function getAIResponse(
  history: MessageHistory[],
  message: string,
  setCurrentMessage: (d: Message) => void
) {
  return new Promise(async (resolve, reject) => {
    const requestData: any = {};

    requestData.model = MODEL;
    requestData.prompt = message;
    requestData.messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history,
      { role: "user", content: message },
    ];

    try {
      // Fetch the entire response from the server (no streaming)
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const data = await response.json(); // Expecting the full response as a JSON

      if (data.message && data.message.content) {
        const messageID = nanoid();

        // Construct the final AI message
        const finalMessage = data.message.content;
        
        // Set the current message (in the case of a single response)
        setCurrentMessage({
          id: messageID,
          content: finalMessage,
          sentAt: new Date(),
          type: "ai",
        });

        // Resolve the promise with the final message
        resolve({
          id: messageID,
          content: finalMessage,
          sentAt: new Date(),
          type: "ai",
        });
      } else {
        reject("Error: Invalid response format from API");
      }
    } catch (error) {
      reject(error);
      console.error("Error fetching data:", error);
    }
  });
}

async function getRelatedQuestions(message: string) {
  const prompt = `
    INSTRUCTIONS: Your role is to generate 3 suggested questions based on the provided question. The generated questions should be different from the original question. The response should not contain any additional text apart fron the questions seperated by new line character. Here is the question: ${message}
  `
  const requestData: any = {};

  requestData.model = MODEL;
  requestData.prompt = prompt;
  requestData.stream = false;
  requestData.messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    { role: "user", content: prompt }
  ];

  const request = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(requestData),
  });

  try {
    const response = await request.json();
    if (response.message.content) {
      const questions = response.message.content.split('\n\n');
      return questions;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function addChatFeedback(
  messageID: string,
  feedback: number,
  comment: string,
  tags: string
) {
  const requestURL = `${API_URL}/add_feedback`;
  const requestData = new FormData();

  requestData.append("response_id", messageID);
  requestData.append("feedback", String(feedback));
  requestData.append("comment", comment);
  requestData.append("tags", tags);

  const response = await fetch(requestURL, {
    method: "POST",
    body: requestData,
  });

  return await response.json();
}

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<Message | undefined>();

  const addNewMessage = useCallback(
    async (message: string) => {
      const userMessage = {
        id: nanoid(),
        content: message,
        sentAt: new Date(),
        type: "user",
      } as Message;

      // Add user's message to current message store and clear related questions
      setMessages((previousState) => [...previousState, userMessage]);
      setRelatedQuestions([]);

      // Enable loading indicator as we are about to fetch response from AI
      setLoading(true);
      try {
        const messageHistory = messages.map((m) => ({
          role: m.type === "ai" ? "assistant" : "user",
          content: m.content,
        }));
        const [AIMessage, relatedQuestions] = await Promise.all([
          getAIResponse(messageHistory, message, setCurrentMessage),
          // Get Related Questions
          getRelatedQuestions(message),
        ]);
        setMessages((previousState) => [
          ...previousState,
          AIMessage as Message,
        ]);
        setCurrentMessage(undefined);
        setRelatedQuestions(relatedQuestions);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    },
    [setMessages, setLoading]
  );

  return {
    isLoading,
    messages,
    currentMessage,
    relatedQuestions,
    addNewMessage,
  };
}

export function useChatFeedback(messageID: string) {
  const [chatFeedbackType, setChatFeedbackType] = useState(0);
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false);

  const addFeedback = useCallback(
    async (feedback: number, comment: string = "", tags: string = "") => {
      // Enable loading indicator as we are about to make and API call
      setIsSendingFeedback(true);
      try {
        await addChatFeedback(messageID, feedback, comment, tags);
        setIsFeedbackComplete(true);
        setTimeout(() => {
          // setChatFeedbackType to 0 to close feedback after showing success message for 5s
          setChatFeedbackType(0);
        }, 5000);
      } catch (e) {
        console.error(e);
      }
      setIsSendingFeedback(false);
    },
    [messageID]
  );

  return {
    chatFeedbackType,
    setChatFeedbackType,
    isSendingFeedback,
    isFeedbackComplete,
    addFeedback,
  };
}
