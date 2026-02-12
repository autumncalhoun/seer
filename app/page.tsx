import ConversationList from '@/src/conversation-list'
import { externalApi } from '@/src/api/external'

export default async function Home() {
  const conversations = await externalApi.getConversations()
  return (
    <div>
      <main>
        <h1>Seer</h1>
        <ConversationList conversations={conversations} />
      </main>
    </div>
  )
}
