import { Link, Outlet } from '@tanstack/react-router'
import { Button } from '../components/ui/button'

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4">
        <nav className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/users">Users</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/roles">Roles</Link>
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

