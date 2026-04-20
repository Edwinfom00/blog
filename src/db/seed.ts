/**
 * Seed — importe les 6 articles et 6 projets du prototype HTML
 * Exécuter : npx tsx src/db/seed.ts
 */
import 'dotenv/config'
import { db } from './index'
import { articles, tocItems, articleTags, projects } from './schema'
import type { Block } from './schema'

/* ─── ARTICLES ─── */
const ARTICLES_DATA = [
  {
    slug: 'shipping-my-first-npm-package',
    issue: 14,
    date: '2026-04-11',
    readMin: 9,
    featured: true,
    titleFr: "J'ai publié mon premier package npm — et personne ne s'en fout",
    titleEn: "I shipped my first npm package — and no one should care",
    dekFr: "Notes honnêtes après trois semaines passées à extraire un bout de code d'un projet pour le donner au reste du monde. Le code n'était pas le problème.",
    dekEn: "Honest notes after three weeks spent extracting a chunk of code from a project to hand it over to the rest of the world. The code wasn't the problem.",
    toc: [
      { anchorId: 'premisse', labelFr: 'La prémisse', labelEn: 'The premise' },
      { anchorId: 'extraction', labelFr: "L'extraction", labelEn: 'The extraction' },
      { anchorId: 'api', labelFr: "Dessiner l'API publique", labelEn: 'Designing a public API' },
      { anchorId: 'semver', labelFr: "Semver n'est pas un choix", labelEn: "Semver isn't a choice" },
      { anchorId: 'apres', labelFr: 'Après le premier 1.0.0', labelEn: 'Life after 1.0.0' },
    ],
    tags: [
      { nameFr: 'npm', nameEn: 'npm' },
      { nameFr: 'open-source', nameEn: 'open-source' },
      { nameFr: 'outils', nameEn: 'tooling' },
    ],
    bodyFr: [
      { type: 'p', text: "Il y a trois semaines, j'ai publié mon premier package sur npm. Sept kilo-octets, aucun téléchargement, et cette petite fierté qu'on ressent quand on voit son nom dans le registre officiel. J'ai mis plus de temps à choisir le nom qu'à écrire le code." },
      { type: 'p', text: "Je voulais extraire un hook React que j'utilisais dans deux projets différents — <code>useViewTransition</code>. Rien d'extraordinaire : une sucrerie autour de l'API native du navigateur, avec une gestion propre des fallback." },
      { type: 'h2', id: 'premisse', text: { fr: 'La prémisse', en: 'The premise' } },
      { type: 'p', text: "Publier un package, c'est écrire un contrat. Tu promets à une poignée d'inconnus que ton bout de code ne va pas casser leur build samedi à deux heures du matin." },
      { type: 'quote', text: 'Un package, c\'est moins un produit qu\'une relation.' },
      { type: 'h2', id: 'extraction', text: { fr: "L'extraction", en: 'The extraction' } },
      { type: 'p', text: "La première tâche, c'est l'archéologie. Retrouver toutes les variables implicites, toutes les dépendances croisées, tous les petits <code>// TODO</code> qu'on s'était juré de nettoyer." },
      { type: 'code', lang: 'ts', code: "// Avant\nexport function useViewTransition(router) {\n  const route = router.current;\n}\n\n// Après\nexport function useViewTransition(\n  callback: () => void | Promise<void>,\n  options?: { skip?: boolean }\n) {\n  if (options?.skip || !document.startViewTransition) {\n    return callback();\n  }\n  return document.startViewTransition(callback);\n}" },
      { type: 'h2', id: 'api', text: { fr: "Dessiner l'API publique", en: 'Designing a public API' } },
      { type: 'list', items: ['Une fonction, un travail', 'Les booléens sont des pièges', 'Les types exportés comptent autant que les valeurs', 'Un README court vaut mieux qu\'un long'] },
      { type: 'h2', id: 'semver', text: { fr: "Semver n'est pas un choix", en: "Semver isn't a choice" } },
      { type: 'p', text: "J'ai voulu faire le malin et publier en <code>0.1.0</code>. Un mainteneur m'a rappelé qu'un 1.0.0 honnête est toujours mieux qu'un 0.9.9 timide." },
      { type: 'h2', id: 'apres', text: { fr: 'Après le premier 1.0.0', en: 'Life after 1.0.0' } },
      { type: 'p', text: "Le code est la partie facile. Le vrai travail commence après : répondre aux issues, décider quand dire non. Un package publié, c'est un être vivant." },
    ] as Block[],
    bodyEn: [
      { type: 'p', text: "Three weeks ago, I shipped my first npm package. Seven kilobytes, zero downloads, and that small pride of seeing your name in the official registry." },
      { type: 'h2', id: 'premisse', text: { fr: 'La prémisse', en: 'The premise' } },
      { type: 'p', text: "Publishing a package is writing a contract. You promise a handful of strangers that your bit of code won't break their build on Saturday at 2am." },
      { type: 'quote', text: "A package is less a product than a relationship." },
      { type: 'h2', id: 'extraction', text: { fr: "L'extraction", en: 'The extraction' } },
      { type: 'code', lang: 'ts', code: "// Before\nexport function useViewTransition(router) {}\n\n// After\nexport function useViewTransition(\n  callback: () => void | Promise<void>,\n  options?: { skip?: boolean }\n) {\n  if (options?.skip || !document.startViewTransition) return callback();\n  return document.startViewTransition(callback);\n}" },
      { type: 'h2', id: 'api', text: { fr: "Dessiner l'API publique", en: 'Designing a public API' } },
      { type: 'list', items: ['One function, one job', 'Booleans are traps', 'Exported types matter as much as values', 'A short README beats a long one'] },
      { type: 'h2', id: 'semver', text: { fr: "Semver n'est pas un choix", en: "Semver isn't a choice" } },
      { type: 'p', text: "An honest 1.0.0 beats a timid 0.9.9." },
      { type: 'h2', id: 'apres', text: { fr: 'Après le premier 1.0.0', en: 'Life after 1.0.0' } },
      { type: 'p', text: "Code is the easy part. Documentation is the product. Examples beat a thousand prop types." },
    ] as Block[],
  },
  {
    slug: 'rewriting-my-portfolio-for-the-fifth-time',
    issue: 13,
    date: '2026-03-22',
    readMin: 12,
    featured: true,
    titleFr: 'Réécrire mon portfolio pour la cinquième fois',
    titleEn: 'Rewriting my portfolio for the fifth time',
    dekFr: "Chaque version détruit quelque chose que j'aimais et ajoute une chose que je regretterai.",
    dekEn: "Each rewrite kills something I loved and adds something I'll regret.",
    toc: [
      { anchorId: 'archeologie', labelFr: 'Archéologie personnelle', labelEn: 'Personal archaeology' },
      { anchorId: 'contraintes', labelFr: 'Contraintes que je me fixe', labelEn: 'Self-imposed constraints' },
      { anchorId: 'typographie', labelFr: 'La typographie fait le travail', labelEn: 'Typography does the heavy lifting' },
      { anchorId: 'accessibilite', labelFr: "Accessibilité n'est pas négociable", labelEn: "Accessibility isn't negotiable" },
    ],
    tags: [
      { nameFr: 'portfolio', nameEn: 'portfolio' },
      { nameFr: 'design', nameEn: 'design' },
      { nameFr: 'personnel', nameEn: 'personal' },
    ],
    bodyFr: [
      { type: 'p', text: "J'ai réécrit mon portfolio cinq fois en quatre ans. Chaque fois, je me jure que c'est la dernière." },
      { type: 'h2', id: 'archeologie', text: { fr: 'Archéologie personnelle', en: 'Personal archaeology' } },
      { type: 'p', text: "La première version était un template Next.js. La cinquième — celle-ci — tient sur une page." },
      { type: 'quote', text: "Chaque portfolio est une lettre à toi-même dans six mois." },
      { type: 'h2', id: 'contraintes', text: { fr: 'Contraintes que je me fixe', en: 'Self-imposed constraints' } },
      { type: 'list', items: ['Zéro JavaScript côté client par défaut', 'Aucune image au-dessus de la ligne de flottaison', 'Largeur de lecture maximale : 680 pixels'] },
      { type: 'h2', id: 'typographie', text: { fr: 'La typographie fait le travail', en: 'Typography does the heavy lifting' } },
      { type: 'p', text: "Quand tu retires les couleurs criardes — il reste la typographie. Et c'est beaucoup." },
      { type: 'code', lang: 'css', code: ":root {\n  --step-0: clamp(1rem, .93rem + .35vw, 1.25rem);\n  --step-1: clamp(1.25rem, 1.14rem + .57vw, 1.6rem);\n  --step-2: clamp(1.56rem, 1.38rem + .9vw, 2.1rem);\n}" },
      { type: 'h2', id: 'accessibilite', text: { fr: "Accessibilité n'est pas négociable", en: "Accessibility isn't negotiable" } },
      { type: 'p', text: "Un portfolio inaccessible raconte une chose sur toi avant que tu n'aies dit un mot. La sixième version arrivera." },
    ] as Block[],
    bodyEn: [
      { type: 'p', text: "I've rewritten my portfolio five times in four years. Each time I swear it's the last." },
      { type: 'h2', id: 'archeologie', text: { fr: 'Archéologie personnelle', en: 'Personal archaeology' } },
      { type: 'p', text: "V1 was a Next.js template. V5 — this one — fits on a single page." },
      { type: 'quote', text: "Every portfolio is a letter to yourself six months from now." },
      { type: 'h2', id: 'contraintes', text: { fr: 'Contraintes que je me fixe', en: 'Self-imposed constraints' } },
      { type: 'list', items: ['Zero client JavaScript by default', 'No image above the fold', 'Max reading width: 680 pixels'] },
      { type: 'h2', id: 'typographie', text: { fr: 'La typographie fait le travail', en: 'Typography does the heavy lifting' } },
      { type: 'p', text: "When you strip away garish colors, typography remains. And it's enough." },
      { type: 'h2', id: 'accessibilite', text: { fr: "Accessibilité n'est pas négociable", en: "Accessibility isn't negotiable" } },
      { type: 'p', text: "An inaccessible portfolio says something about you before you've said a word. V6 will come." },
    ] as Block[],
  },
  {
    slug: 'view-transitions-api-one-year-in',
    issue: 12,
    date: '2026-02-18',
    readMin: 7,
    featured: false,
    titleFr: 'View Transitions, un an plus tard',
    titleEn: 'View Transitions, one year in',
    dekFr: "J'ai passé l'année à remplacer Framer Motion par trois lignes de CSS.",
    dekEn: "I spent a year replacing Framer Motion with three lines of CSS.",
    toc: [
      { anchorId: 'idee', labelFr: "L'idée", labelEn: 'The idea' },
      { anchorId: 'pratique', labelFr: 'En pratique', labelEn: 'In practice' },
      { anchorId: 'pieges', labelFr: 'Pièges', labelEn: 'Gotchas' },
    ],
    tags: [
      { nameFr: 'web', nameEn: 'web' },
      { nameFr: 'api', nameEn: 'api' },
      { nameFr: 'animation', nameEn: 'animation' },
    ],
    bodyFr: [
      { type: 'p', text: "J'ai passé la dernière année à remplacer des bibliothèques d'animation par trois lignes de CSS." },
      { type: 'h2', id: 'idee', text: { fr: "L'idée", en: 'The idea' } },
      { type: 'p', text: "L'API View Transitions te laisse animer entre deux états du DOM." },
      { type: 'code', lang: 'css', code: "::view-transition-old(root),\n::view-transition-new(root) {\n  animation-duration: .3s;\n}" },
      { type: 'h2', id: 'pratique', text: { fr: 'En pratique', en: 'In practice' } },
      { type: 'p', text: "Tu <code>startViewTransition(() => { /* mutations */ })</code> et tu laisses le navigateur faire." },
      { type: 'h2', id: 'pieges', text: { fr: 'Pièges', en: 'Gotchas' } },
      { type: 'list', items: ['Safari n\'est pas encore de la partie (avril 2026)', '<code>view-transition-name</code> doit être unique sur la page'] },
    ] as Block[],
    bodyEn: [
      { type: 'p', text: "I spent the last year swapping animation libraries for three lines of CSS." },
      { type: 'h2', id: 'idee', text: { fr: "L'idée", en: 'The idea' } },
      { type: 'code', lang: 'css', code: "::view-transition-old(root),\n::view-transition-new(root) {\n  animation-duration: .3s;\n}" },
      { type: 'h2', id: 'pratique', text: { fr: 'En pratique', en: 'In practice' } },
      { type: 'p', text: "You <code>startViewTransition(() => { /* mutations */ })</code> and let the browser handle it." },
      { type: 'h2', id: 'pieges', text: { fr: 'Pièges', en: 'Gotchas' } },
      { type: 'list', items: ['Safari isn\'t in yet (April 2026)', '<code>view-transition-name</code> must be unique during transition'] },
    ] as Block[],
  },
]

