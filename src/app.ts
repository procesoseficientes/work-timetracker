import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import logger from 'morgan'

import IndexRouter from './routes/index'
import UsersRouter from './routes/users'
import ProjectsRouter from './routes/projects'
import DbService from './services/db-service'

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

const dbService = new DbService(process.env.DATABASE_URL)

app.use('/', new IndexRouter(dbService).router)
app.use('/users', new UsersRouter(dbService).router)
app.use('/projects', new ProjectsRouter(dbService).router)

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
