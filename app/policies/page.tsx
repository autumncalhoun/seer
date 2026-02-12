import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Heading } from '@/components/ui/heading'
import { externalApi } from '@/app/api/external'

const PAGE_SIZE = 50

export default async function Policies({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? '1') || 1
  const policies = await externalApi.getPolicies({
    page,
    limit: PAGE_SIZE,
  })
  return (
    <div className="p-6">
      <Heading level={1}>Policies</Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Version</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell>{policy.policy_name}</TableCell>
              <TableCell>{policy.policy_version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
