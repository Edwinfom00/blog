const md = `# Mon deuxième package npm : ce que j'ai appris en construisant une infrastructure de parsing de CV
Il y a quelques semaines, j'ai publié mon premier package npm. Sept kilo-octets, aucun téléchargement, et cette petite fierté qu'on ressent quand on voit son nom dans le registre officiel.
Cette fois, c'est différent.
\`@edwinfom/resume-intel\` est né d'un problème réel que j'ai rencontré en construisant un outil de recrutement : extraire des données structurées depuis des PDFs de CV est beaucoup plus difficile que ça en a l'air.
## La prémisse
La plupart des outils existants font l'une de deux choses : soit ils utilisent des regex fragiles qui cassent dès qu'un candidat a un CV un peu original, soit ils enveloppent l'API d'un seul fournisseur d'IA et t'enferment dedans pour toujours.
> Un package, c'est moins un produit qu'une infrastructure. Et une infrastructure, ça doit tenir quand ça casse.
J'avais besoin de quelque chose qui tienne en production. Alors j'ai construit un pipeline en trois couches.
## Le vrai problème avec les PDFs
Avant d'écrire une seule ligne de code LLM, j'ai passé du temps à comprendre pourquoi les extracteurs classiques échouent.
Le problème numéro un : les layouts multi-colonnes.
\`\`\`
// Ce que l'extracteur naïf produit
2020 Senior Engineer TypeScript Node.js
2018 Junior Engineer React PostgreSQL
// Ce que resume-intel reconstruit
Senior Engineer 2020 – Present
Junior Engineer 2018 – 2020
---
TypeScript, Node.js
React, PostgreSQL
\`\`\`
La différence entre ces deux outputs, c'est la différence entre une extraction fiable et une hallucination.
## Dessiner le pipeline
J'ai identifié quatre problèmes distincts :
- Les layouts multi-colonnes
- Les PDFs scannés
- Le lock-in fournisseur
- Le JSON cassé
Chaque couche est indépendante.
## L'agnosticisme de modèle
C'est la décision de design dont je suis le plus satisfait.
\`\`\`typescript
const result = await parseResume(buffer, {
  model: createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY })('deepseek-chat'),
})
\`\`\`
Tu changes de modèle sans toucher à rien d'autre.
## Ce que j'ai retenu
Construire resume-intel m'a appris que les problèmes d'infrastructure sont rarement là où on les attend.
\`\`\`bash
npm install @edwinfom/resume-intel ai
\`\`\`
`

function safeParseBlocks(md) {
  if (!md?.trim()) return []
  const lines = md.split('\n')
  const blocks = []
  let i = 0
  const start = Date.now()

  while (i < lines.length && blocks.length < 300) {
    // Sécurité timeout
    if (Date.now() - start > 5000) {
      console.error('TIMEOUT at line', i, ':', JSON.stringify(lines[i]))
      break
    }

    const line = lines[i].trim()
    if (!line) { i++; continue }

    if (line.startsWith('## ')) {
      const txt = line.slice(3).trim()
      const id = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || `h2-${i}`
      blocks.push({ type: 'h2', id, text: { fr: txt, en: txt } }); i++
    } else if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', text: line.slice(2).trim() }); i++
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'js'
      const codeLines = []; i++; let c = 0
      while (i < lines.length && !lines[i].startsWith('```') && c < 200) {
        codeLines.push(lines[i]); i++; c++
      }
      if (i < lines.length && lines[i].startsWith('```')) i++
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') })
    } else if (line.startsWith('- ')) {
      const items = []; let c = 0
      while (i < lines.length && lines[i].trim().startsWith('- ') && c < 50) {
        items.push(lines[i].trim().slice(2)); i++; c++
      }
      if (items.length) blocks.push({ type: 'list', items })
    } else {
      const paraLines = []; let c = 0
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('>') &&
        !lines[i].startsWith('```') &&
        !lines[i].startsWith('- ') &&
        c < 20
      ) {
        paraLines.push(lines[i].trim()); i++; c++
      }
      if (paraLines.length) blocks.push({ type: 'p', text: paraLines.join(' ') })
    }
  }
  return blocks
}

console.log('Testing parser...')
const t0 = Date.now()
const blocks = safeParseBlocks(md)
const elapsed = Date.now() - t0

console.log(`\nDone in ${elapsed}ms — ${blocks.length} blocks:\n`)
blocks.forEach((b, i) => {
  if (b.type === 'p') console.log(`[${i}] p: "${b.text.slice(0, 60)}..."`)
  else if (b.type === 'h2') console.log(`[${i}] h2: "${b.text.fr}"`)
  else if (b.type === 'quote') console.log(`[${i}] quote: "${b.text.slice(0, 60)}"`)
  else if (b.type === 'code') console.log(`[${i}] code(${b.lang}): ${b.code.split('\n').length} lines`)
  else if (b.type === 'list') console.log(`[${i}] list: ${b.items.length} items`)
})
