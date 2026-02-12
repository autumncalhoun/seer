'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href}>
      <Button variant={isActive ? 'default' : 'ghost'}>{children}</Button>
    </Link>
  )
}
