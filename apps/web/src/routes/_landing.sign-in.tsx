import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useSignIn } from '@/hooks/auth'

export const Route = createFileRoute('/_landing/sign-in')({
  component: SignIn,
})

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

function SignIn() {
  const { mutateAsync, error, isError } = useSignIn()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <img src="/purplebacksubb.png" className="w-40 rounded-4xl shadow-md" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent className="space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: signInSchema.shape.email,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: signInSchema.shape.password,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              )}
            </form.Subscribe>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            {isError && (
              <p className="text-sm text-center text-red-500">
                {error.message}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
