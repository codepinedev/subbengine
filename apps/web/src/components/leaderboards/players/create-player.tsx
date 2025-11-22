import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod/v3'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useCreatePlayer } from '@/hooks/use-players'
import { Route } from '@/routes/dashboard/leaderboard/$leaderboardId.index'

export function CreatePlayerForm({ onSuccess }: { onSuccess?: () => void }): ReactElement {
  const { leaderboardId } = Route.useParams()

  const { mutateAsync, isPending } = useCreatePlayer(leaderboardId)
  const formSchema = z.object({
    username: z.string(),
    score: z.coerce.number(),
    avatarUrl: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      score: 0,
      avatarUrl: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (leaderboardId) {
      await mutateAsync({
        ...values,
        leaderboardId,
        rank: 0,
      })
      toast.success('Player created successfully!')
      onSuccess?.()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter player username" {...field} />
              </FormControl>
              <FormDescription>
                A player with this username will be created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Title</FormLabel>
              <FormControl>
                <Input placeholder="50" {...field} />
              </FormControl>
              <FormDescription>
                Enter the player score, if you are initializing it keep it to 0
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner />}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export function CreatePlayer(): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create New Player
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          Create a new player
          <DialogDescription>
            Once you create a player you can then add it on the leaderboard of
            your game!
          </DialogDescription>
        </DialogHeader>
        <CreatePlayerForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
