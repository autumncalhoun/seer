import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Filters } from '@/components/filters'
import { Heading } from '@/components/ui/heading'
import Link from 'next/link'
import { SeerPagination } from '@/components/seer-pagination'
import { UserDisplay } from '@/components/user-display'
import { externalApi } from '@/app/api/external'

const PAGE_SIZE = 50

export default async function Conversations({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; user_id?: string }>
}) {
  const { page: pageParam, user_id: userIdParam } = await searchParams
  const page = Number(pageParam ?? '1') || 1
  const userId = userIdParam ?? undefined

  const { conversations, total } = await externalApi.getConversations({
    page,
    limit: PAGE_SIZE,
    'filter[user_id]': userId,
  })
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  return (
    <div className="p-6">
      <Heading level={1}>Conversations</Heading>
      <Filters userId={userId} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link href={`/conversations/${c.id}`}>
                  {c.title || '(Untitled)'}
                </Link>
              </TableCell>
              <TableCell>
                <UserDisplay userId={c.user_id} />
              </TableCell>
              <TableCell>{new Date(c.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(c.updated).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <SeerPagination
          totalPages={totalPages}
          currentPage={page}
          getPageHref={(p) => {
            const params = new URLSearchParams()
            params.set('page', String(p))
            if (userId) params.set('user_id', userId)
            return `/conversations?${params}`
          }}
          className="mt-4"
        />
      )}
    </div>
  )
}
