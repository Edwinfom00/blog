import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    /*
     * Applique next-intl uniquement aux routes publiques localisées.
     * Exclut :
     *  - /api/*          → routes API
     *  - /dashboard/*    → dashboard (pas localisé, protégé par BetterAuth)
     *  - /login          → page de connexion
     *  - /_next/*        → assets Next.js
     *  - /.*\\..*        → fichiers statiques (favicon, images…)
     */
    '/((?!api|dashboard|login|_next|_vercel|.*\\..*).*)',
  ],
}
