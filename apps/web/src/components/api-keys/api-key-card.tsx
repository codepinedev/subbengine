import dayjs from 'dayjs'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { ApiKey } from '@/lib/types/api-key.types'
import { ApiKeyStatus } from '@/lib/types/api-key.types'

interface ApiKeyCardProps {
  apiKey: ApiKey
  gameName?: string
}

export function ApiKeyCard({ apiKey, gameName }: ApiKeyCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const maskKey = (key: string, name: string) => {
    const prefix = name.substring(0, Math.min(4, name.length))
    const maskedPart = '*'.repeat(Math.max(20, key.length - 4))
    return `${prefix}${maskedPart}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const isRevoked = apiKey.status === ApiKeyStatus.REVOKED

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold truncate">{apiKey.name}</h3>
          <Badge
            variant={isRevoked ? 'secondary' : 'default'}
            className="shrink-0"
          >
            {apiKey.status}
          </Badge>
        </div>

        {gameName && (
          <p className="text-xs text-muted-foreground truncate">{gameName}</p>
        )}

        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate block flex-1">
            {isVisible ? apiKey.id : maskKey(apiKey.id, apiKey.name)}
          </code>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
          <span>
            Last used {dayjs(apiKey.lastUsedAt).format("dddd, MMMM D, YYYY h:mm A")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? 'Hide key' : 'Show key'}
          disabled={isRevoked}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={copyToClipboard}
          title="Copy key"
          disabled={isRevoked}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
