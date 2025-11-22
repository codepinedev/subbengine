import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Copy, Key, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import type { ReactElement } from 'react'
import { useGetGames } from '@/hooks/use-games'
import { useCreateApiKey } from '@/hooks/use-api-key'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CreateApiKeyFormProps {
  preselectedGameId?: string
  onSuccess?: () => void
}

export function CreateApiKeyForm({
  preselectedGameId,
  onSuccess,
}: CreateApiKeyFormProps): ReactElement {
  const { mutateAsync, isPending } = useCreateApiKey()
  const { data: games, isPending: gamesLoading } = useGetGames()
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const formSchema = z.object({
    name: z
      .string()
      .min(1, 'API key name is required')
      .regex(
        /^[a-z0-9_]+$/,
        'API key name must contain only lowercase letters, numbers, and underscores',
      ),
    gameId: z.string().min(1, 'Please select a game'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: preselectedGameId || '',
      name: '',
    },
  })

  useEffect(() => {
    if (preselectedGameId) {
      form.setValue('gameId', preselectedGameId)
    }
  }, [preselectedGameId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await mutateAsync(values)
      setCreatedKey(response.data.key)
      toast.success('API key created successfully!')
      form.reset()
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const copyToClipboard = async () => {
    if (createdKey) {
      try {
        await navigator.clipboard.writeText(createdKey)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleClose = () => {
    setCreatedKey(null)
    setIsCopied(false)
    form.reset()
    onSuccess?.()
  }

  if (createdKey) {
    return (
      <div className="space-y-4">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            Your API key has been created successfully. Make sure to copy it now
            as you won't be able to see it again.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your new API Key</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-muted px-3 py-2 rounded border">
              {createdKey}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy key"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button onClick={handleClose} className="w-full">
          Done
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gamesLoading && (
                    <SelectItem value="loading" disabled>
                      Loading games...
                    </SelectItem>
                  )}
                  {games?.data && games.data.length === 0 && (
                    <SelectItem value="no-data" disabled>
                      No games available
                    </SelectItem>
                  )}
                  {games?.data.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.icon} {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the game this API key will be used for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. production_key, staging_key"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A unique identifier for your API key. Use lowercase letters,
                numbers, and underscores only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Key className="h-4 w-4" />
              <span>Create API Key</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

interface CreateApiKeyProps {
  preselectedGameId?: string
}

export function CreateApiKey({
  preselectedGameId,
}: CreateApiKeyProps): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Create a new API Key
          </DialogTitle>
          <DialogDescription>
            Generate a new API key for your game. You'll be able to use this key
            to integrate with your application and manage leaderboards.
          </DialogDescription>
        </DialogHeader>
        <CreateApiKeyForm
          preselectedGameId={preselectedGameId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
