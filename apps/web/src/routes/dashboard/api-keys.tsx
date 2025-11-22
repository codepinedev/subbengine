import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Key, Shield } from 'lucide-react'
import { useState } from 'react'
import { ApiKeyCard } from '@/components/api-keys/api-key-card'
import { CreateApiKey } from '@/components/api-keys/create-api-key'
import { DashboardKpiElement } from '@/components/dashboard/dashboard-kpi-element'
import { EmptyComponent } from '@/components/empty-component'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetAllApiKeys } from '@/hooks/use-api-key'
import { useGetGames } from '@/hooks/use-games'
import { ApiKeyStatus } from '@/lib/types/api-key.types'

export const Route = createFileRoute('/dashboard/api-keys')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: apiKeysData, isPending: keysLoading } = useGetAllApiKeys()
  const { data: gamesData } = useGetGames()

  if (keysLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!apiKeysData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load API keys</AlertDescription>
        </Alert>
      </div>
    )
  }

  const allKeys = apiKeysData.data
  const games = gamesData?.data || []

  // Get game name by ID
  const getGameName = (gameId: string) => {
    return games.find((g) => g.id === gameId)?.name || 'Unknown Game'
  }

  const getGameIcon = (gameId: string) => {
    return games.find((g) => g.id === gameId)?.icon || '🎮'
  }

  // Filter keys
  const filteredKeys = allKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getGameName(key.gameId).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Separate by status
  const activeKeys = filteredKeys.filter(
    (key) => key.status === ApiKeyStatus.ENABLED,
  )
  const revokedKeys = filteredKeys.filter(
    (key) => key.status === ApiKeyStatus.REVOKED,
  )

  // Calculate stats
  const totalKeys = allKeys.length
  const totalActive = allKeys.filter(
    (key) => key.status === ApiKeyStatus.ENABLED,
  ).length
  const totalRevoked = allKeys.filter(
    (key) => key.status === ApiKeyStatus.REVOKED,
  ).length

  // Group keys by game
  const keysByGame = filteredKeys.reduce(
    (acc, key) => {
      acc[key.gameId] = []
      acc[key.gameId].push(key)
      return acc
    },
    {} as Record<string, typeof filteredKeys>,
  )

  if (totalKeys === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-muted-foreground mt-1">
              Manage your API keys for game integration
            </p>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Secure API Access</AlertTitle>
          <AlertDescription>
            API keys allow you to securely integrate your games with our
            platform. Create your first API key to get started.
          </AlertDescription>
        </Alert>

        <EmptyComponent
          title="No API Keys Found"
          description="Create your first API key to start integrating your games."
        >
          <CreateApiKey />
        </EmptyComponent>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for game integration
          </p>
        </div>
        <CreateApiKey />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Keep your API keys secure</AlertTitle>
        <AlertDescription>
          Never share your API keys publicly or commit them to version control.
          If a key is compromised, revoke it immediately and create a new one.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardKpiElement
          title="Total API Keys"
          value={totalKeys}
          icon={Key}
          isPending={keysLoading}
        />
        <DashboardKpiElement
          title="Active Keys"
          value={totalActive}
          icon={Shield}
          iconColor="secondary"
          isPending={keysLoading}
        />
        <DashboardKpiElement
          title="Revoked Keys"
          value={totalRevoked}
          icon={AlertCircle}
          isPending={keysLoading}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All Keys
              <Badge variant="secondary" className="ml-2">
                {filteredKeys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              <Badge variant="default" className="ml-2">
                {activeKeys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="revoked">
              Revoked
              <Badge variant="secondary" className="ml-2">
                {revokedKeys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="by-game">By Game</TabsTrigger>
          </TabsList>

          <Input
            placeholder="Search by name or game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All API Keys ({filteredKeys.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredKeys.length > 0 ? (
                filteredKeys.map((key) => (
                  <ApiKeyCard
                    key={key.id}
                    apiKey={key}
                    gameName={`${getGameIcon(key.gameId)} ${getGameName(key.gameId)}`}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No API keys match your search
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active API Keys ({activeKeys.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeKeys.length > 0 ? (
                activeKeys.map((key) => (
                  <ApiKeyCard
                    key={key.id}
                    apiKey={key}
                    gameName={`${getGameIcon(key.gameId)} ${getGameName(key.gameId)}`}
                  />
                ))
              ) : (
                <EmptyComponent
                  title="No Active Keys"
                  description="All your API keys have been revoked."
                >
                  <CreateApiKey />
                </EmptyComponent>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revoked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revoked API Keys ({revokedKeys.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {revokedKeys.length > 0 ? (
                revokedKeys.map((key) => (
                  <ApiKeyCard
                    key={key.id}
                    apiKey={key}
                    gameName={`${getGameIcon(key.gameId)} ${getGameName(key.gameId)}`}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No revoked API keys
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-game" className="space-y-4">
          {Object.entries(keysByGame).map(([gameId, keys]) => (
            <Card key={gameId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{getGameIcon(gameId)}</span>
                  <span>{getGameName(gameId)}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {keys.length} {keys.length === 1 ? 'key' : 'keys'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {keys.map((key) => (
                  <ApiKeyCard key={key.id} apiKey={key} />
                ))}
              </CardContent>
            </Card>
          ))}

          {Object.keys(keysByGame).length === 0 && (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  No API keys match your search
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
