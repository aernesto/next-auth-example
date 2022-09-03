import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
import neo4j from "neo4j-driver"
import { Neo4jAdapter } from "@next-auth/neo4j-adapter"

const driver = neo4j.driver(
  process.env.DATABASE_URL,
  neo4j.auth.basic(process.env.DB_USER, process.env.DB_PWD)
)

const neo4jSession = driver.session({ database: 'neo4j' })

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: Neo4jAdapter(neo4jSession),
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
