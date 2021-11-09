import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import logger from 'morgan'
import session from 'express-session'
import exphbs from 'express-handlebars'
import fs from 'fs'

declare module 'express-session' {
  export interface SessionData {
    user: string;
    roleId: number;
  }
}

import { IndexRoutes } from './routes/IndexRoutes'
import { UsersRoutes } from './routes/UsersRoutes'

import { StatsRoutes } from './routes/StatsRoutes'
import { ProjectsRoutes } from './routes/ProjectsRoutes'
import { LoginRoutes } from './routes/LoginRoutes'
import { OwnersRoutes } from './routes/OwnersRoutes'
import { DetailRoutes } from './routes/DetailRoutes'
import { TeamRoutes } from './routes/TeamRoutes'
import { Client } from 'pg'
import { TypesRoutes } from './routes/TypesRoutes'
import { RolesRoutes } from './routes/RolesRoutes'
import { ChangeLogRoutes } from './routes/ChangeLogRoutes'

const app = express()

// view engine setup
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  helpers: {
    json: (context: string) => JSON.stringify(context)
  }
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

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
  ssl: { rejectUnauthorized: false }
})
pgClient.connect().catch((err) => {
  console.error(err)
})

app.use('/', IndexRoutes(pgClient))
app.use('/login', LoginRoutes(pgClient))
app.use('/users', UsersRoutes(pgClient))
app.use('/stats', StatsRoutes(pgClient))
app.use('/owners', OwnersRoutes(pgClient))
app.use('/detail', DetailRoutes(pgClient))
app.use('/team', TeamRoutes(pgClient))
app.use('/projects', ProjectsRoutes(pgClient))
app.use('/types', TypesRoutes(pgClient))
app.use('/roles', RolesRoutes(pgClient))

const changeLogMD = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md'), 'utf8')
app.use('/changelog', ChangeLogRoutes(pgClient, changeLogMD))

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404))
})

// error handler
app.use((err: {message: string, status: number}, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', {message: err.message, status: err.status})
})

export default app
