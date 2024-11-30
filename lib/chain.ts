// Local type definitions
type Message = {
  content: string;
  role: 'human' | 'ai' | 'system';
}

type RetrievalChainInput = {
  chat_history: Message[];
  question: string;
}

type Document = {
  pageContent: string;
  metadata?: Record<string, any>;
}

interface LLMInterface {
  call: (messages: Message[]) => Promise<string>;
}

interface RetrieverInterface {
  getRelevantDocs: (query: string) => Promise<Document[]>;
}

export function groupMessagesByConversation(messages: Message[]) {
  if (messages.length % 2 !== 0) {
    messages.pop();
  }

  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    groupedMessages.push({
      human: messages[i].content,
      ai: messages[i + 1].content,
    });
  }

  return groupedMessages;
}

const formatChatHistory = (history: Message[]): string => {
  return history
    .map((message) => `${message.role}: ${message.content}`)
    .join('\n');
}

const formatDocs = (docs: Document[]): string => {
  return docs
    .map((doc, i) => `<doc id='${i}'>${doc.pageContent}</doc>`)
    .join('\n');
}

const serializeHistory = (input: any): Message[] => {
  const chatHistory = input.chat_history || [];
  return chatHistory.map((msg: any) => ({
    content: msg.human ? msg.human : msg.ai,
    role: msg.human ? 'human' : 'ai'
  }));
}

async function createCondensedQuestion(
  llm: LLMInterface,
  question: string,
  chatHistory: string,
  template: string
): Promise<string> {
  const prompt = template
    .replace('{chat_history}', chatHistory)
    .replace('{question}', question);
  
  return await llm.call([{ role: 'human', content: prompt }]);
}

export async function createChain({
  llm,
  question_template,
  question_llm,
  retriever,
  response_template,
}: {
  llm: LLMInterface;
  question_llm: LLMInterface;
  retriever: RetrieverInterface;
  question_template: string;
  response_template: string;
}) {
  return async function(input: RetrievalChainInput): Promise<string> {
    // Convert chat history to proper format
    const formattedHistory = formatChatHistory(input.chat_history);
    
    // Get condensed question if there's chat history
    let searchQuery = input.question;
    if (input.chat_history.length > 0) {
      searchQuery = await createCondensedQuestion(
        question_llm,
        input.question,
        formattedHistory,
        question_template
      );
    }

    // Retrieve relevant documents
    const docs = await retriever.getRelevantDocs(searchQuery);
    const formattedDocs = formatDocs(docs);

    // Prepare final prompt
    const messages: Message[] = [
      { role: 'system', content: response_template },
      ...input.chat_history,
      { role: 'human', content: input.question }
    ];

    // Get final response
    const response = await llm.call(messages);
    return response;
  };
}
