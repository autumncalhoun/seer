'use client'

import { useUsers } from '@/components/providers/users-provider'

export function UserDisplay({ userId }: { userId: string }) {
  const { usersById } = useUsers()
  const user = usersById.get(userId)
  return <>{user ? user.name : userId}</>
}
