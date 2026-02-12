'use client'

import { UsersSelect } from '@/components/users-select'
import { useRouter } from 'next/navigation'

export function Filters({ userId }: { userId?: string }) {
  const router = useRouter()

  function handleChange(newUserId: string) {
    router.push(newUserId ? `/conversations?user_id=${newUserId}` : '/conversations')
  }

  return (
    <div>
      <UsersSelect value={userId} onValueChange={handleChange} />
    </div>
  )
}
