import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import logger from 'morgan'

import IndexRoutes from './routes/IndexRoutes'
import UsersRoutes from './routes/UsersRoutes'
import StatsRoutes from './routes/StatsRoutes'
import ProjectsRoutes from './routes/ProjectsRoutes'
import LoginRoutes from './routes/LoginRoutes'

import session from 'express-session'
import OwnersRoutes from './routes/OwnersRoutes'
import DetailRoutes from './routes/DetailRoutes'
import TeamRoutes from './routes/TeamRoutes'
import { Client } from 'pg'
import TypesRoutes from './routes/TypesRoutes'

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  resave: true,
	saveUninitialized: true
}))

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL ? {
    rejectUnauthorized: false
  } : false
})
pgClient.connect().catch((err) => {
  console.error(err)
})

app.use('/', new IndexRoutes(pgClient).router)
app.use('/login', new LoginRoutes(pgClient).router)
app.use('/users', new UsersRoutes(pgClient).router)
app.use('/stats', new StatsRoutes(pgClient).router)
app.use('/owners', new OwnersRoutes(pgClient).router)
app.use('/detail', new DetailRoutes(pgClient).router)
app.use('/team', new TeamRoutes(pgClient).router)
app.use('/projects', new ProjectsRoutes(pgClient).router)
app.use('/types', new TypesRoutes(pgClient).router)

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
