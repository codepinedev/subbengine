import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Gamepad2, Key, Plus, Smile } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '../ui/emoji-picker'
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
import { useCreateGame } from '@/hooks/use-games'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateGameForm({ onSuccess }: { onSuccess?: () => void }): ReactElement {
  const { mutateAsync, isPending } = useCreateGame()

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const formSchema = z.object({
    name: z.string().min(1, 'Game name is required'),
    icon: z.string().min(1, 'Icon is required'),
    description: z.string().min(1, 'Description is required'),
    apiKeyName: z
      .string()
      .min(1, 'API key name is required')
      .regex(
        /^[a-z0-9_]+$/,
        'API key name must contain only lowercase letters, numbers, and underscores',
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '',
      description: '',
      apiKeyName: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values)
    toast.success('Game created successfully!')
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Game Details Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Gamepad2 />
                <span>Game Information</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Icon</FormLabel>
                  <div className="flex items-center gap-3">
                    <Dialog
                      open={emojiPickerOpen}
                      onOpenChange={setEmojiPickerOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-16 w-16 text-3xl"
                        >
                          {field.value || (
                            <Smile className="h-6 w-6 text-muted-foreground" />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md p-0">
                        <EmojiPicker
                          onEmojiSelect={(emoji) => {
                            field.onChange(emoji.emoji)
                            setEmojiPickerOpen(false)
                          }}
                          className="h-[400px] w-full border-0"
                        >
                          <EmojiPickerSearch placeholder="Search emoji..." />
                          <EmojiPickerContent />
                          <EmojiPickerFooter />
                        </EmojiPicker>
                      </DialogContent>
                    </Dialog>
                    <div className="flex-1">
                      <FormDescription>
                        Choose an emoji to visually represent your game in the
                        dashboard. Click the button to open the emoji picker.
                      </FormDescription>
                      {field.value && (
                        <p className="text-sm font-medium mt-1">
                          Selected: {field.value}
                        </p>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Free Fire, PUBG Mobile, Valorant"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The official name of your game as it will appear to players
                    and in the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your game, its genre, and key features..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description to help your team understand
                    what this game is about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Key />
                <span>API Configuration</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="apiKeyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. sk_free_fire, sk_my_game"
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
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              <span>Creating Game...</span>
            </>
          ) : (
            <>
              <Gamepad2 className="h-4 w-4" />
              <span>Create Game & Generate API Key</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export function CreateGame({
  variant = 'button',
}: {
  variant?: 'button' | 'icon'
}): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <Button>
            <Gamepad2 className="h-4 w-4" />
            New Game
          </Button>
        ) : (
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:min-w-6xl min-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gamepad2 className="h-5 w-5" />
            Create a new game
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Create a new game and get an automatically generated API key for
            integration. You'll be able to manage leaderboards and player scores
            through the dashboard or SDK.
          </DialogDescription>
        </DialogHeader>
        <CreateGameForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
