import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function ProfileGeneral(): React.ReactElement {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Informations</CardTitle>
      </CardHeader>
      <CardContent>You will be updating your details here</CardContent>
    </Card>
  )
}
