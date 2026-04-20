/* App root — routing, state, tweaks, global listeners */

const { useState: use, useEffect: eff, useCallback: cb } = React;

const App = () => {
  const [tw, setTwRaw] = use(() => ({ ...(window.__TWEAKS__ || {}) }));
  const setTw = (patch) => {
    setTwRaw(cur => {
      const next = { ...cur, ...patch };
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch(e){}
      return next;
    });
  };

  const [lang, setLang] = use(tw.lang || "fr");
  const [route, setRouteRaw] = use(() => {
    try {
      const saved = localStorage.getItem("route");
      if (saved) return JSON.parse(saved);
    } catch(e){}
    return { name: "home" };
  });
  const setRoute = (r) => { setRouteRaw(r); try { localStorage.setItem("route", JSON.stringify(r)); } catch(e){} window.scrollTo({top:0, behavior:"instant"}); };

  const [cmdkOpen, setCmdkOpen] = use(false);
  const [tweaksOpen, setTweaksOpen] = use(false);
  const [aiOpenSignal, setAiOpenSignal] = use({ ts: 0, text: "" });

  // Apply theme to body
  eff(() => {
    document.body.setAttribute("data-theme", tw.theme);
    document.body.setAttribute("data-mode", tw.mode);
    document.body.setAttribute("data-code-style", tw.codeStyle);
    // Sync dark/light with theme mode
  }, [tw.theme, tw.mode, tw.codeStyle]);

  const toggleMode = () => setTw({ mode: tw.mode === "dark" ? "light" : "dark" });

  // Keyboard: Cmd+K
  eff(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setCmdkOpen(v => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault(); setAiOpenSignal({ ts: Date.now(), text: "" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Tweaks host protocol
  eff(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweaksOpen(true);
      else if (d.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e){}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const t = I18N[lang];

  const openAIWithContext = (text = "") => setAiOpenSignal({ ts: Date.now(), text });

  const article = route.name === "article"
    ? ARTICLES.find(a => a.id === route.id) || ARTICLES[0]
    : null;

  let page;
  if (route.name === "home") page = <HomePage t={t} lang={lang} go={setRoute} articles={ARTICLES} projects={PROJECTS}/>;
  else if (route.name === "index") page = <IndexPage t={t} lang={lang} go={setRoute} articles={ARTICLES}/>;
  else if (route.name === "projects") page = <ProjectsPage t={t} lang={lang} projects={PROJECTS}/>;
  else if (route.name === "article") page = <ArticlePage t={t} lang={lang} go={setRoute} article={article} articles={ARTICLES} openAIWithContext={openAIWithContext} readingWidth={tw.readingWidth}/>;

  return (
    <div className="app" data-screen-label={route.name}>
      <Nav t={t} route={route} go={setRoute} onSearch={() => setCmdkOpen(true)} lang={lang} setLang={(l) => { setLang(l); setTw({lang:l}); }} mode={tw.mode} toggleMode={toggleMode}/>
      {page}
      <Footer t={t} lang={lang}/>
      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} articles={ARTICLES} projects={PROJECTS} go={setRoute} t={t} lang={lang}/>
      <AICompanion lang={lang} article={article} openSignal={aiOpenSignal} dock={tw.aiDock} t={t}/>
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} tw={tw} setTw={setTw} lang={lang}/>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
