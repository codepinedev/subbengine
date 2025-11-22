import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Plus } from 'lucide-react'
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
import { useCreateLeaderboard } from '@/hooks/use-leaderboards'
import { useGetGames } from '@/hooks/use-games'
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

interface CreateLeaderboardFormProps {
  preselectedGameId?: string
  onSuccess?: () => void
}

export function CreateLeaderboardForm({
  preselectedGameId,
  onSuccess,
}: CreateLeaderboardFormProps): ReactElement {
  const { mutateAsync, isPending } = useCreateLeaderboard()
  const { data: games, isPending: gamesLoading } = useGetGames()
  const formSchema = z.object({
    name: z.string().min(1, 'Leaderboard name is required'),
    gameId: z.string().min(1, 'Please select a game'),
    icon: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: preselectedGameId || '',
      name: '',
      icon: '',
    },
  })

  useEffect(() => {
    if (preselectedGameId) {
      form.setValue('gameId', preselectedGameId)
    }
  }, [preselectedGameId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values)
    toast.success('Leaderboard created successfully!')
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leaderboard Name</FormLabel>
              <FormControl>
                <Input placeholder="Grand Tournament Of All Times" {...field} />
              </FormControl>
              <FormDescription>
                This is your public leaderboard name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the game for this leaderboard.
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

interface CreateLeaderboardProps {
  preselectedGameId?: string
}

export function CreateLeaderboard({
  preselectedGameId,
}: CreateLeaderboardProps): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new leaderboard</DialogTitle>
          <DialogDescription>
            By creating a new leaderboard you will be given an API Key and you
            will be able to manage it by adding players and updating scores from
            the dashboard or with the SDK.
          </DialogDescription>
        </DialogHeader>
        <CreateLeaderboardForm
          preselectedGameId={preselectedGameId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
