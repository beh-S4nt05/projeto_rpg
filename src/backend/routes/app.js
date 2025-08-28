// App.js
import express from 'express'
import path from 'path'
import router from './rotas.js'
// import { v6 as uuidv6 } from 'uuid'

const app = express()
const __dirname = path.resolve('src')

// app.use(
//   session({
//     secret: uuidv6(),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true in production with HTTPS
//   })
// )

// Middleware para analisar JSON
app.use(express.json())

// Set EJS as templating engine
app.set('views', path.join(__dirname, 'frontend', 'views'))
app.set('view engine', 'ejs')

// Set Folder 'Static' 
app.use('/', express.static(__dirname))

// Set static files
app.use('/static', express.static(path.join(__dirname, 'frontend', 'static')))
app.use('/css', express.static(path.join(__dirname, 'frontend', 'static', 'css')))
app.use('/img', express.static(path.join(__dirname, 'frontend', 'static', 'img')))
app.use('/js', express.static(path.join(__dirname, 'frontend', 'static', 'js')))
app.use('/views', express.static(path.join(__dirname, 'frontend', 'views')))
app.use('/modules', express.static(path.join(__dirname, 'frontend', 'static', 'modules')))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
  next()
})

// Use router for routing
app.use(router)

export default app