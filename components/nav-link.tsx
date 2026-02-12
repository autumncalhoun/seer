'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({
  href,
  children,
  ...props
}: {
  href: string
  children: React.ReactNode
} & React.ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href} {...props}>
      <Button variant={isActive ? 'default' : 'ghost'}>{children}</Button>
    </Link>
  )
}
