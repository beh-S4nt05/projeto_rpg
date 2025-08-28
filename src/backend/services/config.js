const PORT = process.env.PORT
const HOST = process.env.HOST
const PORT_NAME = process.env.PORT_NAME
const HOST_NAME = process.env.HOST_NAME
const apiKey = process.env.API_KEY
const authDomain = process.env.AUTH_DOMAIN
const projectId = process.env.PROJECT_ID
const storageBucket = process.env.STORAGE_BUCKET
const messagingSenderId = process.env.MESSAGING_SENDER_ID
const appId = process.env.APP_ID

const firebase = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
}

export default {
  PORT,
  HOST,
  PORT_NAME,
  HOST_NAME,
  firebase
}