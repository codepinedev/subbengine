import { Check, Copy, Eye, EyeOff, Key } from 'lucide-react'
import { useState } from 'react'
import type { ApiKey } from '@/lib/types/api-key.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContainerSpinner } from '@/components/ui/spinner'
import { ApiKeyStatus } from '@/lib/types/api-key.types'

interface GameApiKeysProps {
  gameKeys?: {
    data: Array<ApiKey>
  }
  isLoading?: boolean
}

export function GameApiKeys({ gameKeys, isLoading }: GameApiKeysProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set())

  const enabledKeys =
    gameKeys?.data.filter((key) => key.status === ApiKeyStatus.ENABLED) || []
  const revokedKeys =
    gameKeys?.data.filter((key) => key.status === ApiKeyStatus.REVOKED) || []

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const copyToClipboard = async (keyId: string, keyValue: string) => {
    try {
      await navigator.clipboard.writeText(keyValue)
      setCopiedKeys((prev) => new Set(prev).add(keyId))
      setTimeout(() => {
        setCopiedKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(keyId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const maskKey = (key: string, name: string) => {
    const prefix = name.substring(0, Math.min(4, name.length))
    const maskedPart = '*'.repeat(Math.max(20, key.length - 4))
    return `${prefix}${maskedPart}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Keys
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Active and revoked game keys
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <ContainerSpinner />
          </div>
        ) : gameKeys?.data && gameKeys.data.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Active Keys</span>
                <Badge variant="default" className="rounded-full">
                  {enabledKeys.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Revoked</span>
                <Badge variant="secondary" className="rounded-full">
                  {revokedKeys.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gameKeys.data.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {apiKey.name}
                      </p>
                      <Badge
                        variant={
                          apiKey.status === ApiKeyStatus.ENABLED
                            ? 'default'
                            : 'secondary'
                        }
                        className="shrink-0"
                      >
                        {apiKey.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate block">
                        {visibleKeys.has(apiKey.id)
                          ? apiKey.id
                          : maskKey(apiKey.id, apiKey.name)}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      title={
                        visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'
                      }
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(apiKey.id, apiKey.id)}
                      title="Copy key"
                    >
                      {copiedKeys.has(apiKey.id) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No API keys found for this game
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
