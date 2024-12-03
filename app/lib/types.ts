interface Source {
  ref: string;
  link: string;
}

export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  sources?: Source[]
  sentAt: Date
}
