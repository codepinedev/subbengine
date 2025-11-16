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
import { useSignUp } from '@/hooks/auth'

export const Route = createFileRoute('/_landing/sign-up')({
  component: SignUp,
})

function SignUp() {
  const { mutateAsync, isError, error } = useSignUp()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <img src="/purplebacksubb.png" className="w-40 rounded-4xl shadow-md " />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
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
              name="name"
              validators={{
                onChange: z
                  .string()
                  .min(2, 'Name must be at least 2 characters'),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="John Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: z.string().email('Invalid email address'),
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
                onChange: z
                  .string()
                  .min(6, 'Password must be at least 6 characters'),
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

            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ['password'],
                onChange: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue('password')
                  if (value !== password) {
                    return "Passwords don't match"
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm Password</Label>
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
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>
              )}
            </form.Subscribe>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Sign in
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
