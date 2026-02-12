'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { User } from '@/app/api/external'

interface UsersContextValue {
  users: User[]
  usersById: Map<string, User>
}

const UsersContext = createContext<UsersContextValue | null>(null)

export function UsersProvider({
  users,
  children,
}: {
  users: User[]
  children: ReactNode
}) {
  const value = useMemo(() => {
    if (!users) return { users: [], usersById: new Map() }
    const usersById = new Map(users.map((u) => [u.id, u]))
    return { users, usersById }
  }, [users])

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within UsersProvider')
  return ctx
}
