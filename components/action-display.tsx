import { Badge } from '@/components/ui/badge'

export default function ActionDisplay({
  action,
}: {
  action: 'none' | 'blocked'
}) {
  if (action !== 'blocked') return null
  return <Badge variant="destructive">Blocked</Badge>
}
