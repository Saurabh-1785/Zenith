import './globals.css'
import Sidebar from './components/Sidebar'

export const metadata = {
  title: 'Zenith - Smart Resource Allocator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '240px', padding: '32px', width: '100%', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}