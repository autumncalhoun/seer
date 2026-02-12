'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUsers } from '@/components/providers/users-provider'

interface UsersSelectProps {
  value?: string
  onValueChange?: (userId: string) => void
  placeholder?: string
}

export function UsersSelect({ value, onValueChange, placeholder = 'Select user' }: UsersSelectProps) {
  const { users } = useUsers()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
