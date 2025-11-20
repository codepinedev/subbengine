import { Hono } from 'hono'
import { Leaderboard, Player } from '@subbengine/sdk'
import { serve } from '@hono/node-server'

const app = new Hono()


const lb = new Leaderboard({
  apiKey: 'mad_live_91b083811d763831033a84c304d7dddcd331b1bbe1452fd1df7052afa1e5e51d_017453'
})

const player = new Player({
  apiKey: 'mad_live_91b083811d763831033a84c304d7dddcd331b1bbe1452fd1df7052afa1e5e51d_017453'
})

app.get('/score/update', async (c) => {
  const score = await player.submitScore('33c79ab7-ab65-414e-8978-e665d6a07e10', '1580ce23-ecca-446d-9d49-8aad87d59a94', 100, {
    username: "",
    avatarUrl: ""
  })
  return c.json({ score })
})

app.get('/players/create', async (c) => {
  const playerCreated = await player.create('33c79ab7-ab65-414e-8978-e665d6a07e10', "Abderrahmen", "", 0, 0)
  return c.json({ playerCreated })
})

app.get('/leaderboards', async (c) => {
  const response = await lb.getLeaderboards()
  return c.json({ response })
})

app.get('/leaderboards/top', async (c) => {
  const topResponse = await lb.getTop('33c79ab7-ab65-414e-8978-e665d6a07e10', 10)

  return c.json({ topResponse })
})


serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