/* ─── PROJECTS ─── */
const PROJECTS_DATA = [
  {
    slug: 'portfolio',
    name: 'edwinfom.dev',
    year: '2026',
    url: 'https://www.edwinfom.dev/',
    kindFr: 'Portfolio',
    kindEn: 'Portfolio',
    descFr: 'Cinquième itération. Écrit en Astro, déployé en trois secondes.',
    descEn: 'Fifth iteration. Written in Astro, deployed in three seconds.',
    tags: ['Astro', 'Tailwind', 'Vercel'],
    status: 'live' as const,
    sortOrder: 1,
  },
  {
    slug: 'packages',
    name: 'packages.edwinfom.dev',
    year: '2026',
    url: 'https://packages.edwinfom.dev/',
    kindFr: 'Monorepo',
    kindEn: 'Monorepo',
    descFr: 'Un hub pour les petits paquets npm que je publie — utilitaires React, hooks, helpers typographiques.',
    descEn: 'A hub for the small npm packages I publish — React utilities, hooks, typography helpers.',
    tags: ['pnpm', 'changesets', 'TypeScript'],
    status: 'live' as const,
    sortOrder: 2,
  },
  {
    slug: 'journal',
    name: 'journal.edwinfom.dev',
    year: '2026',
    url: '#',
    kindFr: 'Blog',
    kindEn: 'Blog',
    descFr: 'Ce journal. Écrit en Next.js, compagnon IA contextuel intégré.',
    descEn: 'This journal. Built with Next.js, with a contextual AI companion.',
    tags: ['Next.js', 'Drizzle', 'AI'],
    status: 'new' as const,
    sortOrder: 3,
  },
  {
    slug: 'tinykit',
    name: '@edwinfom/tinykit',
    year: '2025',
    url: '#',
    kindFr: 'Package npm',
    kindEn: 'npm package',
    descFr: 'Primitives React sans dépendances : useFocusTrap, usePress, useViewTransition. Moins de 3kb.',
    descEn: 'Zero-dep React primitives: useFocusTrap, usePress, useViewTransition. Under 3kb.',
    tags: ['React', 'TypeScript', '0-dep'],
    status: 'live' as const,
    sortOrder: 4,
  },
  {
    slug: 'type-scale',
    name: '@edwinfom/type-scale',
    year: '2025',
    url: '#',
    kindFr: 'Package npm',
    kindEn: 'npm package',
    descFr: 'Un générateur d\'échelles typographiques modulaires, pensé pour CSS et Tailwind.',
    descEn: 'A modular type-scale generator, designed for CSS and Tailwind.',
    tags: ['Design tokens', 'CSS'],
    status: 'live' as const,
    sortOrder: 5,
  },
  {
    slug: 'writing-machine',
    name: 'writing-machine',
    year: '2025',
    url: '#',
    kindFr: 'Expérience',
    kindEn: 'Experiment',
    descFr: 'Un éditeur markdown minimaliste. Plein écran, sans menu, sans autocomplétion.',
    descEn: 'A minimalist markdown editor. Full screen, no menu, no autocomplete.',
    tags: ['Editor', 'Personal'],
    status: 'wip' as const,
    sortOrder: 6,
  },
]

