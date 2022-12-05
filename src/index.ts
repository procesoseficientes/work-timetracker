import app from './app'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const port = process.env.PORT || '9998'

app.listen(port, () => {
  console.log(`App listening on the http://localhost:${port}`)
})	