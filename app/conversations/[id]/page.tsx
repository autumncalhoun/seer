import { Heading } from '@/components/ui/heading'
import PromptAccordion from '@/components/prompt-accordion'
import { UserDisplay } from '@/components/user-display'
import { externalApi } from '@/app/api/external'

export default async function Conversation({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Error handling here? What if there is no conversation with that id?
  const conversation = await externalApi.getConversation(id)
  const prompts = await externalApi.getPrompts({
    'filter[conversation_id]': id,
    include: 'llm_responses',
  })

  return (
    <div>
      <Heading level={1}>{conversation.title}</Heading>
      <UserDisplay userId={conversation.user_id} />
      <p>Created: {new Date(conversation.created).toLocaleString()}</p>
      <p>Updated: {new Date(conversation.updated).toLocaleString()}</p>

      <h2>Prompts</h2>
      <PromptAccordion prompts={prompts} />
    </div>
  )
}
