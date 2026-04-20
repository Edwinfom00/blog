import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { db } from '@/db/index'
import {
  authUsers,
  authSessions,
  authAccounts,
  authVerifications,
} from '@/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authUsers,
      session: authSessions,
      account: authAccounts,
      verification: authVerifications,
    },
  }),

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  ],

  plugins: [
    magicLink({
      disableSignUp: true, // seul Edwin peut se connecter
      sendMagicLink: async ({ email, url }) => {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY!)
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
          to: email,
          subject: 'Lien de connexion — Edwin Fom Journal',
          html: `
            <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1A1916;">
              <p style="font-size: 13px; letter-spacing: .1em; text-transform: uppercase; color: #807A70; margin-bottom: 32px;">
                Edwin Fom · Journal
              </p>
              <h1 style="font-size: 28px; font-weight: 400; font-style: italic; margin: 0 0 16px;">
                Ton lien de connexion
              </h1>
              <p style="font-size: 16px; line-height: 1.6; color: #4A4742; margin-bottom: 32px;">
                Clique sur le bouton ci-dessous pour accéder au dashboard. Ce lien expire dans 5 minutes.
              </p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #1A1916; color: #FBF9F5; text-decoration: none; border-radius: 3px; font-size: 14px; letter-spacing: .02em;">
                Accéder au dashboard →
              </a>
              <p style="font-size: 12px; color: #807A70; margin-top: 32px;">
                Si tu n'as pas demandé ce lien, ignore cet email.
              </p>
            </div>
          `,
        })
      },
    }),
  ],
})

export type Session = typeof auth.$Infer.Session
