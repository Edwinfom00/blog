/* AI Reading Companion — floating bubble + chat panel */

const { useState: uS, useEffect: uE, useRef: uR } = React;

const AICompanion = ({ lang, article, openSignal, onClose, dock = "br", t }) => {
  const [open, setOpen] = uS(false);
  const [messages, setMessages] = uS([]);
  const [input, setInput] = uS("");
  const [loading, setLoading] = uS(false);
  const scrollRef = uR(null);

  uE(() => {
    if (openSignal && openSignal.ts) {
      setOpen(true);
      if (openSignal.text) {
        setInput(openSignal.text);
        setTimeout(() => send(openSignal.text), 250);
      }
    }
  }, [openSignal]);

  uE(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const contextSummary = () => {
    if (!article) return lang === "fr" ? "Le visiteur est sur la page d'accueil du blog d'Edwin Fom." : "The visitor is on Edwin Fom's blog home page.";
    const body = BODIES[article.body]?.[lang] || [];
    const text = body.map(b => {
      if (b.type === "p") return b.text.replace(/<[^>]+>/g,"");
      if (b.type === "h2") return (typeof b.text === "string" ? b.text : b.text[lang]);
      if (b.type === "quote") return '"' + b.text + '"';
      if (b.type === "list") return b.items.join("; ");
      return "";
    }).filter(Boolean).join(" ").slice(0, 2400);
    return `Article: "${article.title[lang]}" — ${article.dek[lang]}\n\n${text}`;
  };

  const send = async (forced) => {
    const q = (forced ?? input).trim(); if (!q || loading) return;
    setInput(""); setLoading(true);
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    try {
      const ctx = contextSummary();
      const sys = lang === "fr"
        ? `Tu es le compagnon de lecture d'Edwin Fom. Tu aides le visiteur à comprendre l'article qu'il lit. Reste bref (3 à 5 phrases), chaleureux, précis. Parle français.\n\nCONTEXTE DE L'ARTICLE:\n${ctx}`
        : `You are Edwin Fom's reading companion. Help the visitor understand the piece they're reading. Keep it brief (3–5 sentences), warm, precise. Speak English.\n\nARTICLE CONTEXT:\n${ctx}`;
      const reply = await window.claude.complete({
        messages: [
          { role: "user", content: sys + "\n\nVisitor question: " + q }
        ]
      });
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: lang === "fr" ? "Je n'ai pas pu répondre pour l'instant. Réessaye dans un instant." : "I couldn't answer right now. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = article
    ? (lang === "fr"
        ? ["Résume-moi l'article", "Explique la partie technique", "Donne un exemple concret"]
        : ["Summarize the article", "Explain the technical part", "Give a concrete example"])
    : (lang === "fr"
        ? ["Qui est Edwin ?", "Par quoi commencer ?", "Quels projets a-t-il publiés ?"]
        : ["Who is Edwin?", "Where should I start?", "What has he shipped?"]);

  const dockClass = dock === "bl" ? "ai-bl" : dock === "side" ? "ai-side" : "ai-br";

  return (
    <>
      {/* Bubble */}
      <button
        className={"ai-bubble " + dockClass + (open ? " open" : "")}
        onClick={() => setOpen(v => !v)}
        aria-label={t.ai_title}
      >
        <span className="bub-inner">
          {open ? <Icon name="x" size={16}/> : <Icon name="sparkle" size={16}/>}
        </span>
        {!open && <span className="bub-label">{lang === "fr" ? "Poser une question" : "Ask a question"}</span>}
        {!open && <span className="bub-halo"/>}
      </button>

      {/* Panel */}
      {open && (
        <div className={"ai-panel " + dockClass}>
          <header className="ai-head">
            <div className="ai-head-left">
              <span className="ai-orn"><Icon name="sparkle" size={13}/></span>
              <div>
                <div className="ai-title">{t.ai_title}</div>
                <div className="ai-sub">
                  {article
                    ? (lang==="fr"?"À propos de : ":"About: ") + <em>{article.title[lang]}</em>
                    : t.ai_subtitle}
                </div>
              </div>
            </div>
            <button className="ai-close" onClick={() => setOpen(false)}><Icon name="x" size={14}/></button>
          </header>

          <div className="ai-body" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p className="welcome-line">
                  {lang==="fr"
                    ? "Je suis là pour t'aider à comprendre ce qu'Edwin a écrit. Pose-moi une question — je reste bref."
                    : "I'm here to help you understand what Edwin wrote. Ask me anything — I'll keep it brief."}
                </p>
                <div className="ai-suggestions">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={"ai-msg " + m.role}>
                {m.role === "assistant" && <span className="ai-avatar"><Icon name="sparkle" size={11}/></span>}
                <div className="ai-bubble-msg" dangerouslySetInnerHTML={{__html: m.content.replace(/\n/g,"<br/>")}}/>
              </div>
            ))}
            {loading && (
              <div className="ai-msg assistant">
                <span className="ai-avatar"><Icon name="sparkle" size={11}/></span>
                <div className="ai-bubble-msg thinking">
                  <span className="dot"/><span className="dot"/><span className="dot"/>
                </div>
              </div>
            )}
          </div>

          <form className="ai-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              placeholder={t.ai_placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Send">
              <Icon name="send" size={14}/>
            </button>
          </form>

          <div className="ai-foot">
            <span>{lang === "fr" ? "Propulsé par Claude" : "Powered by Claude"}</span>
            <span className="foot-dot">·</span>
            <span>{lang === "fr" ? "Répond en se basant sur les articles" : "Answers grounded in the articles"}</span>
          </div>
        </div>
      )}

      <style>{`
        .ai-bubble {
          position: fixed; z-index: 150;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 10px 14px 10px 12px;
          background: var(--ink); color: var(--bg);
          border-radius: 999px;
          box-shadow: 0 8px 28px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.12);
          transition: transform .25s cubic-bezier(.4,0,.2,1), box-shadow .2s;
          font-family: var(--font-ui); font-size: 13px;
        }
        .ai-bubble.ai-br { right: 24px; bottom: 24px; }
        .ai-bubble.ai-bl { left: 24px; bottom: 24px; }
        .ai-bubble.ai-side { right: 24px; bottom: 50%; transform: translateY(50%); }
        .ai-bubble:hover { transform: translateY(-2px); }
        .ai-bubble.ai-side:hover { transform: translateY(calc(50% - 2px)); }
        .ai-bubble.open .bub-label { display: none; }
        .bub-inner {
          width: 26px; height: 26px;
          display: grid; place-items: center;
          background: var(--accent);
          border-radius: 50%;
          color: #fff;
        }
        .bub-label { padding-right: 6px; font-style: italic; }
        .bub-halo {
          position: absolute; inset: -4px;
          border-radius: 999px;
          border: 1px solid var(--accent);
          opacity: .3;
          animation: halo 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes halo {
          0%, 100% { transform: scale(1); opacity: .25; }
          50% { transform: scale(1.06); opacity: .55; }
        }

        .ai-panel {
          position: fixed; z-index: 149;
          width: min(420px, calc(100vw - 32px));
          height: min(640px, calc(100vh - 140px));
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 10px;
          box-shadow: 0 24px 60px rgba(0,0,0,.22), 0 2px 6px rgba(0,0,0,.08);
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: aiPop .25s cubic-bezier(.4,0,.2,1);
        }
        .ai-panel.ai-br { right: 24px; bottom: 86px; }
        .ai-panel.ai-bl { left: 24px; bottom: 86px; }
        .ai-panel.ai-side { right: 24px; bottom: 50%; transform: translateY(50%); height: min(580px, calc(100vh - 80px)); }
        @keyframes aiPop { from { opacity: 0; transform: translateY(8px); } }
        .ai-panel.ai-side { animation-name: aiPopSide; }
        @keyframes aiPopSide { from { opacity: 0; transform: translateY(calc(50% + 8px)); } to { transform: translateY(50%); } }

        .ai-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 16px 18px 14px;
          border-bottom: 1px solid var(--rule);
          background: var(--bg-tint);
        }
        .ai-head-left { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
        .ai-orn {
          width: 28px; height: 28px; flex: 0 0 28px;
          display: grid; place-items: center;
          background: var(--accent); color: #fff;
          border-radius: 50%;
        }
        .ai-title { font-family: var(--font-display); font-style: italic; font-size: 18px; line-height: 1.1; }
        .ai-sub { font-family: var(--font-read); font-size: 12.5px; color: var(--ink-mute); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; font-style: italic; }
        .ai-sub em { color: var(--ink-soft); font-style: italic; }
        .ai-close { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; color: var(--ink-mute); }
        .ai-close:hover { background: var(--rule-soft); color: var(--ink); }

        .ai-body {
          flex: 1; overflow-y: auto;
          padding: 18px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .ai-welcome {
          padding: 10px 0 6px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .welcome-line { margin: 0; font-family: var(--font-read); font-style: italic; font-size: 15px; color: var(--ink-soft); line-height: 1.5; }
        .ai-suggestions { display: flex; flex-direction: column; gap: 6px; }
        .ai-suggestions button {
          text-align: left;
          padding: 10px 12px;
          border: 1px solid var(--rule);
          border-radius: 4px;
          background: transparent;
          font-family: var(--font-ui); font-size: 13px;
          color: var(--ink-soft);
          transition: all .15s;
        }
        .ai-suggestions button:hover { background: var(--bg-tint); color: var(--ink); border-color: var(--ink-mute); }
        .ai-suggestions button::before { content: "→ "; color: var(--accent); }

        .ai-msg { display: flex; gap: 8px; align-items: flex-start; }
        .ai-msg.user { justify-content: flex-end; }
        .ai-avatar {
          width: 22px; height: 22px; flex: 0 0 22px;
          border-radius: 50%;
          background: var(--accent); color: #fff;
          display: grid; place-items: center;
          margin-top: 2px;
        }
        .ai-bubble-msg {
          max-width: 80%;
          padding: 10px 13px;
          border-radius: 10px;
          font-family: var(--font-read); font-size: 14.5px; line-height: 1.55;
          background: var(--bg-tint);
          color: var(--ink);
        }
        .ai-msg.user .ai-bubble-msg { background: var(--ink); color: var(--bg); border-radius: 10px 10px 2px 10px; }
        .ai-msg.assistant .ai-bubble-msg { border-radius: 2px 10px 10px 10px; }
        .ai-bubble-msg.thinking { display: inline-flex; gap: 4px; padding: 14px 14px; }
        .ai-bubble-msg.thinking .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-mute); animation: tDot 1.2s ease-in-out infinite; }
        .ai-bubble-msg.thinking .dot:nth-child(2) { animation-delay: .15s; }
        .ai-bubble-msg.thinking .dot:nth-child(3) { animation-delay: .3s; }
        @keyframes tDot { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }

        .ai-input {
          display: flex; gap: 8px;
          padding: 12px 14px;
          border-top: 1px solid var(--rule);
          background: var(--bg-tint);
        }
        .ai-input input {
          flex: 1; padding: 9px 12px;
          border: 1px solid var(--rule);
          border-radius: 4px;
          background: var(--surface);
          font-family: var(--font-ui); font-size: 14px;
          color: var(--ink);
        }
        .ai-input input:focus { outline: none; border-color: var(--accent); }
        .ai-input button {
          width: 38px; height: 38px;
          display: grid; place-items: center;
          background: var(--ink); color: var(--bg);
          border-radius: 4px;
        }
        .ai-input button:disabled { opacity: .4; cursor: not-allowed; }
        .ai-input button:not(:disabled):hover { background: var(--accent); }

        .ai-foot {
          display: flex; gap: 6px;
          padding: 8px 14px;
          border-top: 1px solid var(--rule);
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: .04em;
          color: var(--ink-mute);
          text-align: center; justify-content: center;
          background: var(--bg-tint);
        }
        .foot-dot { opacity: .6; }

        @media (max-width: 560px) {
          .ai-panel { bottom: 86px !important; right: 16px !important; left: 16px !important; width: auto; }
          .ai-bubble { bottom: 20px !important; right: 20px !important; left: auto !important; }
        }
      `}</style>
    </>
  );
};

window.AICompanion = AICompanion;
