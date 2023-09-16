export interface newChatRequest {
  senderId: number
  receiverId: number
  message: string
  senderToken: string
}

export interface ChatRequestUpdate {
  id: number
  message: string
}

export interface Message {
  id: string
  senderId: number
  receiverId: number
  message: string
  createdAt: Date
  updatedAt: Date
}
