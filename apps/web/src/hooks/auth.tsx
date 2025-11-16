import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  name: string
}

/**
 * Hook for signing in users
 * Properly handles errors and propagates them to React Query
 */
function useSignIn() {
  const router = useRouter()

  return useMutation({
    mutationKey: ['signIn'],
    mutationFn: async (data: SignInRequest) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response
    },
    onSuccess: () => {
      router.navigate({ to: '/' })
    },
  })
}

/**
 * Hook for signing up users
 * Properly handles errors and propagates them to React Query
 */
function useSignUp() {
  const router = useRouter()
  return useMutation({
    mutationKey: ['signUp'],
    mutationFn: async (data: SignUpRequest) => {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response
    },
    onSuccess: () => {
      router.navigate({ to: '/' })
    },
  })
}

export { useSignIn, useSignUp }
