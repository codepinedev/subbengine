import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export const Route = createFileRoute('/_landing/')({
  component: Home,
})

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center space-y-12 justify-center items-center flex flex-col">
        <img src="/purplebacksubb.png" className="w-40 rounded-4xl shadow-md" />
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to SubbEngine
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful leaderboard SDK for your applications. Track rankings, manage
          competitions, and engage your users with real-time scoring and
          analytics.
        </p>
        <div className="w-full max-w-md pt-4">
          <form className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1"
              />
              <Button type="submit">Join Waitlist</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
