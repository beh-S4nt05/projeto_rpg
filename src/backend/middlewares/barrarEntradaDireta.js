// middlewares/barrarEntradaDireta.js
const barrarEntradaDireta = (dbConnection) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { user } = req.body

    try {
      if (user) {
        req.user = user
      } else {
        const userExists = await dbConnection.find().UserById(id)
        if (!userExists) {
          return res.status(404).json({ message: 'Usuário não encontrado' })
        }
        req.user = userExists
        if (userExists) {
        } else {
          return res.status(403).json({ message: 'Acesso negado' })
        }
      }
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}

export default barrarEntradaDireta
