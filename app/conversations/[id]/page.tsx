import { Heading } from '@/components/ui/heading'
import PromptAccordion from '@/components/prompt-accordion'
import { SeerPagination } from '@/components/seer-pagination'
import { UserDisplay } from '@/components/user-display'
import { externalApi } from '@/app/api/external'

const PAGE_SIZE = 100

export default async function Conversation({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? '1') || 1

  const conversation = await externalApi.getConversation(id)
  const { prompts, total } = await externalApi.getPrompts({
    page,
    limit: PAGE_SIZE,
    'filter[conversation_id]': id,
    include: 'llm_responses',
  })

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  return (
    <div>
      <Heading level={1}>{conversation.title}</Heading>
      <UserDisplay userId={conversation.user_id} />
      <p>Created: {new Date(conversation.created).toLocaleString()}</p>
      <p>Updated: {new Date(conversation.updated).toLocaleString()}</p>

      <h2>Prompts</h2>
      <PromptAccordion prompts={prompts} />
      {totalPages > 1 && (
        <SeerPagination
          totalPages={totalPages}
          currentPage={page}
          getPageHref={(p) => `/conversations/${id}?page=${p}`}
          className="mt-4"
        />
      )}
    </div>
  )
}
