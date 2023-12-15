const express = require('express')
const { default: mongoose } = require('mongoose')
const { join } = require('path')
const User = require('./models/users.model')
const passport = require('passport')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const cookieSession = require('cookie-session')
const config = require('config')
const serverConfig = config.get('server')
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')
const productsRouter = require('./routes/product.router')
const port = 4000

const cookieEncryptionKey = process.env.COOKIE_ENCRYPTION_KEY
app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [cookieEncryptionKey],
  }),
)

app.use((request, response, next) => {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb()
    }
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb()
    }
  }
  next()
})

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Connected!')
  })
  .catch((err) => {
    console.log(err)
  })

app.use('/static', express.static(join(__dirname, 'public')))

app.use((error, req, res, next) => {
  // error 처리기
  res.json({ message: error.message })
})

app.use('/', mainRouter)
app.use('/auth', usersRouter)
app.use('/products', productsRouter)

app.listen(port, () => {
  console.log('Server Start - Port =', port)
})
