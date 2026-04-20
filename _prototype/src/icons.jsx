/* Minimal inline icons — hairline stroke style */
const Icon = ({ name, size = 16, ...rest }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  switch (name) {
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "arrow-right":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-up-right":
      return <svg {...common}><path d="M7 17L17 7M8 7h9v9"/></svg>;
    case "sun":
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case "moon":
      return <svg {...common}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case "sparkle":
      return <svg {...common}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 3v3M17.5 4.5h3" opacity=".6"/></svg>;
    case "x":
      return <svg {...common}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "copy":
      return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/></svg>;
    case "check":
      return <svg {...common}><path d="M4 12l5 5L20 6"/></svg>;
    case "send":
      return <svg {...common}><path d="M4 12l16-8-6 18-3-7-7-3z"/></svg>;
    case "book":
      return <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z"/><path d="M8 7h7M8 11h7"/></svg>;
    case "layers":
      return <svg {...common}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 18l9 5 9-5"/></svg>;
    case "home":
      return <svg {...common}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z"/></svg>;
    case "command":
      return <svg {...common}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6z"/></svg>;
    case "hash":
      return <svg {...common}><path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18"/></svg>;
    case "dot":
      return <svg {...common}><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>;
    case "minus":
      return <svg {...common}><path d="M5 12h14"/></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    default:
      return null;
  }
};
window.Icon = Icon;
