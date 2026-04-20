/* Pages: Home, Index, Projects, Article */

const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

const fmtDate = (iso, lang) => {
  const d = new Date(iso);
  const m = lang === "fr"
    ? ["jan.","fév.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
};

/* ============================================================
   HOME
   ============================================================ */
const HomePage = ({ t, lang, go, articles, projects }) => {
  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured).slice(0, 4);
  const hero = featured[0];

  return (
    <main className="home">
      {/* Masthead — editorial */}
      <section className="masthead">
        <div className="mast-top">
          <span className="mast-date">{fmtDate(new Date().toISOString(), lang)}</span>
          <span className="mast-mid">{lang === "fr" ? "Journal hebdomadaire" : "A weekly journal"} · № {articles[0].issue}</span>
          <span className="mast-mid">Paris · FR</span>
        </div>
        <h1 className="mast-title">
          <span className="mast-line-1">Edwin&nbsp;Fom</span>
          <span className="mast-line-2"><span className="mast-amp">&amp;</span> <span className="mast-italic">le Journal</span></span>
        </h1>
        <div className="mast-sub">
          <span className="mast-kicker">{t.hero_kicker}</span>
        </div>
      </section>

      {/* Hero article */}
      <section className="hero-article">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-kicker">
              <span>{t.featured}</span>
              <span className="dot">·</span>
              <span>№{hero.issue}</span>
              <span className="dot">·</span>
              <span>{fmtDate(hero.date, lang)}</span>
            </div>
            <h2 className="hero-title" onClick={() => go({name:"article", id:hero.id})}>
              {hero.title[lang]}
            </h2>
            <p className="hero-dek">{hero.dek[lang]}</p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => go({name:"article", id:hero.id})}>
                {t.hero_cta} <Icon name="arrow-right" size={14}/>
              </button>
              <span className="hero-meta">{hero.readMin} {t.min_read}</span>
            </div>
          </div>
          <aside className="hero-right">
            <div className="hero-figure">
              <div className="fig-number"><span>{String(hero.issue).padStart(2,"0")}</span></div>
              <div className="fig-grid">
                {Array.from({length: 48}).map((_,i) => (
                  <span key={i} className="fig-cell" style={{animationDelay:(i*18)+"ms"}}/>
                ))}
              </div>
              <div className="fig-caption">
                <span>Fig. I</span>
                <span>{lang === "fr" ? "Un paquet, sept kilo-octets" : "A package, seven kilobytes"}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Rule ornament />

      {/* Latest grid */}
      <section className="latest">
        <header className="section-head">
          <div className="sh-left">
            <span className="sh-kicker">{lang === "fr" ? "Dans ce numéro" : "In this issue"}</span>
            <h3 className="sh-title">{t.latest}</h3>
          </div>
          <button className="sh-more" onClick={() => go({name:"index"})}>
            {t.all_writing} <Icon name="arrow-up-right" size={12}/>
          </button>
        </header>

        <div className="latest-grid">
          {rest.map((a, i) => (
            <article key={a.id} className="card-article" onClick={() => go({name:"article", id:a.id})}>
              <div className="card-head">
                <span className="card-issue">№ {a.issue}</span>
                <span className="card-date">{fmtDate(a.date, lang)}</span>
              </div>
              <h4 className="card-title">{a.title[lang]}</h4>
              <p className="card-dek">{a.dek[lang]}</p>
              <div className="card-foot">
                <span className="card-tags">
                  {a.tags[lang].slice(0,2).map(tg => <span key={tg}>{tg}</span>)}
                </span>
                <span className="card-read">{a.readMin} {t.min_read} →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Rule />

      {/* Projects preview */}
      <section className="home-projects">
        <header className="section-head">
          <div className="sh-left">
            <span className="sh-kicker">{lang === "fr" ? "Atelier" : "Workshop"}</span>
            <h3 className="sh-title">{t.projects_title}</h3>
          </div>
          <button className="sh-more" onClick={() => go({name:"projects"})}>
            {lang === "fr" ? "Voir tout" : "See all"} <Icon name="arrow-up-right" size={12}/>
          </button>
        </header>
        <div className="proj-strip">
          {projects.slice(0,3).map(p => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener" className="proj-chip">
              <span className="pc-dot" data-status={p.status}/>
              <span className="pc-name">{p.name}</span>
              <span className="pc-desc">{p.desc[lang]}</span>
              <Icon name="arrow-up-right" size={13}/>
            </a>
          ))}
        </div>
      </section>

      <style>{`
        .home { max-width: 1240px; margin: 0 auto; padding: 40px 32px 0; }
        @media (max-width: 720px) { .home { padding: 20px 18px 0; } }

        /* Masthead */
        .masthead {
          border-top: 3px solid var(--ink);
          border-bottom: 1px solid var(--ink);
          padding: 16px 0 28px;
          margin-bottom: 40px;
        }
        .mast-top {
          display: flex; justify-content: space-between;
          font-family: var(--font-ui); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--ink-soft);
          padding-bottom: 20px;
          border-bottom: 1px solid var(--rule);
          margin-bottom: 28px;
        }
        .mast-title {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(56px, 11vw, 148px);
          line-height: .92;
          letter-spacing: -0.01em;
          text-align: center;
        }
        .mast-line-1, .mast-line-2 { display: block; }
        .mast-line-2 { margin-top: .04em; }
        .mast-amp { color: var(--accent); font-style: italic; }
        .mast-italic { font-style: italic; }
        .mast-sub {
          margin-top: 24px;
          display: flex; justify-content: center;
        }
        .mast-kicker {
          font-family: var(--font-read); font-style: italic;
          font-size: 17px; color: var(--ink-soft);
        }

        /* Hero */
        .hero-grid {
          display: grid; grid-template-columns: 1.1fr .9fr;
          gap: 72px; align-items: start;
          padding: 8px 0 24px;
        }
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } }
        .hero-kicker {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-ui); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px;
        }
        .hero-kicker .dot { color: var(--ink-mute); }
        .hero-title {
          margin: 0;
          font-family: var(--font-display); font-weight: 400;
          font-size: clamp(40px, 5.5vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: color .2s;
        }
        .hero-title:hover { color: var(--accent); }
        .hero-dek {
          margin: 22px 0 28px;
          font-family: var(--font-read); font-style: italic;
          font-size: 20px; line-height: 1.5;
          color: var(--ink-soft);
          max-width: 540px;
        }
        .hero-cta { display: flex; align-items: center; gap: 18px; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 18px;
          background: var(--ink); color: var(--bg);
          border-radius: 3px;
          font-size: 13px; letter-spacing: .01em;
          transition: transform .15s, background .2s;
        }
        .btn-primary:hover { background: var(--accent); }
        .hero-meta { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-mute); letter-spacing: .04em; }

        /* Hero figure: typographic illustration */
        .hero-figure {
          position: relative;
          aspect-ratio: 4/5;
          background: var(--bg-tint);
          border: 1px solid var(--rule);
          overflow: hidden;
        }
        .fig-number {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          font-family: var(--font-display);
          font-size: clamp(160px, 28vw, 360px);
          line-height: 1; font-style: italic;
          color: var(--accent); opacity: .92;
          z-index: 2; pointer-events: none;
        }
        .fig-grid {
          position: absolute; inset: 0;
          display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(6, 1fr);
          z-index: 1;
        }
        .fig-cell {
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          animation: fadeCell 1.2s ease both;
        }
        @keyframes fadeCell { from { opacity: 0 } to { opacity: 1 } }
        .fig-caption {
          position: absolute; bottom: 10px; left: 12px; right: 12px; z-index: 3;
          display: flex; justify-content: space-between;
          font-family: var(--font-mono); font-size: 10.5px;
          letter-spacing: .08em; color: var(--ink-mute);
        }

        /* Section head */
        .section-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding: 8px 0 28px;
          border-bottom: 1px solid var(--rule);
          margin-bottom: 32px;
        }
        .sh-kicker { font-family: var(--font-ui); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
        .sh-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 400; font-style: italic; font-size: 38px; line-height: 1; }
        .sh-more { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-soft); padding-bottom: 4px; border-bottom: 1px solid var(--ink-mute); }
        .sh-more:hover { color: var(--accent); border-color: var(--accent); }

        /* Latest */
        .latest-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-bottom: 1px solid var(--rule);
        }
        @media (max-width: 1000px) { .latest-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .latest-grid { grid-template-columns: 1fr; } }
        .card-article {
          padding: 28px 24px 28px 0;
          border-right: 1px solid var(--rule);
          cursor: pointer;
          display: flex; flex-direction: column;
          gap: 10px;
          transition: background .2s;
        }
        .card-article:last-child { border-right: none; }
        .card-article + .card-article { padding-left: 24px; }
        .card-article:hover { background: var(--bg-tint); }
        .card-head { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .06em; color: var(--ink-mute); text-transform: uppercase; }
        .card-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 400; font-size: 24px; line-height: 1.12; color: var(--ink); }
        .card-article:hover .card-title { color: var(--accent); }
        .card-dek { margin: 0; font-family: var(--font-read); font-size: 13.5px; line-height: 1.5; color: var(--ink-soft); flex: 1; }
        .card-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .card-tags { display: inline-flex; gap: 6px; font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-mute); text-transform: lowercase; }
        .card-tags span::before { content: "# "; opacity: .5; }
        .card-read { font-size: 11px; color: var(--ink-mute); }

        /* Projects strip */
        .proj-strip { display: flex; flex-direction: column; border-top: 1px solid var(--rule); }
        .proj-chip {
          display: grid;
          grid-template-columns: 14px 200px 1fr 16px;
          gap: 24px; align-items: center;
          padding: 20px 4px;
          border-bottom: 1px solid var(--rule);
          transition: padding .2s, background .2s;
        }
        .proj-chip:hover { padding-left: 16px; padding-right: 16px; background: var(--bg-tint); }
        .pc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink-mute); }
        .pc-dot[data-status="live"] { background: #3FA264; }
        .pc-dot[data-status="new"]  { background: var(--accent); }
        .pc-dot[data-status="wip"]  { background: #D9A94C; }
        .pc-name { font-family: var(--font-mono); font-size: 14px; color: var(--ink); letter-spacing: -.01em; }
        .pc-desc { font-family: var(--font-read); font-style: italic; font-size: 14px; color: var(--ink-soft); }
        @media (max-width: 720px) {
          .proj-chip { grid-template-columns: 14px 1fr 16px; }
          .pc-desc { display: none; }
        }
      `}</style>
    </main>
  );
};

/* ============================================================
   INDEX — full writing archive
   ============================================================ */
const IndexPage = ({ t, lang, go, articles }) => {
  const [query, setQuery] = useS("");
  const [tag, setTag] = useS(null);
  const allTags = useM(() => {
    const s = new Set();
    articles.forEach(a => a.tags[lang].forEach(tg => s.add(tg)));
    return [...s];
  }, [lang]);

  const filtered = articles.filter(a => {
    const q = query.trim().toLowerCase();
    const okQ = !q || (a.title[lang] + a.dek[lang]).toLowerCase().includes(q);
    const okT = !tag || a.tags[lang].includes(tag);
    return okQ && okT;
  });

  return (
    <main className="idx">
      <header className="idx-head">
        <span className="sh-kicker">{lang === "fr" ? "Sommaire" : "Archive"}</span>
        <h1 className="idx-title">{t.nav_writing}</h1>
        <p className="idx-sub">{lang === "fr" ? "Six ans à écrire sur le web, irrégulièrement." : "Six years writing about the web, irregularly."}</p>
      </header>

      <div className="idx-tools">
        <div className="idx-search">
          <Icon name="search" size={14}/>
          <input placeholder={t.search_ph} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="idx-tags">
          <button className={!tag?"tag-btn on":"tag-btn"} onClick={() => setTag(null)}>{lang === "fr" ? "Tous" : "All"}</button>
          {allTags.map(tg => (
            <button key={tg} className={tag===tg?"tag-btn on":"tag-btn"} onClick={() => setTag(tg === tag ? null : tg)}>#{tg}</button>
          ))}
        </div>
      </div>

      <ol className="idx-list">
        {filtered.map((a, i) => (
          <li key={a.id} className="idx-item" onClick={() => go({name:"article", id:a.id})}>
            <span className="idx-num">№{String(a.issue).padStart(2,"0")}</span>
            <div className="idx-main">
              <div className="idx-meta">
                <span>{fmtDate(a.date, lang)}</span>
                <span className="dot">·</span>
                <span>{a.readMin} {t.min_read}</span>
                <span className="dot">·</span>
                <span className="idx-tags-in">{a.tags[lang].slice(0,2).map(tg => <span key={tg}>#{tg}</span>)}</span>
              </div>
              <h2 className="idx-h">{a.title[lang]}</h2>
              <p className="idx-dek">{a.dek[lang]}</p>
            </div>
            <span className="idx-arrow"><Icon name="arrow-right" size={14}/></span>
          </li>
        ))}
        {filtered.length === 0 && (
          <div className="idx-empty">
            <em>{lang === "fr" ? "Rien ici… pour l'instant." : "Nothing here… yet."}</em>
          </div>
        )}
      </ol>

      <style>{`
        .idx { max-width: 980px; margin: 0 auto; padding: 60px 32px 0; }
        .idx-head { text-align: center; padding: 32px 0 20px; border-bottom: 1px solid var(--rule); margin-bottom: 40px; }
        .idx-title { margin: 8px 0; font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: clamp(56px, 10vw, 112px); line-height: 1; }
        .idx-sub { margin: 0; font-family: var(--font-read); font-style: italic; font-size: 17px; color: var(--ink-soft); }
        .idx-tools { display: flex; gap: 20px; align-items: center; padding: 0 0 24px; flex-wrap: wrap; }
        .idx-search {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border: 1px solid var(--rule); border-radius: 3px;
          background: var(--surface); flex: 1 1 280px;
          color: var(--ink-mute);
        }
        .idx-search input { border: none; outline: none; background: transparent; flex: 1; font-family: var(--font-read); font-size: 15px; color: var(--ink); }
        .idx-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tag-btn { padding: 6px 10px; border: 1px solid var(--rule); border-radius: 3px; font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); background: transparent; }
        .tag-btn:hover { color: var(--ink); border-color: var(--ink-mute); }
        .tag-btn.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
        .idx-list { list-style: none; padding: 0; margin: 30px 0 0; border-top: 1px solid var(--rule); }
        .idx-item {
          display: grid; grid-template-columns: 100px 1fr 40px;
          gap: 20px; align-items: start;
          padding: 32px 0;
          border-bottom: 1px solid var(--rule);
          cursor: pointer;
          transition: background .2s;
        }
        .idx-item:hover { background: var(--bg-tint); padding-left: 12px; padding-right: 12px; }
        .idx-num { font-family: var(--font-display); font-style: italic; font-size: 28px; color: var(--accent); line-height: 1; padding-top: 4px; }
        .idx-meta { display: flex; gap: 8px; font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-mute); letter-spacing: .04em; text-transform: uppercase; margin-bottom: 8px; }
        .idx-meta .dot { color: var(--ink-mute); }
        .idx-tags-in { display: inline-flex; gap: 8px; text-transform: lowercase; }
        .idx-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 34px; line-height: 1.08; }
        .idx-item:hover .idx-h { color: var(--accent); }
        .idx-dek { margin: 10px 0 0; font-family: var(--font-read); font-style: italic; font-size: 16px; line-height: 1.5; color: var(--ink-soft); max-width: 680px; }
        .idx-arrow { padding-top: 12px; color: var(--ink-mute); }
        .idx-item:hover .idx-arrow { color: var(--accent); }
        .idx-empty { padding: 40px; text-align: center; color: var(--ink-mute); font-family: var(--font-read); }
        @media (max-width: 720px) { .idx-item { grid-template-columns: 60px 1fr; } .idx-arrow { display: none; } .idx-num { font-size: 20px; } .idx-h { font-size: 24px; } }
      `}</style>
    </main>
  );
};

/* ============================================================
   PROJECTS
   ============================================================ */
const ProjectsPage = ({ t, lang, projects }) => {
  return (
    <main className="proj">
      <header className="proj-head">
        <span className="sh-kicker">{lang === "fr" ? "Atelier ouvert" : "Open workshop"}</span>
        <h1 className="proj-title">{t.projects_title}</h1>
        <p className="proj-sub">{t.projects_desc}</p>
      </header>

      <div className="proj-grid">
        {projects.map((p, i) => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener" className="pcard" style={{animationDelay:(i*60)+"ms"}}>
            <div className="pcard-top">
              <span className="pcard-status" data-status={p.status}>
                <span className="pc-dot" data-status={p.status}/>
                {p.status === "live" ? "live" : p.status === "new" ? (lang==="fr"?"nouveau":"new") : "wip"}
              </span>
              <span className="pcard-year">{p.year}</span>
            </div>
            <h2 className="pcard-name">{p.name}</h2>
            <p className="pcard-kind">{p.kind[lang]}</p>
            <p className="pcard-desc">{p.desc[lang]}</p>
            <div className="pcard-foot">
              <span className="pcard-tags">{p.tags.map(tg => <span key={tg}>{tg}</span>)}</span>
              <span className="pcard-go"><Icon name="arrow-up-right" size={14}/></span>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .proj { max-width: 1180px; margin: 0 auto; padding: 60px 32px 0; }
        .proj-head { padding: 24px 0 40px; border-bottom: 1px solid var(--rule); margin-bottom: 40px; }
        .proj-title { margin: 6px 0; font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: clamp(56px, 10vw, 112px); line-height: 1; }
        .proj-sub { margin: 8px 0 0; font-family: var(--font-read); font-style: italic; font-size: 18px; color: var(--ink-soft); max-width: 540px; }
        .proj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
        @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .proj-grid { grid-template-columns: 1fr; } }
        .pcard {
          background: var(--surface);
          padding: 28px 26px;
          display: flex; flex-direction: column; gap: 8px;
          min-height: 280px;
          transition: background .2s, transform .2s;
          animation: fadeUp .5s ease both;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } }
        .pcard:hover { background: var(--bg-tint); }
        .pcard-top { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 6px; }
        .pcard-status { display: inline-flex; align-items: center; gap: 6px; }
        .pcard-name { margin: 4px 0 2px; font-family: var(--font-mono); font-size: 17px; color: var(--ink); letter-spacing: -.01em; }
        .pcard-kind { margin: 0; font-family: var(--font-read); font-style: italic; font-size: 13px; color: var(--accent); }
        .pcard-desc { margin: 8px 0 auto; font-family: var(--font-read); font-size: 15px; line-height: 1.5; color: var(--ink-soft); }
        .pcard-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--rule); margin-top: 16px; }
        .pcard-tags { display: inline-flex; gap: 8px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-mute); }
        .pcard-go { color: var(--ink-mute); transition: color .2s, transform .2s; }
        .pcard:hover .pcard-go { color: var(--accent); transform: translate(2px, -2px); }
      `}</style>
    </main>
  );
};

/* ============================================================
   ARTICLE — reading view with TOC + reading progress
   ============================================================ */
const ArticlePage = ({ t, lang, go, article, articles, openAIWithContext, readingWidth }) => {
  const [activeHead, setActiveHead] = useS(article.toc[0]?.id || null);
  const [progress, setProgress] = useS(0);
  const artRef = useR(null);
  const body = BODIES[article.body][lang];

  useE(() => {
    const onScroll = () => {
      const el = artRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight * 0.7;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, Math.max(0, scrolled / total)));

      // Find active heading
      const heads = [...el.querySelectorAll("h2[id]")];
      let cur = heads[0]?.id;
      for (const h of heads) {
        const r = h.getBoundingClientRect();
        if (r.top < 140) cur = h.id;
      }
      if (cur && cur !== activeHead) setActiveHead(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [article.id]);

  const curIdx = articles.findIndex(a => a.id === article.id);
  const next = articles[curIdx + 1];
  const prev = articles[curIdx - 1];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  return (
    <>
      <div className="read-progress" style={{width: (progress*100)+"%"}}/>
      <main className="article" ref={artRef}>
        {/* Hero */}
        <header className="a-hero">
          <button className="a-back" onClick={() => go({name:"index"})}>
            <Icon name="arrow-right" size={12} style={{transform:"rotate(180deg)"}}/> {t.back}
          </button>
          <div className="a-meta">
            <span>№{String(article.issue).padStart(2,"0")}</span>
            <span className="dot">·</span>
            <span>{fmtDate(article.date, lang)}</span>
            <span className="dot">·</span>
            <span>{article.readMin} {t.min_read}</span>
          </div>
          <h1 className="a-title">{article.title[lang]}</h1>
          <p className="a-dek">{article.dek[lang]}</p>
          <div className="a-byline">
            <span className="a-by">{t.by} <em>Edwin Fom</em></span>
            <span className="a-tags">
              {article.tags[lang].map(tg => <span key={tg}>#{tg}</span>)}
            </span>
          </div>
        </header>

        <div className="a-grid" style={{"--reading-width": readingWidth+"px"}}>
          {/* TOC */}
          <aside className="a-toc">
            <div className="toc-inner">
              <div className="toc-label">{t.toc}</div>
              <ul>
                {article.toc.map(h => (
                  <li key={h.id} className={activeHead === h.id ? "on" : ""}>
                    <button onClick={() => scrollTo(h.id)}>
                      <span className="toc-dash">—</span>
                      {h[lang]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Body */}
          <article className="a-body">
            {body.map((b, i) => {
              if (b.type === "p") {
                return <p key={i} className="a-p" dangerouslySetInnerHTML={{__html: b.text}}/>;
              }
              if (b.type === "h2") {
                const text = typeof b.text === "string" ? b.text : b.text[lang];
                return (
                  <h2 key={i} id={b.id} className="a-h2">
                    <span className="a-h-orn">§</span>{text}
                  </h2>
                );
              }
              if (b.type === "quote") {
                return (
                  <blockquote key={i} className="a-q">
                    <span className="a-q-mark">“</span>
                    <span>{b.text}</span>
                  </blockquote>
                );
              }
              if (b.type === "code") {
                return <CodeBlock key={i} code={b.code} lang={b.lang} />;
              }
              if (b.type === "list") {
                return (
                  <ul key={i} className="a-list">
                    {b.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{__html: it}}/>)}
                  </ul>
                );
              }
              return null;
            })}

            {/* AI prompt inline */}
            <div className="a-ai-inline">
              <div className="ai-inline-top">
                <Icon name="sparkle" size={14}/>
                <span>{lang === "fr" ? "Compagnon de lecture" : "Reading companion"}</span>
              </div>
              <p>{lang === "fr" ? "Une question sur cet article ? Pose-la au compagnon." : "Got a question about this piece? Ask the companion."}</p>
              <div className="ai-inline-btns">
                <button onClick={() => openAIWithContext(lang === "fr" ? "Explique-moi les idées principales de cet article en quelques phrases." : "Explain the main ideas of this article in a few sentences.")}>
                  {t.ai_simplify}
                </button>
                <button onClick={() => openAIWithContext(lang === "fr" ? "Donne-moi un exemple concret tiré de cet article." : "Give me a concrete example from this article.")}>
                  {t.ai_deepen}
                </button>
              </div>
            </div>
          </article>

          {/* Right rail — empty for editorial air */}
          <aside className="a-rail">
            <div className="rail-card">
              <div className="rail-label">{t.filed_under}</div>
              <div className="rail-tags">
                {article.tags[lang].map(tg => <span key={tg}>{tg}</span>)}
              </div>
            </div>
          </aside>
        </div>

        {/* Continue reading */}
        <section className="a-continue">
          <div className="cont-label">{t.continue_reading}</div>
          <div className="cont-grid">
            {prev && (
              <button className="cont-item" onClick={() => go({name:"article", id:prev.id})}>
                <span className="cont-kind">← {t.prev_article}</span>
                <span className="cont-title">{prev.title[lang]}</span>
              </button>
            )}
            {next && (
              <button className="cont-item right" onClick={() => go({name:"article", id:next.id})}>
                <span className="cont-kind">{t.next_article} →</span>
                <span className="cont-title">{next.title[lang]}</span>
              </button>
            )}
          </div>
        </section>

        <style>{`
          .article { max-width: 1320px; margin: 0 auto; padding: 48px 32px 0; }
          @media (max-width: 720px) { .article { padding: 24px 18px 0; } }

          .a-hero { max-width: 900px; margin: 0 auto; padding: 40px 0 64px; text-align: left; }
          .a-back { font-family: var(--font-ui); font-size: 12px; color: var(--ink-mute); display: inline-flex; align-items: center; gap: 6px; margin-bottom: 32px; padding: 4px 0; }
          .a-back:hover { color: var(--accent); }
          .a-meta { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 20px; }
          .a-meta .dot { color: var(--ink-mute); }
          .a-title { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(40px, 6vw, 78px); line-height: 1.02; letter-spacing: -0.01em; text-wrap: pretty; }
          .a-dek { margin: 28px 0 0; font-family: var(--font-read); font-style: italic; font-size: 22px; line-height: 1.45; color: var(--ink-soft); max-width: 720px; text-wrap: pretty; }
          .a-byline { margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--ink-mute); flex-wrap: wrap; gap: 12px; }
          .a-by em { font-family: var(--font-display); font-style: italic; color: var(--ink); font-size: 15px; }
          .a-tags { display: inline-flex; gap: 10px; font-family: var(--font-mono); font-size: 11px; }

          .a-grid { display: grid; grid-template-columns: 220px var(--reading-width, 680px) 220px; gap: 48px; justify-content: center; margin-top: 16px; }
          @media (max-width: 1200px) { .a-grid { grid-template-columns: 180px var(--reading-width, 680px); } .a-rail { display: none; } }
          @media (max-width: 900px) { .a-grid { grid-template-columns: 1fr; gap: 24px; } .a-toc { order: -1; position: static !important; } .toc-inner { position: static !important; } }

          .a-toc { position: sticky; top: 88px; align-self: start; height: max-content; }
          .toc-inner { font-family: var(--font-ui); }
          .toc-label { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 14px; }
          .a-toc ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; border-left: 1px solid var(--rule); }
          .a-toc li button { display: flex; align-items: baseline; gap: 8px; padding: 7px 0 7px 14px; font-size: 13px; line-height: 1.3; color: var(--ink-mute); text-align: left; width: 100%; transition: color .2s, padding .2s; position: relative; }
          .a-toc li button:hover { color: var(--ink); }
          .a-toc li.on button { color: var(--ink); }
          .a-toc li.on button::before { content: ""; position: absolute; left: -1px; top: 50%; height: 60%; width: 2px; background: var(--accent); transform: translateY(-50%); }
          .toc-dash { color: var(--ink-mute); opacity: .5; display: none; }

          /* Body */
          .a-body { font-family: var(--font-read); font-size: 19px; line-height: 1.66; color: var(--ink); }
          .a-body > *:first-child::first-letter {
            font-family: var(--font-display); font-style: italic;
            font-size: 4.8em; float: left; line-height: .86;
            padding: 0.06em 0.12em 0 0;
            color: var(--accent);
          }
          .a-p { margin: 0 0 1.3em; text-wrap: pretty; }
          .a-p code, .a-list li code {
            font-family: var(--font-mono); font-size: .84em;
            padding: 1px 6px; border-radius: 3px;
            background: var(--bg-tint);
            color: var(--accent); white-space: nowrap;
          }
          .a-h2 {
            margin: 2.2em 0 .6em;
            font-family: var(--font-display); font-weight: 400;
            font-size: 36px; line-height: 1.1;
            letter-spacing: -0.005em;
            display: flex; align-items: baseline; gap: 12px;
            scroll-margin-top: 100px;
          }
          .a-h-orn { color: var(--accent); font-style: italic; font-size: .7em; }
          .a-q {
            margin: 2em 0; padding: 0 0 0 32px;
            border-left: 2px solid var(--accent);
            font-family: var(--font-display); font-style: italic;
            font-size: 28px; line-height: 1.3;
            color: var(--ink);
            position: relative;
          }
          .a-q-mark { font-size: 3em; line-height: 0; vertical-align: -.45em; color: var(--accent); opacity: .5; margin-right: 6px; }
          .a-list { padding-left: 22px; margin: 1.4em 0; }
          .a-list li { margin-bottom: .5em; }

          .a-rail { align-self: start; position: sticky; top: 88px; }
          .rail-card { padding: 20px; background: var(--bg-tint); border-radius: 4px; }
          .rail-label { font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 10px; }
          .rail-tags { display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); font-size: 12px; color: var(--ink); }

          /* Inline AI prompt */
          .a-ai-inline { margin: 3em 0 1em; padding: 22px 24px; border: 1px dashed var(--accent); border-radius: 4px; background: color-mix(in oklab, var(--accent) 6%, transparent); }
          .ai-inline-top { display: flex; align-items: center; gap: 8px; font-family: var(--font-ui); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
          .a-ai-inline p { margin: 0 0 14px; font-family: var(--font-read); font-size: 16px; color: var(--ink-soft); font-style: italic; }
          .ai-inline-btns { display: flex; gap: 8px; flex-wrap: wrap; }
          .ai-inline-btns button {
            padding: 8px 12px;
            border: 1px solid var(--rule);
            border-radius: 3px;
            background: var(--surface);
            font-family: var(--font-ui); font-size: 12px;
            color: var(--ink);
          }
          .ai-inline-btns button:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }

          /* Continue */
          .a-continue { max-width: 1100px; margin: 96px auto 0; padding: 32px 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
          .cont-label { text-align: center; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 24px; }
          .cont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          @media (max-width: 720px) { .cont-grid { grid-template-columns: 1fr; } }
          .cont-item { display: flex; flex-direction: column; gap: 10px; padding: 20px; border: 1px solid transparent; border-radius: 4px; text-align: left; transition: background .2s, border-color .2s; }
          .cont-item.right { text-align: right; }
          .cont-item:hover { background: var(--bg-tint); }
          .cont-kind { font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
          .cont-title { font-family: var(--font-display); font-size: 22px; line-height: 1.15; color: var(--ink); }
          .cont-item:hover .cont-title { color: var(--accent); }
        `}</style>
      </main>
    </>
  );
};

Object.assign(window, { HomePage, IndexPage, ProjectsPage, ArticlePage, fmtDate });
