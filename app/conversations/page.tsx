import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { SeerPagination } from '@/components/seer-pagination'
import { externalApi } from '@/app/api/external'

const PAGE_SIZE = 50

export default async function Conversations({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? '1') || 1

  const { conversations, total } = await externalApi.getConversations({
    page,
    limit: PAGE_SIZE,
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Conversations</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.title || '(Untitled)'}</TableCell>
              <TableCell>{c.user_id}</TableCell>
              <TableCell>{new Date(c.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(c.updated).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {total > 1 && (
        <SeerPagination
          totalPages={total}
          currentPage={page}
          getPageHref={(p) => `/conversations?page=${p}`}
          className="mt-4"
        />
      )}
    </div>
  )
}
