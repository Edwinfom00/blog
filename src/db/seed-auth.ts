/**
 * Crée le compte Edwin dans la table users pour BetterAuth.
 * À exécuter une seule fois : npm run db:seed-auth
 */
import 'dotenv/config'
import { db } from './index'
import { authUsers } from './schema'
import { randomUUID } from 'crypto'

async function seedAuth() {
  const email = process.env.ADMIN_EMAIL ?? 'edwinfom05@gmail.com'

  const existing = await db.select().from(authUsers)
  if (existing.length > 0) {
    console.log('✓ Compte admin déjà existant :', existing[0].email)
    process.exit(0)
  }

  await db.insert(authUsers).values({
    id: randomUUID(),
    name: 'Edwin Fom',
    email,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log('✓ Compte admin créé :', email)
  process.exit(0)
}

seedAuth().catch(e => { console.error(e); process.exit(1) })
