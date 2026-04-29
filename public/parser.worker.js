// Web Worker — parse Markdown → Block[] hors du thread principal
// Aucune dépendance, aucun import

function safeParseBlocks(md) {
  if (!md || !md.trim()) return []
  try {
    const lines = md.split('\n')
    const blocks = []
    let i = 0
    while (i < lines.length && blocks.length < 300) {
      const line = lines[i].trim()
      if (!line) { i++; continue }
      if (line.startsWith('## ')) {
        const txt = line.slice(3).trim()
        const id = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || ('h2-' + i)
        blocks.push({ type: 'h2', id, text: { fr: txt, en: txt } }); i++
      } else if (line.startsWith('> ')) {
        blocks.push({ type: 'quote', text: line.slice(2).trim() }); i++
      } else if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'js'
        const codeLines = []; i++; let c = 0
        while (i < lines.length && !lines[i].startsWith('```') && c < 200) { codeLines.push(lines[i]); i++; c++ }
        if (i < lines.length && lines[i].startsWith('```')) i++
        blocks.push({ type: 'code', lang, code: codeLines.join('\n') })
      } else if (line.startsWith('- ')) {
        const items = []; let c = 0
        while (i < lines.length && lines[i].trim().startsWith('- ') && c < 50) { items.push(lines[i].trim().slice(2)); i++; c++ }
        if (items.length) blocks.push({ type: 'list', items })
      } else {
        const paraLines = []; let c = 0
        while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('>') && !lines[i].startsWith('```') && !lines[i].startsWith('- ') && c < 20) {
          paraLines.push(lines[i].trim()); i++; c++
        }
        if (paraLines.length) blocks.push({ type: 'p', text: paraLines.join(' ') })
      }
    }
    return blocks
  } catch (e) { return [] }
}

self.onmessage = function(e) {
  const { id, md } = e.data
  const blocks = safeParseBlocks(md)
  self.postMessage({ id, blocks })
}
