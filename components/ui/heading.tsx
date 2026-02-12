export function Heading({
  level = 1,
  children,
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}) {
  if (level === 1) {
    return <h1 className="text-4xl font-bold mb-4">{children}</h1>
  }
  if (level === 2) {
    return <h2 className="text-3xl font-bold mb-4">{children}</h2>
  }
  if (level === 3) {
    return <h3 className="text-2xl font-bold mb-4">{children}</h3>
  }
  if (level === 4) {
    return <h4 className="text-xl font-bold mb-4">{children}</h4>
  }
  if (level === 5) {
    return <h5 className="text-lg font-bold mb-4">{children}</h5>
  }
  if (level === 6) {
    return <h6 className="text-base font-bold mb-4">{children}</h6>
  }
  return <h1 className="text-2xl font-semibold mb-4">{children}</h1>
}
