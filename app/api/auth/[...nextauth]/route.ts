import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clouddrive_db',
  port: parseInt(process.env.DB_PORT || '3306'),
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        let connection
        try {
          connection = await mysql.createConnection(dbConfig)
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          )

          const user = (rows as any[])[0]
          if (!user) {
            return null
          }

          // In a real application, you should hash the password and compare hashes
          // For this example, we're using plain text comparison
          if (credentials.password === user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }
          }

          return null
        } catch (error) {
          console.error('Database error:', error)
          return null
        } finally {
          if (connection) {
            await connection.end()
          }
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST, authOptions } 