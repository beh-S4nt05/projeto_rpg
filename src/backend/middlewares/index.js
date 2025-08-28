import loginMiddleware from './loginUser.js'
import cadastroMiddleware from './cadastroUser.js'
import barrarEntradaDireta from './barrarEntradaDireta.js'

const middlewares = (db) => {
  return {
    loginMiddleware: loginMiddleware(db),
    cadastroMiddleware: cadastroMiddleware(db),
    barrarEntradaDireta: barrarEntradaDireta(db)
  }
}

export default middlewares