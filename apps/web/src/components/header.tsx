import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client'

export function Header() {
  const { data, isPending } = authClient.useSession()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/logo-transparent-purple.png"
                alt="SubbEngine"
                className="h-24 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-row gap-3 items-center">
            {isPending ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : data?.session ? (
              <a href="/dashboard">
                <Button variant="default">Go to Dashboard</Button>
              </a>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="default">Get Started</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
