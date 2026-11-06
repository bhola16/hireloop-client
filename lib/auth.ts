import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient("mongodb://localhost:27017/database")
const db = client.db('hireloopdb')


export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, 
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code highlight]
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // [!code highlight]
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
})
