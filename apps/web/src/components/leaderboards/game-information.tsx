import { Gamepad2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GameInformationProps {
  gameName: string
  gameId: string
}

export function GameInformation({ gameName, gameId }: GameInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Game Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Details about the associated game
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Game Name
            </p>
            <p className="text-base font-semibold">{gameName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Game ID
            </p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block">
              {gameId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
