import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../components/theme-provider'
import { queryClient } from '@/api/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: () => <App />,
})
