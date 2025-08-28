// middlewares/cadastroUser.js
const cadastroMiddleware = (dbConnection) => {
  return async (req, res, next) => {
    const { username, name, password, co_password, email, phone } = req.body

    try {
      if (password !== co_password) {
        return res.status(400).json({ message: 'Senhas não coincidem' })
      }
      const userExists = await dbConnection.find().UserByUsername(username)
      if (userExists) {
        return res.status(409).json({ message: 'Usuário já existe' })
      }
      const newUser = await dbConnection.create().User({ username, name, password, email, phone })
      req.user = newUser
      if (newUser) {
        next()
      }
    } catch (error) {
      console.error('Erro no middleware de cadastro:', error)
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}

export default cadastroMiddleware