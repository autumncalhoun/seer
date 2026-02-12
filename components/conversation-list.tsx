'use client'

import { Conversation } from '../app/api/external'

export default function ConversationList({
  conversations,
}: {
  conversations: Conversation[]
}) {
  if (conversations.length === 0) return <div>No conversations found</div>
  return (
    <div>
      <h1>Conversations</h1>

      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>{conversation.title}</li>
        ))}
      </ul>
    </div>
  )
}
