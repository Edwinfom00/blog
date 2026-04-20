/* Shared components: Nav, Footer, CodeBlock, Tag, Rule */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* Simple syntax highlighter — minimal, no deps */
function highlight(code, lang) {
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let html = escape(code);
  const keywords = /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|new|async|await|try|catch|throw|this|null|undefined|true|false|interface|type|as|void|never|extends|implements|public|private|protected|static|readonly)\b/g;
  const types = /\b(string|number|boolean|any|Promise|Array|Record|Map|Set)\b/g;
  html = html
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-c">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-c">$1</span>')
    .replace(/(["'`])((?:\\.|(?!\1).)*)\1/g, '<span class="tok-s">$1$2$1</span>')
    .replace(keywords, '<span class="tok-k">$1</span>')
    .replace(types, '<span class="tok-t">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-n">$1</span>')
    .replace(/^([-+])/gm, '<span class="tok-diff">$1</span>');
  return html;
}

const CodeBlock = ({ code, lang = "js" }) => {
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  return (
    <figure className="code-fig" data-lang={lang}>
      <header className="code-head">
        <span className="code-lang">{lang}</span>
        <button className="code-copy" onClick={doCopy} aria-label="Copy code">
          <Icon name={copied ? "check" : "copy"} size={13} />
          <span>{copied ? "Copié" : "Copier"}</span>
        </button>
      </header>
      <pre className="code-body"><code dangerouslySetInnerHTML={{__html: highlight(code, lang)}} /></pre>
      <style>{`
        .code-fig {
          margin: 1.8em 0;
          border: 1px solid var(--rule);
          border-radius: 4px;
          background: var(--surface);
          overflow: hidden;
          font-family: var(--font-mono);
          font-size: 13.5px;
          line-height: 1.65;
        }
        [data-code-style="minimal"] .code-fig {
          border: none;
          border-left: 2px solid var(--accent);
          border-radius: 0;
          background: transparent;
        }
        [data-code-style="paper"] .code-fig {
          background: var(--bg-tint);
          border-color: var(--rule);
        }
        [data-code-style="terminal"] .code-fig {
          background: #0B0B0A;
          color: #EEEAE0;
          border: none;
          border-radius: 6px;
        }
        [data-code-style="terminal"] .code-lang,
        [data-code-style="terminal"] .code-copy { color: #9B958A; }
        [data-code-style="terminal"] .code-head { border-bottom-color: #242220; }
        [data-code-style="terminal"] .tok-k { color: #E89268; }
        [data-code-style="terminal"] .tok-s { color: #C4B68A; }
        [data-code-style="terminal"] .tok-c { color: #6A665B; font-style: italic; }
        [data-code-style="terminal"] .tok-t { color: #8FB8A8; }
        [data-code-style="terminal"] .tok-n { color: #D8A878; }

        .code-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 14px;
          border-bottom: 1px solid var(--rule);
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        [data-code-style="minimal"] .code-head { display: none; }
        .code-copy {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 8px; border-radius: 3px;
          transition: background .15s, color .15s;
          font-size: 11px;
          letter-spacing: .04em;
          text-transform: none;
        }
        .code-copy:hover { background: var(--rule-soft); color: var(--ink); }
        .code-body {
          margin: 0; padding: 16px 18px;
          overflow-x: auto;
          color: var(--ink);
        }
        [data-code-style="minimal"] .code-body { padding-left: 18px; }
        .tok-k { color: var(--accent); font-weight: 500; }
        .tok-s { color: #6B8E4E; }
        [data-mode="dark"] .tok-s { color: #A7C08B; }
        .tok-c { color: var(--ink-mute); font-style: italic; }
        .tok-t { color: #0E7C96; }
        [data-mode="dark"] .tok-t { color: #7DC3D4; }
        .tok-n { color: var(--accent); }
        .tok-diff { color: var(--accent); }
      `}</style>
    </figure>
  );
};

const Rule = ({ ornament = false }) => (
  <div className="rule-wrap" aria-hidden>
    {ornament ? (
      <div className="rule-orn">
        <span className="line" />
        <span className="dia">◆</span>
        <span className="line" />
      </div>
    ) : <span className="line line-plain" />}
    <style>{`
      .rule-wrap { width: 100%; display:flex; justify-content:center; margin: 3.5em 0; }
      .rule-orn { display:flex; align-items:center; gap: 14px; color: var(--ink-mute); width: 220px; }
      .rule-orn .line { flex:1; height:1px; background: var(--rule); }
      .rule-orn .dia { font-size: 10px; }
      .line-plain { width: 100%; max-width: 860px; height: 1px; background: var(--rule); }
    `}</style>
  </div>
);

/* ============================================================
   NAV
   ============================================================ */
const Nav = ({ t, route, go, onSearch, lang, setLang, mode, toggleMode }) => {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="brand" onClick={() => go({name:"home"})}>
          <span className="brand-mark">EF</span>
          <span className="brand-name">Edwin Fom</span>
          <span className="brand-sub">— {t.est}</span>
        </button>

        <div className="nav-center">
          <button className={"nav-link" + (route.name === "home" ? " active" : "")} onClick={() => go({name:"home"})}>
            {t.nav_writing === "Journal" ? "Accueil" : "Home"}
          </button>
          <button className={"nav-link" + (route.name === "index" ? " active" : "")} onClick={() => go({name:"index"})}>
            {t.nav_writing}
          </button>
          <button className={"nav-link" + (route.name === "projects" ? " active" : "")} onClick={() => go({name:"projects"})}>
            {t.nav_projects}
          </button>
        </div>

        <div className="nav-right">
          <button className="nav-icon" onClick={onSearch} title={t.nav_search}>
            <Icon name="search" size={15} />
            <kbd>⌘K</kbd>
          </button>
          <button className="nav-icon ghost" onClick={() => setLang(lang === "fr" ? "en" : "fr")} title="Language">
            <span className="lang-pill">{lang.toUpperCase()}</span>
          </button>
          <button className="nav-icon ghost" onClick={toggleMode} title="Mode">
            <Icon name={mode === "dark" ? "sun" : "moon"} size={15} />
          </button>
        </div>
      </div>
      <style>{`
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: color-mix(in oklab, var(--bg) 85%, transparent);
          backdrop-filter: saturate(1.2) blur(14px);
          -webkit-backdrop-filter: saturate(1.2) blur(14px);
          border-bottom: 1px solid var(--rule);
        }
        .nav-inner {
          max-width: 1240px; margin: 0 auto;
          padding: 14px 32px;
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
          gap: 20px;
        }
        .brand {
          display: inline-flex; align-items: baseline; gap: 10px;
          padding: 0; font-family: var(--font-display);
          font-size: 22px; line-height: 1;
          color: var(--ink);
        }
        .brand-mark {
          display: inline-grid; place-items: center;
          width: 30px; height: 30px;
          border: 1px solid var(--ink);
          border-radius: 50%;
          font-family: var(--font-display);
          font-size: 13px; letter-spacing: .02em;
          line-height: 1;
        }
        .brand-name { font-style: italic; }
        .brand-sub { font-family: var(--font-ui); font-size: 11px; color: var(--ink-mute); letter-spacing: .04em; }
        .nav-center { display:flex; gap: 4px; justify-content: center; }
        .nav-link {
          padding: 7px 14px;
          font-size: 13px;
          letter-spacing: .01em;
          color: var(--ink-soft);
          border-radius: 3px;
          transition: color .15s, background .15s;
          position: relative;
        }
        .nav-link:hover { color: var(--ink); }
        .nav-link.active { color: var(--ink); }
        .nav-link.active::after {
          content: ""; position: absolute;
          left: 14px; right: 14px; bottom: 2px;
          height: 1px; background: var(--accent);
        }
        .nav-right { display: flex; gap: 4px; justify-content: flex-end; align-items: center; }
        .nav-icon {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 10px;
          border: 1px solid var(--rule);
          border-radius: 3px;
          font-size: 12px;
          color: var(--ink-soft);
          background: var(--surface);
          transition: all .15s;
        }
        .nav-icon:hover { color: var(--ink); border-color: var(--ink-mute); }
        .nav-icon.ghost { border-color: transparent; background: transparent; padding: 7px 8px; }
        .nav-icon.ghost:hover { background: var(--rule-soft); }
        .nav-icon kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 1px 4px;
          background: var(--rule-soft);
          border-radius: 2px;
          color: var(--ink-mute);
        }
        .lang-pill {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: .08em;
          padding: 3px 7px;
          border: 1px solid var(--rule);
          border-radius: 2px;
        }
        @media (max-width: 720px) {
          .nav-inner { grid-template-columns: 1fr auto; padding: 12px 16px; }
          .nav-center { display: none; }
          .brand-sub { display: none; }
          .nav-icon kbd { display: none; }
        }
      `}</style>
    </nav>
  );
};

/* ============================================================
   FOOTER
   ============================================================ */
const Footer = ({ t, lang }) => (
  <footer className="foot">
    <div className="foot-inner">
      <div className="foot-col">
        <div className="foot-title">Edwin Fom</div>
        <p className="foot-desc">{t.colophon}</p>
      </div>
      <div className="foot-col">
        <div className="foot-label">{lang === "fr" ? "Ailleurs" : "Elsewhere"}</div>
        <a href="https://www.edwinfom.dev/" target="_blank" rel="noopener">edwinfom.dev <Icon name="arrow-up-right" size={11}/></a>
        <a href="https://packages.edwinfom.dev/" target="_blank" rel="noopener">packages.edwinfom.dev <Icon name="arrow-up-right" size={11}/></a>
        <a href="#">github.com/edwinfom <Icon name="arrow-up-right" size={11}/></a>
      </div>
      <div className="foot-col">
        <div className="foot-label">№ {new Date().getFullYear()}</div>
        <div className="foot-issn">ISSN 2026·EDW</div>
      </div>
    </div>
    <style>{`
      .foot { margin-top: 120px; border-top: 1px solid var(--rule); background: var(--bg-tint); }
      .foot-inner {
        max-width: 1240px; margin: 0 auto;
        padding: 48px 32px 64px;
        display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px;
      }
      .foot-title { font-family: var(--font-display); font-size: 22px; font-style: italic; margin-bottom: 8px; }
      .foot-desc { font-family: var(--font-read); font-style: italic; color: var(--ink-soft); max-width: 420px; margin: 0; font-size: 14px; }
      .foot-label { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 12px; }
      .foot-col a { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--ink-soft); padding: 2px 0; border-bottom: 1px solid transparent; transition: color .15s, border-color .15s; }
      .foot-col a:hover { color: var(--ink); border-bottom-color: var(--ink); }
      .foot-col a + a { margin-left: 0; margin-top: 3px; }
      .foot-col { display: flex; flex-direction: column; gap: 3px; }
      .foot-issn { font-family: var(--font-mono); font-size: 11px; color: var(--ink-mute); }
      @media (max-width: 720px) { .foot-inner { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px; } }
    `}</style>
  </footer>
);

/* ============================================================
   CMDK palette
   ============================================================ */
const CmdK = ({ open, onClose, articles, projects, go, t, lang }) => {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 40); }
  }, [open]);

  const items = useMemo(() => {
    const base = [];
    articles.forEach(a => base.push({ kind: "article", id: a.id, title: a.title[lang], dek: a.dek[lang], meta: `№${a.issue} · ${a.readMin} ${t.min_read}`, onPick: () => go({name:"article", id: a.id}) }));
    projects.forEach(p => base.push({ kind: "project", id: p.id, title: p.name, dek: p.desc[lang], meta: p.kind[lang] + " · " + p.year, onPick: () => go({name:"projects"}) }));
    base.push({ kind: "action", id: "home", title: lang === "fr" ? "Accueil" : "Home", dek: "", meta: "", onPick: () => go({name:"home"}) });
    base.push({ kind: "action", id: "idx", title: t.nav_writing, dek: "", meta: "", onPick: () => go({name:"index"}) });
    base.push({ kind: "action", id: "proj", title: t.nav_projects, dek: "", meta: "", onPick: () => go({name:"projects"}) });
    if (!q.trim()) return base.slice(0, 8);
    const Q = q.toLowerCase();
    return base.filter(it => (it.title + " " + (it.dek||"")).toLowerCase().includes(Q)).slice(0, 12);
  }, [q, articles, projects, lang]);

  useEffect(() => { setSel(0); }, [q]);

  const pick = (i) => {
    const it = items[i]; if (!it) return;
    it.onPick(); onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s+1, items.length-1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); pick(sel); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, sel]);

  if (!open) return null;
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Icon name="search" size={16} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder={t.search_ph} />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk-list">
          {items.length === 0 && <div className="cmdk-empty">{lang === "fr" ? "Aucun résultat" : "No results"}</div>}
          {items.map((it, i) => (
            <button key={it.kind + it.id} className={"cmdk-item" + (i === sel ? " sel" : "")} onMouseEnter={() => setSel(i)} onClick={() => pick(i)}>
              <span className="cmdk-kind">{it.kind === "article" ? "✦" : it.kind === "project" ? "◆" : "→"}</span>
              <span className="cmdk-main">
                <span className="cmdk-title">{it.title}</span>
                {it.dek && <span className="cmdk-dek">{it.dek}</span>}
              </span>
              {it.meta && <span className="cmdk-meta">{it.meta}</span>}
            </button>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> {lang === "fr" ? "naviguer" : "navigate"}</span>
          <span><kbd>↵</kbd> {lang === "fr" ? "ouvrir" : "open"}</span>
          <span><kbd>ESC</kbd> {lang === "fr" ? "fermer" : "close"}</span>
        </div>
      </div>
      <style>{`
        .cmdk-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: color-mix(in oklab, var(--ink) 30%, transparent);
          backdrop-filter: blur(4px);
          display: grid; place-items: start center;
          padding-top: 14vh;
          animation: fade .15s ease;
        }
        @keyframes fade { from { opacity: 0 } }
        .cmdk {
          width: min(640px, 92vw);
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 8px;
          box-shadow: 0 24px 60px rgba(0,0,0,.18), 0 4px 10px rgba(0,0,0,.06);
          overflow: hidden;
          animation: slide .2s ease;
        }
        @keyframes slide { from { transform: translateY(-8px); opacity: .4 } }
        .cmdk-input-row {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--rule);
          color: var(--ink-mute);
        }
        .cmdk-input-row input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: var(--font-ui); font-size: 15px; color: var(--ink);
        }
        .cmdk-input-row kbd {
          font-family: var(--font-mono); font-size: 10px;
          padding: 2px 6px; background: var(--rule-soft); border-radius: 3px;
          color: var(--ink-mute);
        }
        .cmdk-list { max-height: 54vh; overflow-y: auto; padding: 6px; }
        .cmdk-item {
          width: 100%; display: grid;
          grid-template-columns: 18px 1fr auto;
          gap: 14px; align-items: center;
          padding: 11px 12px;
          border-radius: 4px;
          text-align: left;
        }
        .cmdk-item.sel { background: var(--bg-tint); }
        .cmdk-kind { color: var(--accent); font-family: var(--font-display); font-size: 15px; text-align: center; }
        .cmdk-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .cmdk-title { font-family: var(--font-read); font-size: 15px; color: var(--ink); }
        .cmdk-dek { font-size: 12.5px; color: var(--ink-mute); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cmdk-meta { font-family: var(--font-mono); font-size: 11px; color: var(--ink-mute); }
        .cmdk-empty { padding: 30px; text-align: center; color: var(--ink-mute); font-family: var(--font-read); font-style: italic; }
        .cmdk-foot {
          padding: 10px 18px; border-top: 1px solid var(--rule);
          display: flex; gap: 16px;
          font-size: 11px; color: var(--ink-mute);
        }
        .cmdk-foot kbd {
          font-family: var(--font-mono); font-size: 10px;
          padding: 1px 4px; background: var(--rule-soft); border-radius: 2px; margin: 0 2px;
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   TweaksPanel
   ============================================================ */
const TweaksPanel = ({ open, onClose, tw, setTw, lang }) => {
  if (!open) return null;
  const labels = lang === "fr"
    ? { theme: "Thème", mode: "Mode", width: "Largeur de lecture", code: "Style de code", ai: "Position AI" }
    : { theme: "Theme", mode: "Mode", width: "Reading width", code: "Code style", ai: "AI dock" };
  return (
    <div className="twk">
      <div className="twk-head">
        <span>Tweaks</span>
        <button onClick={onClose}><Icon name="x" size={14}/></button>
      </div>
      <div className="twk-row">
        <label>{labels.theme}</label>
        <div className="twk-seg">
          {["sanguine","noir","swiss"].map(th => (
            <button key={th} className={tw.theme===th?"on":""} onClick={() => setTw({theme:th})}>{th}</button>
          ))}
        </div>
      </div>
      <div className="twk-row">
        <label>{labels.mode}</label>
        <div className="twk-seg">
          <button className={tw.mode==="light"?"on":""} onClick={() => setTw({mode:"light"})}>Day</button>
          <button className={tw.mode==="dark"?"on":""} onClick={() => setTw({mode:"dark"})}>Night</button>
        </div>
      </div>
      <div className="twk-row">
        <label>{labels.width} <span className="twk-val">{tw.readingWidth}px</span></label>
        <input type="range" min="560" max="840" step="20" value={tw.readingWidth} onChange={e => setTw({readingWidth: +e.target.value})} />
      </div>
      <div className="twk-row">
        <label>{labels.code}</label>
        <div className="twk-seg">
          {["paper","minimal","terminal"].map(s => (
            <button key={s} className={tw.codeStyle===s?"on":""} onClick={() => setTw({codeStyle:s})}>{s}</button>
          ))}
        </div>
      </div>
      <div className="twk-row">
        <label>{labels.ai}</label>
        <div className="twk-seg">
          <button className={tw.aiDock==="br"?"on":""} onClick={() => setTw({aiDock:"br"})}>↘</button>
          <button className={tw.aiDock==="bl"?"on":""} onClick={() => setTw({aiDock:"bl"})}>↙</button>
          <button className={tw.aiDock==="side"?"on":""} onClick={() => setTw({aiDock:"side"})}>side</button>
        </div>
      </div>
      <style>{`
        .twk {
          position: fixed; right: 20px; bottom: 20px; z-index: 180;
          width: 280px;
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 6px;
          box-shadow: var(--shadow);
          padding: 10px 14px 14px;
          font-family: var(--font-ui);
          font-size: 12px;
        }
        .twk-head {
          display: flex; justify-content: space-between; align-items: center;
          padding-bottom: 8px; margin-bottom: 8px;
          border-bottom: 1px solid var(--rule);
          font-family: var(--font-display); font-style: italic; font-size: 15px;
        }
        .twk-row { margin: 10px 0; display: flex; flex-direction: column; gap: 6px; }
        .twk-row label { color: var(--ink-soft); font-size: 11px; letter-spacing: .04em; display: flex; justify-content: space-between; }
        .twk-val { font-family: var(--font-mono); color: var(--ink-mute); }
        .twk-seg { display: flex; gap: 4px; }
        .twk-seg button {
          flex: 1; padding: 6px 8px;
          border: 1px solid var(--rule); border-radius: 3px;
          font-size: 11px; color: var(--ink-soft);
          text-transform: capitalize;
          background: transparent;
        }
        .twk-seg button.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
        .twk input[type=range] { width: 100%; accent-color: var(--accent); }
      `}</style>
    </div>
  );
};

Object.assign(window, { CodeBlock, Rule, Nav, Footer, CmdK, TweaksPanel, highlight });
