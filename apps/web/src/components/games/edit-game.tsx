import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Gamepad2, Pencil, Smile } from 'lucide-react'
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
import type { Game } from '@/lib/types'
import { useUpdateGame } from '@/hooks/use-games'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const formSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
  icon: z.string().min(1, 'Icon is required'),
  description: z.string().min(1, 'Description is required'),
})

interface EditGameDialogProps {
  game: Game
}

export function EditGameDialog({ game }: EditGameDialogProps): ReactElement {
  const { mutateAsync, isPending } = useUpdateGame()
  const [open, setOpen] = useState(false)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: game.name,
      icon: game.icon,
      description: game.description,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync({
      gameId: game.id,
      game: values,
    })
    toast.success('Game updated successfully!')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gamepad2 className="h-5 w-5" />
            Edit Game Details
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Update your game information. Changes will be reflected across all
            leaderboards and dashboards.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                          Choose an emoji to visually represent your game.
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
                      The official name of your game as it will appear to
                      players.
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
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Gamepad2 className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
