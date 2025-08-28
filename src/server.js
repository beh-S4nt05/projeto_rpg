import 'module-alias/register.js'
import dotenv from 'dotenv'
import app from './backend/routes/app.js'

dotenv.config()
const { HOST_URL, PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server is running!! 🚀 \n ${HOST_URL}`)
})