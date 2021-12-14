import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],

  session: {
    jwt: true,
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },

  jwt: {
    secret: process.env.SECRET,
  },

  callbacks: {
    signIn: async ({account, user, profile}) => {
      // When the user signs in fetch the github primary email 
      if (account.provider === 'github') {
        const res = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `token ${account.access_token}` },
        })
        const emails = await res.json()
        if (emails?.length > 0) {
          user.email = emails.sort((a, b) => b.primary - a.primary)[0].email
        }
        user.profile = profile
        return true
      }
    },
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: async ({session, token}) => {
      session.user = token.user
      return session
    }
  },

  theme: 'light',

  debug: false,
})
