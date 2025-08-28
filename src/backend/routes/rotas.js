// Rotas.js
import express from 'express'
import db_prisma_conected from '../model/index.js' // Importa a instância do banco de dados
import middlewares from '../middlewares/index.js' // Importa os middlewares

const router = express.Router()
router.use(express.json())

// Instancia os middlewares com a conexão do banco de dados
const {
  loginMiddleware,
  cadastroMiddleware,
  barrarEntradaDireta
} = middlewares(db_prisma_conected)

// Rotas Públicas
router.get('/', (req, res) => res.redirect('/cadastro'))
router.get('/cadastro', (req, res) => res.render('cadastro'))

// Rotas de Login e Cadastro
router.post('/login', loginMiddleware, (req, res, next) => res.json(
  {
    url: `/user/${req.user.id}`,
    message: 'Login efetuado com sucesso',
    user: req.user
  }
))

router.post('/cadastro', cadastroMiddleware, (req, res, next) => res.json(
  {
    url: `/user/${req.user.id}`,
    message: 'Cadastro efetuado com sucesso',
    user: req.user
  }
))

// Rotas Protegidas
router.get('/user/:id', barrarEntradaDireta, (req, res, next) => {
  res.render('index', {
    user: req.user
  })
})

router.post('/user/:id', barrarEntradaDireta, (req, res, next) => res.render('index'))

// Tratamento de Erros
router.get('/error/:code', (req, res) => res.render('error', {
  errorCode: req.params.code
}))

// Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}]`, err)
  res.status(500).render('error', {
    errorCode: 'INTERNAL_ERROR'
  })
})

export default router