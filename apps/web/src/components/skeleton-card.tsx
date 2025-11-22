import { Card, CardContent } from './ui/card'
import { Spinner } from './ui/spinner'

export function SkeletonCard() {
  return (
    <Card className="flex flex-col space-y-3">
      <CardContent className='flex justify-center'>
        <Spinner />
      </CardContent>
    </Card>
  )
}