async function seed() {
  console.log('🌱 Seed en cours…')

  /* ─── Nettoyer ─── */
  await db.delete(articleTags)
  await db.delete(tocItems)
  await db.delete(articles)
  await db.delete(projects)

  /* ─── Articles ─── */
  for (const data of ARTICLES_DATA) {
    const { toc, tags, bodyFr, bodyEn, ...articleData } = data

    const [inserted] = await db
      .insert(articles)
      .values({ ...articleData, bodyFr, bodyEn, published: true })
      .returning()

    if (toc.length > 0) {
      await db.insert(tocItems).values(
        toc.map((item, i) => ({ ...item, articleId: inserted.id, sortOrder: i }))
      )
    }

    if (tags.length > 0) {
      await db.insert(articleTags).values(
        tags.map(tag => ({ ...tag, articleId: inserted.id }))
      )
    }

    console.log(`  ✓ Article №${inserted.issue} — ${inserted.titleFr.slice(0, 40)}…`)
  }

  /* ─── Projects ─── */
  await db.insert(projects).values(PROJECTS_DATA)
  console.log(`  ✓ ${PROJECTS_DATA.length} projets insérés`)

  console.log('✅ Seed terminé !')
  process.exit(0)
}

seed().catch(e => {
  console.error('❌ Erreur seed :', e)
  process.exit(1)
})
