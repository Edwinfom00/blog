const text = `# Mon deuxième package npm
Il y a quelques semaines, j'ai publié mon premier package npm.
## Dessiner le pipeline
J'ai identifié quatre problèmes distincts :
- **Les layouts multi-colonnes** → extraction spatiale par coordonnées de bounding box
- **Les PDFs scannés** → fallback OCR automatique avec Tesseract.js
- **Le lock-in fournisseur** → adaptateur model-agnostic via le Vercel AI SDK
- **Le JSON cassé** → réparation automatique + boucle de self-correction avec Zod
Chaque couche est indépendante.`

const res = await fetch('http://localhost:3001/api/dashboard/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fr: text, en: text }),
})
const data = await res.json()
console.log('Status:', res.status)
data.fr?.forEach((b, i) => {
  if (b.type === 'list') {
    console.log(`[${i}] list items:`)
    b.items.forEach(item => console.log('  -', item))
  } else if (b.type === 'p') {
    console.log(`[${i}] p:`, b.text.slice(0, 80))
  } else {
    console.log(`[${i}] ${b.type}`)
  }
})
