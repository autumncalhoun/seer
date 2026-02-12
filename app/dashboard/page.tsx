import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Heading } from '@/components/ui/heading'
import Link from 'next/link'
import { UserDisplay } from '@/components/user-display'
import { externalApi } from '@/app/api/external'

export default async function Dashboard() {
  const { promptsCount, responsesCount, users } =
    await externalApi.getRiskyPrompts()

  return (
    <div>
      <Heading level={1}>Dashboard</Heading>
      <div className="grid grid-cols-3 gap-4 justify-stretch">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Prompt Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <span className="font-bold text-2xl">{promptsCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Response Alerts</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center justify-center">
            <span className="font-bold text-2xl">{responsesCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">User Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <span className="font-bold text-2xl">{users.length}</span>
          </CardContent>
        </Card>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Risky Conversations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(([userId, count]) => (
            <TableRow key={userId}>
              <TableCell>
                <Link href={`/conversations?user_id=${userId}`}>
                  <UserDisplay userId={userId} />
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/conversations?user_id=${userId}`}>{count}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
