'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '📊 Dashboard' },
  { href: '/resources', label: '👥 Resources' },
  { href: '/tasks', label: '📋 Tasks' },
  { href: '/allocations', label: '⚡ Allocations' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div style={{
      width: '240px',
      background: '#1e293b',
      height: '100vh',
      position: 'fixed',
      padding: '32px 16px',
      borderRight: '1px solid #334155'
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#6366f1', marginBottom: '40px', paddingLeft: '12px' }}>
        ⚡ Zenith
      </h1>

      {links.map(link => (
        <Link key={link.href} href={link.href} style={{
          display: 'block',
          padding: '12px 16px',
          marginBottom: '8px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: pathname === link.href ? '#6366f1' : '#94a3b8',
          background: pathname === link.href ? '#1e1b4b' : 'transparent',
          fontWeight: pathname === link.href ? '600' : '400',
        }}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}