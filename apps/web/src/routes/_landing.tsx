import { createFileRoute } from '@tanstack/react-router'
import { LandingLayout } from '@/components/layouts/landing-layout'

export const Route = createFileRoute('/_landing')({
  component: LandingLayout,
})
