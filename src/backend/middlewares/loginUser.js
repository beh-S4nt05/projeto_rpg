// middlewares/loginUser.js
const loginMiddleware = (dbConnection) => {
  return async (req, res, next) => {
    const { username, password } = req.body
    try {
      const user = await dbConnection.find().UserByUsername(username)
      const match = await dbConnection.password().Match(user, password)

      if (!user || !match) {
        return res.status(401).json({ message: 'Credenciais inválidas' })
      }
      req.user = user // Armazena o usuário no objeto req
      if (user) {
        next()
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}

export default loginMiddleware