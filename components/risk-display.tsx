import { Badge } from '@/components/ui/badge'

export default function RiskDisplay({ risk }: { risk: number }) {
  if (risk === 0) return <Badge variant="outline">None</Badge>
  if (risk === 1) return <Badge variant="outline">Low</Badge>
  if (risk === 2) return <Badge variant="secondary">Medium</Badge>
  return <Badge variant="destructive">High</Badge>
}
