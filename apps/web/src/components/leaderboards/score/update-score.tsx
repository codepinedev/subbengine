import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import z from 'zod/v3'
import { toast } from 'sonner'
import type { UpdateScoreRequest } from '@/lib/types'
import type { ReactElement } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { SelectedPlayersContext } from '@/context/selected-players-context'
import { useUpdateScore } from '@/hooks/use-leaderboards'
import { Route } from '@/routes/dashboard/leaderboard/$leaderboardId.index'

export function UpdateScoreForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {
  const { leaderboardId } = Route.useParams()

  const { isPending, mutateAsync } = useUpdateScore(leaderboardId || '0')
  const { selectedPlayers, clearSelectedPlayers } = useContext(
    SelectedPlayersContext,
  )

  const formSchema = z.object({
    players: z.array(
      z.object({
        id: z.string(),
        username: z.string(),
        currentScore: z.number(),
        newScore: z.coerce.number().min(0, 'Score must be a positive number'),
        avatar: z.string().optional(),
        metadata: z
          .object({
            username: z.string().optional(),
            avatarUrl: z.string().optional(),
          })
          .optional(),
      }),
    ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'players',
  })

  useEffect(() => {
    const playersData = selectedPlayers.map((player) => ({
      id: player.id,
      username: player.username,
      currentScore: player.score,
      newScore: player.score,
      avatar: player.avatarUrl,
      metadata: {
        username: player.username,
        avatarUrl: player.avatarUrl,
      },
    }))
    replace(playersData)
  }, [selectedPlayers, replace])

  function constructPayload(
    values: z.infer<typeof formSchema>,
  ): Array<UpdateScoreRequest> {
    const payload: Array<UpdateScoreRequest> = []
    values.players.map((player) =>
      payload.push({
        leaderboardId: leaderboardId,
        metadata: {
          username: player.username,
          avatarUrl: player.avatar || '',
        },
        playerId: player.id,
        score: player.newScore,
      }),
    )
    return payload
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(constructPayload(values), {
      onSuccess: () => {
        toast.success('Score updated successfully!')
        clearSelectedPlayers()
        setOpen(false)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="space-y-2">
              <div className="flex flex-row gap-2 items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={field.avatar} />
                    <AvatarFallback className="bg-primary">
                      {field.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2 text-sm">
                    <div>{field.username}</div>
                    <div className="text-muted-foreground text-xs">
                      ID: {field.id}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  Current: {field.currentScore}
                </div>
              </div>
              <FormField
                control={form.control}
                name={`players.${index}.newScore`}
                render={({ field: _field }) => (
                  <FormItem>
                    <FormLabel>New Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter new score"
                        {..._field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner />}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export function UpdateScore({
  children,
}: {
  children: ReactElement
}): ReactElement {
  const [open, setOpen] = useState(false)
  const { selectedPlayers } = useContext(SelectedPlayersContext)

  const getTitle = () =>
    selectedPlayers.length > 1
      ? "Submit the new players's score (" + selectedPlayers.length + ')'
      : 'Submit the new player score'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Enter your gaming details to join the leaderboard rankings.
          </DialogDescription>
        </DialogHeader>
        <UpdateScoreForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
