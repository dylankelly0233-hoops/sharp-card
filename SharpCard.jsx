import { useState } from "react";

const THEMES = {
  midnight: {
    id: "midnight", label: "Midnight",
    appBg: "#070707", formBg: "#0d0d0d", formBorder: "#181818",
    slipBg: "#111111", slipHead: "#191919", slipBorder: "#1f1f1f",
    accent: "#c9a84c", accentDim: "rgba(201,168,76,0.12)", accentBorder: "rgba(201,168,76,0.3)",
    text: "#f0f0f0", muted: "#888", sub: "#333",
    win: "#22c55e", loss: "#ef4444", push: "#f59e0b",
    inputBg: "#141414", inputBorder: "#222",
  },
  electric: {
    id: "electric", label: "Electric",
    appBg: "#030810", formBg: "#060f1e", formBorder: "#0e2040",
    slipBg: "#091525", slipHead: "#0d1e38", slipBorder: "#142d55",
    accent: "#22d3ee", accentDim: "rgba(34,211,238,0.08)", accentBorder: "rgba(34,211,238,0.25)",
    text: "#dff4fa", muted: "#4a7e94", sub: "#0e2a40",
    win: "#00e887", loss: "#ff3a5c", push: "#fbbf24",
    inputBg: "#0a1828", inputBorder: "#122340",
  },
  chalk: {
    id: "chalk", label: "Chalk",
    appBg: "#e8e4d8", formBg: "#ddd9ce", formBorder: "#ccc8bc",
    slipBg: "#f9f7f1", slipHead: "#eceadf", slipBorder: "#d8d3c5",
    accent: "#111111", accentDim: "rgba(0,0,0,0.07)", accentBorder: "rgba(0,0,0,0.2)",
    text: "#111111", muted: "#999", sub: "#ddd",
    win: "#15803d", loss: "#b91c1c", push: "#b45309",
    inputBg: "#f0ece0", inputBorder: "#ccc8bb",
  },
  forest: {
    id: "forest", label: "Forest",
    appBg: "#030a04", formBg: "#060f07", formBorder: "#0e1f10",
    slipBg: "#091409", slipHead: "#0d1e0e", slipBorder: "#142816",
    accent: "#c9a84c", accentDim: "rgba(201,168,76,0.1)", accentBorder: "rgba(201,168,76,0.28)",
    text: "#e8f0e8", muted: "#4a7a50", sub: "#0e2210",
    win: "#4ade80", loss: "#f87171", push: "#fbbf24",
    inputBg: "#0a160a", inputBorder: "#132215",
  },
  vegas: {
    id: "vegas", label: "Vegas",
    appBg: "#060310", formBg: "#0a0618", formBorder: "#160e2e",
    slipBg: "#0e0820", slipHead: "#140c2e", slipBorder: "#1e1240",
    accent: "#e0b84a", accentDim: "rgba(224,184,74,0.1)", accentBorder: "rgba(224,184,74,0.28)",
    text: "#f0eaff", muted: "#6a5a8a", sub: "#1a1030",
    win: "#a78bfa", loss: "#f87171", push: "#fbbf24",
    inputBg: "#0c0a1c", inputBorder: "#1e1438",
  },
  stealth: {
    id: "stealth", label: "Stealth",
    appBg: "#0c0c0c", formBg: "#111111", formBorder: "#1c1c1c",
    slipBg: "#161616", slipHead: "#1d1d1d", slipBorder: "#242424",
    accent: "#e8e8e8", accentDim: "rgba(232,232,232,0.07)", accentBorder: "rgba(232,232,232,0.2)",
    text: "#ffffff", muted: "#555", sub: "#2a2a2a",
    win: "#4ade80", loss: "#f87171", push: "#fbbf24",
    inputBg: "#131313", inputBorder: "#222",
  },
  crimson: {
    id: "crimson", label: "Crimson",
    appBg: "#080306", formBg: "#0e0509", formBorder: "#1e080e",
    slipBg: "#120508", slipHead: "#1a0710", slipBorder: "#280a14",
    accent: "#e53e6a", accentDim: "rgba(229,62,106,0.1)", accentBorder: "rgba(229,62,106,0.28)",
    text: "#fceef2", muted: "#7a4055", sub: "#200810",
    win: "#4ade80", loss: "#ff6b6b", push: "#fbbf24",
    inputBg: "#100407", inputBorder: "#220810",
  },
};

const SPORTS  = ["NFL","NBA","MLB","NHL","Golf","CFB","NCAAB","Tennis","MMA","Soccer","Horse Racing"];
const BOOKS   = ["DraftKings","FanDuel","BetOpenly","Caesars","BetMGM","PointsBet","None"];
const TYPES   = ["Straight","Parlay","Teaser","Each-Way"];
const RESULTS = ["Pending","Win","Loss","Push","Half Win","Half Loss"];

function fmtOdds(o) {
  if (!o && o !== 0) return "—";
  const n = parseFloat(o);
  if (isNaN(n)) return o || "—";
  return n > 0 ? `+${n}` : `${n}`;
}

function calcToWin(odds, units) {
  const o = parseFloat(odds), u = parseFloat(units);
  if (isNaN(o) || isNaN(u) || u <= 0) return null;
  return o > 0 ? ((o / 100) * u).toFixed(2) : ((100 / Math.abs(o)) * u).toFixed(2);
}

function parlayOdds(legs) {
  const valid = legs.filter(l => l.odds && !isNaN(parseFloat(l.odds)));
  if (valid.length < 2) return null;
  let dec = 1;
  valid.forEach(({ odds }) => {
    const o = parseFloat(odds);
    dec *= o > 0 ? o / 100 + 1 : 100 / Math.abs(o) + 1;
  });
  const am = dec >= 2 ? Math.round((dec - 1) * 100) : -Math.round(100 / (dec - 1));
  return am > 0 ? `+${am}` : `${am}`;
}

function stampColor(result, t) {
  if (!result || result === "Pending") return null;
  if (result.includes("Win")) return t.win;
  if (result.includes("Loss")) return t.loss;
  return t.push;
}

function rrPath(x, y, w, h, r) {
  return `M${x+r},${y} L${x+w-r},${y} Q${x+w},${y} ${x+w},${y+r} L${x+w},${y+h-r} Q${x+w},${y+h} ${x+w-r},${y+h} L${x+r},${y+h} Q${x},${y+h} ${x},${y+h-r} L${x},${y+r} Q${x},${y} ${x+r},${y} Z`;
}

function Slip({ cfg, size = "preview" }) {
  const { t, betType, handle, sport, book, result, event, pick, line, odds, units, legs, note, teaserPts, logoUrl, record } = cfg;
  const isParlay = betType === "Parlay" || betType === "Teaser";
  const effOdds  = betType === "Teaser" ? odds : isParlay ? parlayOdds(legs) : odds;
  const tw       = calcToWin(effOdds, units);
  const sc       = stampColor(result, t);
  const validLegs = legs.filter(l => l.pick || l.event);

  const fs = size === "preview" ? {
    handle: "clamp(13px, 1.8vw, 22px)", sport: "clamp(7px, 0.85vw, 10px)",
    book: "clamp(6px, 0.75vw, 9px)", badge: "clamp(6px, 0.65vw, 8.5px)",
    event: "clamp(7px, 0.85vw, 10px)", pick: "clamp(15px, 3vw, 40px)",
    line: "clamp(8px, 0.9vw, 12px)", odds: "clamp(20px, 3.8vw, 52px)",
    legLabel: "clamp(5px, 0.6vw, 7.5px)", legPick: "clamp(10px, 1.5vw, 18px)",
    legEvent: "clamp(6px, 0.65vw, 8.5px)", legOdds: "clamp(9px, 1.1vw, 13px)",
    parlayTotal: "clamp(12px, 1.7vw, 20px)", unitLabel: "clamp(5px, 0.6vw, 8px)",
    unitVal: "clamp(10px, 1.3vw, 16px)", note: "clamp(7px, 0.8vw, 11px)",
    stamp: "clamp(14px, 2.5vw, 34px)",
  } : {};

  return (
    <div style={{
      width: "100%", aspectRatio: "16/9",
      background: t.slipBg, borderRadius: 14,
      border: `1px solid ${t.slipBorder}`, overflow: "hidden",
      position: "relative", fontFamily: "'Space Mono','Courier New',monospace",
      boxShadow: t.id !== "chalk" ? "0 28px 80px rgba(0,0,0,0.85)" : "0 8px 32px rgba(0,0,0,0.12)",
    }}>
      {/* HEADER */}
      <div style={{
        background: t.slipHead, padding: "10px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${t.slipBorder}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px,1vw,10px)" }}>
          {logoUrl && (
            <div style={{
              width: "clamp(26px,3.5vw,40px)", height: "clamp(26px,3.5vw,40px)",
              borderRadius: "50%", overflow: "hidden", flexShrink: 0,
              border: `1px solid ${t.accentBorder}`,
            }}>
              <img src={logoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            </div>
          )}
          <div>
            <div style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              color: t.accent, fontWeight: 900,
              fontSize: fs.handle || 22, letterSpacing: -0.5, lineHeight: 1.1,
            }}>{handle || "@handle"}</div>
            {record && (
              <div style={{
                color: t.muted, fontSize: fs.legEvent || 8.5,
                letterSpacing: 1, marginTop: 1, fontFamily: "'Space Mono',monospace",
              }}>{record}</div>
            )}
          </div>
        </div>
        <span style={{ color: t.muted, fontSize: fs.sport || 10, letterSpacing: 3, textTransform: "uppercase" }}>
          {sport}
        </span>
        <span style={{ color: t.muted, fontSize: fs.book || 9, letterSpacing: 1 }}>
          {book !== "None" ? book.toUpperCase() : ""}
        </span>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "clamp(10px,1.8vw,20px) clamp(14px,2.2vw,26px) clamp(52px,8vw,68px)", flex: 1 }}>
        {/* Badge */}
        <span style={{
          display: "inline-flex", alignItems: "center",
          background: t.accentDim, border: `1px solid ${t.accentBorder}`,
          color: t.accent, fontSize: fs.badge || 9,
          letterSpacing: 2.5, padding: "2px 8px", borderRadius: 3,
          fontWeight: 700, marginBottom: "clamp(8px,1.3vw,14px)",
        }}>{betType === "Teaser" ? `${cfg.teaserPts || "6"}PT TEASER` : betType.toUpperCase()}</span>

        {isParlay ? (
          <div>
            {validLegs.map((leg, i) => {
              const scaledPickSize = validLegs.length <= 3
                ? (fs.legPick || 18)
                : validLegs.length <= 5
                  ? "clamp(9px,1.2vw,15px)"
                  : "clamp(8px,1vw,12px)";
              return (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                gap: 8,
                paddingBottom: "clamp(3px,0.6vw,6px)",
                marginBottom: "clamp(3px,0.6vw,6px)",
                borderBottom: i < validLegs.length - 1 ? `1px solid ${t.slipBorder}` : "none",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: t.muted, fontSize: fs.legLabel || 7.5, letterSpacing: 2 }}>
                    {betType === "Teaser" ? `LEG ${i+1}` : `LEG ${i+1}`}
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display',serif", color: t.text,
                    fontSize: scaledPickSize, fontWeight: 700, lineHeight: 1.15,
                    wordBreak: "break-word", overflowWrap: "anywhere",
                  }}>{leg.pick || "—"}</div>
                  {leg.event && <div style={{ color: t.muted, fontSize: fs.legEvent || 8.5, marginTop: 1 }}>{leg.event}</div>}
                </div>
                {leg.odds && (
                  <div style={{ color: t.accent, fontWeight: 700, fontSize: fs.legOdds || 13, flexShrink: 0, paddingTop: "clamp(10px,1.4vw,16px)" }}>
                    {fmtOdds(leg.odds)}
                  </div>
                )}
              </div>
            )})}
            {(betType === "Teaser" ? odds : parlayOdds(legs)) && (
              <div style={{
                borderTop: `1px dashed ${t.slipBorder}`, paddingTop: "clamp(4px,0.7vw,8px)",
                marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "baseline",
              }}>
                <span style={{ color: t.muted, fontSize: fs.legLabel || 7.5, letterSpacing: 2 }}>
                  {betType === "Teaser" ? "TEASER ODDS" : "TOTAL ODDS"}
                </span>
                <span style={{ color: t.accent, fontWeight: 700, fontSize: fs.parlayTotal || 20 }}>
                  {betType === "Teaser" ? fmtOdds(odds) : parlayOdds(legs)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              {event && (
                <div style={{ color: t.muted, fontSize: fs.event || 10, letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>
                  {event}
                </div>
              )}
              <div style={{
                fontFamily: "'Playfair Display',Georgia,serif", color: t.text,
                fontSize: fs.pick || 40, fontWeight: 700, lineHeight: 1.1,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{pick || "Your Pick"}</div>
              {line && (
                <div style={{ color: t.muted, fontSize: fs.line || 12, marginTop: 6 }}>{line}</div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{
                color: t.accent, fontWeight: 700, fontSize: fs.odds || 52, lineHeight: 1, letterSpacing: -1,
              }}>{fmtOdds(odds)}</div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        borderTop: `1px solid ${t.slipBorder}`,
        padding: "clamp(7px,1vw,11px) clamp(14px,2.2vw,26px)",
        display: "flex", alignItems: "center", gap: 28, background: t.slipBg,
      }}>
        {units && <>
          <div>
            <div style={{ color: t.muted, fontSize: fs.unitLabel || 8, letterSpacing: 2 }}>RISKING</div>
            <div style={{ color: t.text, fontWeight: 700, fontSize: fs.unitVal || 16 }}>{units}u</div>
          </div>
          {tw && (
            <div>
              <div style={{ color: t.muted, fontSize: fs.unitLabel || 8, letterSpacing: 2 }}>TO WIN</div>
              <div style={{ color: t.win, fontWeight: 700, fontSize: fs.unitVal || 16 }}>{tw}u</div>
            </div>
          )}
        </>}
        {note && (
          <div style={{ marginLeft: "auto", color: t.muted, fontSize: fs.note || 11, fontStyle: "italic" }}>
            "{note}"
          </div>
        )}
      </div>

      {/* RESULT STAMP */}
      {sc && (
        <div style={{
          position: "absolute", top: "34%", right: "10%",
          transform: "rotate(-18deg)",
          border: `3px solid ${sc}`, color: sc,
          padding: "3px 16px", borderRadius: 5,
          fontSize: fs.stamp || 34, fontWeight: 700, letterSpacing: 4,
          opacity: 0.88, pointerEvents: "none",
        }}>{result.toUpperCase()}</div>
      )}
    </div>
  );
}

async function drawCanvas(cfg) {
  await document.fonts.ready;
  const { t, betType, handle, sport, book, result, event, pick, line, odds, units, legs, note, teaserPts, logoUrl, record } = cfg;
  const W = 1200, H = 675;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const isParlay = betType === "Parlay" || betType === "Teaser";
  const effOdds  = isParlay ? parlayOdds(legs) : odds;
  const tw       = calcToWin(effOdds, units);
  const sc       = stampColor(result, t);
  const validLegs = legs.filter(l => l.pick || l.event);

  function rr(x, y, w, h, r = 10) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  }

  // outer bg
  ctx.fillStyle = t.appBg;
  ctx.fillRect(0, 0, W, H);

  // card
  const pad = 32, cX = pad, cY = pad, cW = W-pad*2, cH = H-pad*2;
  ctx.fillStyle = t.slipBg; rr(cX, cY, cW, cH, 14); ctx.fill();
  ctx.strokeStyle = t.slipBorder; ctx.lineWidth = 1; rr(cX, cY, cW, cH, 14); ctx.stroke();

  // header
  const hH = 70;
  ctx.fillStyle = t.slipHead;
  ctx.fillRect(cX, cY, cW, hH);
  ctx.strokeStyle = t.slipBorder; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cX, cY+hH); ctx.lineTo(cX+cW, cY+hH); ctx.stroke();

  let handleX = cX + 30;

  // logo circle
  if (logoUrl) {
    const img = new Image();
    img.src = logoUrl;
    await new Promise(r => { img.onload = r; img.onerror = r; });
    const cx2 = cX + 52, cy2 = cY + hH/2, r2 = 24;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx2, cy2, r2, 0, Math.PI*2); ctx.clip();
    ctx.drawImage(img, cx2-r2, cy2-r2, r2*2, r2*2);
    ctx.restore();
    ctx.strokeStyle = t.accentBorder || t.accent+"44"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx2, cy2, r2, 0, Math.PI*2); ctx.stroke();
    handleX = cX + 88;
  }

  ctx.font = "bold 900 28px 'Playfair Display',Georgia,serif";
  ctx.fillStyle = t.accent; ctx.textAlign = "left";
  ctx.fillText(handle || "@handle", handleX, cY + (record ? 28 : 42));

  if (record) {
    ctx.font = "400 11px 'Space Mono',monospace";
    ctx.fillStyle = t.muted;
    ctx.fillText(record, handleX, cY + 50);
  }

  ctx.font = "bold 700 11px 'Space Mono',monospace";
  ctx.fillStyle = t.muted; ctx.textAlign = "center";
  ctx.fillText((sport||"").toUpperCase(), W/2, cY+42);
  ctx.font = "400 10px 'Space Mono',monospace"; ctx.textAlign = "right";
  ctx.fillText(book !== "None" ? book.toUpperCase() : "", cX+cW-30, cY+42);

  // badge
  const conY = cY + hH + 22;
  const badgeTxt = betType.toUpperCase();
  ctx.font = "bold 700 9px 'Space Mono',monospace";
  const bW = ctx.measureText(badgeTxt).width + 18;
  ctx.fillStyle = t.accentDim || t.accent+"22";
  rr(cX+30, conY-13, bW, 21, 3); ctx.fill();
  ctx.strokeStyle = t.accentBorder||t.accent+"44"; ctx.lineWidth=1;
  rr(cX+30, conY-13, bW, 21, 3); ctx.stroke();
  ctx.fillStyle = t.accent; ctx.textAlign = "left";
  ctx.fillText(badgeTxt, cX+39, conY+1);

  const mainY = conY + 26;

  if (isParlay) {
    const slots = Math.min(validLegs.length || 2, 5);
    const botZ  = H - pad - 56;
    const availH = botZ - mainY - 20;
    const legH  = Math.min(80, availH / slots);
    validLegs.slice(0, 5).forEach((leg, i) => {
      const ly = mainY + i * legH;
      ctx.fillStyle = t.muted; ctx.font = "700 8px 'Space Mono',monospace"; ctx.textAlign = "left";
      ctx.fillText(`LEG ${i+1}`, cX+30, ly+2);
      ctx.fillStyle = t.text; ctx.font = `bold 700 ${Math.min(22, legH*0.35)}px 'Playfair Display',serif`;
      ctx.fillText(leg.pick || "—", cX+30, ly + legH*0.52);
      if (leg.event) {
        ctx.fillStyle = t.muted; ctx.font = "400 10px 'Space Mono',monospace";
        ctx.fillText(leg.event, cX+30, ly + legH*0.78);
      }
      if (leg.odds) {
        ctx.fillStyle = t.accent; ctx.font = "bold 700 15px 'Space Mono',monospace"; ctx.textAlign = "right";
        ctx.fillText(fmtOdds(leg.odds), cX+cW-30, ly + legH*0.52);
      }
      if (i < validLegs.slice(0,5).length - 1) {
        ctx.strokeStyle = t.slipBorder; ctx.lineWidth = 1; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(cX+30, ly+legH-2); ctx.lineTo(cX+cW-30, ly+legH-2); ctx.stroke();
      }
    });
    const po = parlayOdds(legs);
    if (po) {
      const pY = mainY + slots * legH + 8;
      ctx.strokeStyle = t.slipBorder; ctx.lineWidth=1; ctx.setLineDash([5,4]);
      ctx.beginPath(); ctx.moveTo(cX+30, pY); ctx.lineTo(cX+cW-30, pY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = t.muted; ctx.font = "700 9px 'Space Mono',monospace"; ctx.textAlign = "left";
      ctx.fillText("TOTAL ODDS", cX+30, pY+20);
      ctx.fillStyle = t.accent; ctx.font = "bold 700 28px 'Space Mono',monospace"; ctx.textAlign = "right";
      ctx.fillText(po, cX+cW-30, pY+22);
    }
  } else {
    if (event) {
      ctx.fillStyle = t.muted; ctx.font = "400 11px 'Space Mono',monospace"; ctx.textAlign = "left";
      ctx.fillText(event.toUpperCase(), cX+30, mainY);
    }
    ctx.fillStyle = t.text;
    const pickText = pick || "Your Pick";
    let pSize = 56;
    ctx.font = `bold 900 ${pSize}px 'Playfair Display',Georgia,serif`;
    while (ctx.measureText(pickText).width > cW * 0.58 && pSize > 22) {
      pSize -= 4;
      ctx.font = `bold 900 ${pSize}px 'Playfair Display',Georgia,serif`;
    }
    ctx.textAlign = "left";
    ctx.fillText(pickText, cX+30, mainY + (event ? 58 : 50));
    if (line) {
      ctx.fillStyle = t.muted; ctx.font = "400 13px 'Space Mono',monospace";
      ctx.fillText(line, cX+30, mainY + (event ? 86 : 78));
    }
    if (odds) {
      ctx.fillStyle = t.accent; ctx.font = "bold 700 72px 'Space Mono',monospace"; ctx.textAlign = "right";
      ctx.fillText(fmtOdds(odds), cX+cW-30, mainY + (event ? 72 : 64));
    }
  }

  // bottom bar
  const botY = cY + cH - 54;
  ctx.strokeStyle = t.slipBorder; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cX+30, botY); ctx.lineTo(cX+cW-30, botY); ctx.stroke();
  if (units) {
    ctx.fillStyle = t.muted; ctx.font = "700 8px 'Space Mono',monospace"; ctx.textAlign = "left";
    ctx.fillText("RISKING", cX+30, botY+16);
    ctx.fillStyle = t.text; ctx.font = "bold 700 20px 'Space Mono',monospace";
    ctx.fillText(`${units}u`, cX+30, botY+40);
    if (tw) {
      ctx.fillStyle = t.muted; ctx.font = "700 8px 'Space Mono',monospace"; ctx.textAlign = "center";
      ctx.fillText("TO WIN", W/2, botY+16);
      ctx.fillStyle = t.win; ctx.font = "bold 700 20px 'Space Mono',monospace";
      ctx.fillText(`${tw}u`, W/2, botY+40);
    }
  }
  if (note) {
    ctx.fillStyle = t.muted; ctx.font = "italic 400 13px Georgia,serif"; ctx.textAlign = "right";
    ctx.fillText(`"${note}"`, cX+cW-30, botY+40);
  }

  // stamp
  if (sc) {
    ctx.save(); ctx.translate(W*0.76, H*0.43); ctx.rotate(-0.3);
    ctx.strokeStyle = sc; ctx.lineWidth = 6; ctx.globalAlpha = 0.88;
    rr(-110, -36, 220, 72, 6); ctx.stroke();
    ctx.fillStyle = sc; ctx.font = "bold 700 46px 'Space Mono',monospace"; ctx.textAlign = "center";
    ctx.fillText(result.toUpperCase(), 0, 17);
    ctx.restore(); ctx.globalAlpha = 1;
  }

  // On mobile (iOS/Android): Web Share API opens the native share sheet
  // which includes "Save Image" / "Save to Photos" — no workarounds needed.
  // On desktop: standard anchor download.
  canvas.toBlob(async (blob) => {
    const fileName = `sharpcard_${Date.now()}.png`;

    if (navigator.canShare && blob) {
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Sharp Card' });
          return;
        } catch (e) {
          if (e.name === 'AbortError') return; // user cancelled — that's fine
        }
      }
    }

    // Desktop fallback
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }, 'image/png');
}

const DEF_LEGS = () => [
  { event: "", pick: "", odds: "" },
  { event: "", pick: "", odds: "" },
  { event: "", pick: "", odds: "" },
];

export default function SlipForge() {
  const [tid,     setTid]     = useState("midnight");
  const [betType, setBetType] = useState("Straight");
  const [handle,  setHandle]  = useState("");
  const [sport,   setSport]   = useState("NFL");
  const [book,    setBook]    = useState("DraftKings");
  const [result,  setResult]  = useState("Pending");
  const [event,   setEvent]   = useState("");
  const [pick,    setPick]    = useState("");
  const [line,    setLine]    = useState("");
  const [odds,    setOdds]    = useState("");
  const [units,   setUnits]   = useState("");
  const [note,    setNote]    = useState("");
  const [legs,       setLegs]       = useState(DEF_LEGS());
  const [teaserPts,  setTeaserPts]  = useState("6");
  const [logoUrl,    setLogoUrl]    = useState(null);
  const [customAccent, setCustomAccent] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [recScope,   setRecScope]   = useState("Season");
  const [recW,       setRecW]       = useState("");
  const [recL,       setRecL]       = useState("");
  const [recP,       setRecP]       = useState("");
  const [recUnits,   setRecUnits]   = useState("");

  const buildRecord = () => {
    if (!showRecord) return "";
    const wl = recW || recL ? `${recW||0}-${recL||0}${recP ? `-${recP}` : ""}` : "";
    const u   = recUnits ? ` ${parseFloat(recUnits) >= 0 ? "+" : ""}${recUnits}u` : "";
    if (!wl && !u) return "";
    return `${recScope}: ${wl}${u}`.trim();
  };
  const record = buildRecord();

  const t = THEMES[tid];
  const effectiveT = customAccent ? {
    ...t,
    accent: customAccent,
    accentDim: customAccent + "20",
    accentBorder: customAccent + "55",
  } : t;
  const cfg = { t: effectiveT, betType, handle, sport, book, result, event, pick, line, odds, units, legs, note, teaserPts, logoUrl, record };

  const isParlay = betType === "Parlay" || betType === "Teaser";

  const updLeg = (i, f, v) => setLegs(legs.map((l, idx) => idx === i ? { ...l, [f]: v } : l));
  const addLeg = () => legs.length < 10 && setLegs([...legs, { event: "", pick: "", odds: "" }]);
  const delLeg = i  => legs.length > 2  && setLegs(legs.filter((_, idx) => idx !== i));

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setHandle(""); setEvent(""); setPick(""); setLine(""); setOdds("");
    setUnits(""); setNote(""); setResult("Pending"); setLegs(DEF_LEGS());
    setTeaserPts("6"); setRecW(""); setRecL(""); setRecP(""); setRecUnits("");
  };

  const inp = {
    width: "100%", background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 5, color: t.text, padding: "6px 10px", fontSize: 12,
    fontFamily: "'Space Mono',monospace", outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none",
  };
  const lbl = {
    display: "block", fontSize: 8, letterSpacing: 2.5, color: t.muted,
    marginBottom: 3, fontFamily: "'Space Mono',monospace", textTransform: "uppercase",
  };
  const fw = { marginBottom: 12 };

  const chipRow = (options, val, set, colors = {}) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {options.map(o => {
        const active = val === o;
        const col    = active ? (colors[o] || t.accent) : t.muted;
        return (
          <button key={o} onClick={() => set(o)} style={{
            padding: "4px 9px", background: active ? t.accentDim : "transparent",
            border: `1px solid ${active ? t.accentBorder : t.formBorder}`,
            borderRadius: 3, color: col, fontSize: 9, cursor: "pointer",
            fontFamily: "'Space Mono',monospace", letterSpacing: 0.5,
          }}>{o.toUpperCase()}</button>
        );
      })}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: t.appBg, display: "flex", flexDirection: "column",
      fontFamily: "'Space Mono',monospace", transition: "background 0.3s",
    }}>
      {/* NAV */}
      <div style={{
        borderBottom: `1px solid ${t.formBorder}`, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52, flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          color: effectiveT.accent, fontWeight: 900, fontSize: 20, letterSpacing: -0.5,
        }}>Sharp Card</div>
        <div style={{ color: t.muted, fontSize: 9, letterSpacing: 2 }}>BET SLIP GENERATOR</div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "288px 1fr", overflow: "hidden" }}>

        {/* FORM PANEL */}
        <div style={{
          borderRight: `1px solid ${t.formBorder}`, background: t.formBg,
          padding: "18px 16px", overflowY: "auto", maxHeight: "calc(100vh - 52px)",
        }}>
          {/* Theme swatches */}
          <div style={{ marginBottom: 16 }}>
            <span style={lbl}>THEME</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {Object.values(THEMES).map(th => (
                <button key={th.id} onClick={() => { setTid(th.id); setCustomAccent(""); }} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "8px 4px", cursor: "pointer",
                  background: tid === th.id ? t.accentDim : "transparent",
                  border: `1px solid ${tid === th.id ? t.accentBorder : t.formBorder}`,
                  borderRadius: 6,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: th.slipBg,
                    border: `3px solid ${th.accent}`,
                    boxShadow: tid === th.id ? `0 0 8px ${th.accent}66` : "none",
                  }} />
                  <span style={{
                    fontSize: 7, letterSpacing: 1, color: tid === th.id ? t.accent : t.muted,
                    fontFamily: "'Space Mono',monospace",
                  }}>{th.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${t.formBorder}`, margin: "4px 0 14px" }} />

          {/* Bet type */}
          <div style={fw}>
            <span style={lbl}>BET TYPE</span>
            {chipRow(TYPES, betType, setBetType)}
          </div>

          {/* Teaser points selector */}
          {betType === "Teaser" && (
            <div style={fw}>
              <span style={lbl}>TEASER POINTS</span>
              <div style={{ display: "flex", gap: 4 }}>
                {["6", "6.5", "7", "10", "13", "14"].map(pt => (
                  <button key={pt} onClick={() => setTeaserPts(pt)} style={{
                    flex: 1, padding: "5px 0",
                    background: teaserPts === pt ? t.accentDim : "transparent",
                    border: `1px solid ${teaserPts === pt ? t.accentBorder : t.formBorder}`,
                    borderRadius: 3, color: teaserPts === pt ? t.accent : t.muted,
                    fontSize: 9, cursor: "pointer", fontFamily: "'Space Mono',monospace",
                  }}>{pt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Handle */}
          <div style={fw}>
            <span style={lbl}>YOUR HANDLE</span>
            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@handle" style={inp} />
          </div>

          {/* Logo upload */}
          <div style={fw}>
            <span style={lbl}>LOGO (OPTIONAL)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {logoUrl && (
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                  border: `1px solid ${effectiveT.accentBorder}`,
                }}>
                  <img src={logoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                </div>
              )}
              <label style={{
                padding: "5px 12px", background: t.accentDim,
                border: `1px solid ${t.accentBorder}`, borderRadius: 4,
                color: t.accent, fontSize: 9, cursor: "pointer",
                fontFamily: "'Space Mono',monospace", letterSpacing: 1,
              }}>
                {logoUrl ? "CHANGE" : "UPLOAD"}
                <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
              </label>
              {logoUrl && (
                <button onClick={() => setLogoUrl(null)} style={{
                  background: "none", border: `1px solid ${t.formBorder}`,
                  borderRadius: 4, color: t.muted, fontSize: 9,
                  padding: "5px 10px", cursor: "pointer", fontFamily: "'Space Mono',monospace",
                }}>REMOVE</button>
              )}
            </div>
          </div>

          {/* Accent color */}
          <div style={fw}>
            <span style={lbl}>ACCENT COLOR</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={customAccent || t.accent}
                onChange={e => setCustomAccent(e.target.value)}
                style={{
                  width: 34, height: 34, padding: 2, borderRadius: 5, cursor: "pointer",
                  background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                }}
              />
              <input
                value={customAccent}
                onChange={e => setCustomAccent(e.target.value)}
                placeholder={t.accent}
                style={{ ...inp, flex: 1 }}
              />
              {customAccent && (
                <button onClick={() => setCustomAccent("")} style={{
                  background: "none", border: `1px solid ${t.formBorder}`, borderRadius: 4,
                  color: t.muted, fontSize: 9, padding: "5px 8px", cursor: "pointer",
                  fontFamily: "'Space Mono',monospace", flexShrink: 0,
                }}>RESET</button>
              )}
            </div>
          </div>

          {/* Record line */}
          <div style={fw}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={lbl}>RECORD LINE</span>
              <button onClick={() => setShowRecord(!showRecord)} style={{
                padding: "3px 10px",
                background: showRecord ? effectiveT.accentDim : "transparent",
                border: `1px solid ${showRecord ? effectiveT.accentBorder : t.formBorder}`,
                borderRadius: 3, color: showRecord ? effectiveT.accent : t.muted,
                fontSize: 8, cursor: "pointer", fontFamily: "'Space Mono',monospace", letterSpacing: 1,
              }}>{showRecord ? "SHOWING" : "HIDDEN"}</button>
            </div>
            {showRecord && (
              <div>
                {/* Scope */}
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {["Season","L5","L10","L20","All Time"].map(s => (
                    <button key={s} onClick={() => setRecScope(s)} style={{
                      flex: 1, padding: "4px 2px", fontSize: 7.5, letterSpacing: 0.5,
                      background: recScope === s ? effectiveT.accentDim : "transparent",
                      border: `1px solid ${recScope === s ? effectiveT.accentBorder : t.formBorder}`,
                      borderRadius: 3, color: recScope === s ? effectiveT.accent : t.muted,
                      cursor: "pointer", fontFamily: "'Space Mono',monospace",
                    }}>{s}</button>
                  ))}
                </div>
                {/* W / L / P / Units */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 5 }}>
                  <div>
                    <span style={{ ...lbl, color: t.win }}>W</span>
                    <input value={recW} onChange={e => setRecW(e.target.value)}
                      placeholder="47" style={{ ...inp, textAlign: "center" }} />
                  </div>
                  <div>
                    <span style={{ ...lbl, color: t.loss }}>L</span>
                    <input value={recL} onChange={e => setRecL(e.target.value)}
                      placeholder="31" style={{ ...inp, textAlign: "center" }} />
                  </div>
                  <div>
                    <span style={{ ...lbl, color: t.push }}>P</span>
                    <input value={recP} onChange={e => setRecP(e.target.value)}
                      placeholder="2" style={{ ...inp, textAlign: "center" }} />
                  </div>
                  <div>
                    <span style={lbl}>UNITS</span>
                    <input value={recUnits} onChange={e => setRecUnits(e.target.value)}
                      placeholder="+18.2" style={{ ...inp, textAlign: "center" }} />
                  </div>
                </div>
                {/* Preview */}
                {record && (
                  <div style={{
                    marginTop: 6, padding: "5px 10px",
                    background: effectiveT.accentDim, border: `1px solid ${effectiveT.accentBorder}`,
                    borderRadius: 4, color: effectiveT.accent,
                    fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1,
                  }}>{record}</div>
                )}
              </div>
            )}
          </div>

          {/* Sport + Book */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, ...fw }}>
            <div>
              <span style={lbl}>SPORT</span>
              <select value={sport} onChange={e => setSport(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {SPORTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <span style={lbl}>BOOK</span>
              <select value={book} onChange={e => setBook(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {BOOKS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* STRAIGHT / EW fields */}
          {!isParlay && <>
            <div style={fw}>
              <span style={lbl}>EVENT / MATCHUP</span>
              <input value={event} onChange={e => setEvent(e.target.value)} placeholder="Chiefs vs Eagles" style={inp} />
            </div>
            <div style={fw}>
              <span style={lbl}>YOUR PICK</span>
              <input value={pick} onChange={e => setPick(e.target.value)} placeholder="Kansas City -3" style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, ...fw }}>
              <div>
                <span style={lbl}>LINE / TYPE</span>
                <input value={line} onChange={e => setLine(e.target.value)} placeholder="-3 ATS" style={inp} />
              </div>
              <div>
                <span style={lbl}>ODDS</span>
                <input value={odds} onChange={e => setOdds(e.target.value)} placeholder="-110" style={inp} />
              </div>
            </div>
          </>}

          {/* PARLAY legs */}
          {isParlay && (
            <div style={fw}>
              <span style={lbl}>LEGS</span>
              {legs.map((leg, i) => (
                <div key={i} style={{ background: t.slipBg, border: `1px solid ${t.slipBorder}`,
                  borderRadius: 6, padding: "10px 10px 8px", marginBottom: 6,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ ...lbl, marginBottom: 0, fontSize: 7 }}>LEG {i+1}</span>
                    {legs.length > 2 && (
                      <button onClick={() => delLeg(i)} style={{
                        background: "none", border: "none", color: t.muted, cursor: "pointer",
                        fontSize: 16, padding: 0, lineHeight: 1,
                      }}>×</button>
                    )}
                  </div>
                  <input value={leg.pick} onChange={e => updLeg(i, "pick", e.target.value)}
                    placeholder="Chiefs -3 → +9.5 with teaser" style={{ ...inp, marginBottom: 5 }} />
                  <div style={{ display: "grid", gridTemplateColumns: betType === "Teaser" ? "1fr" : "1fr 1fr", gap: 5 }}>
                    <input value={leg.event} onChange={e => updLeg(i, "event", e.target.value)}
                      placeholder="Event" style={inp} />
                    {betType !== "Teaser" && (
                      <input value={leg.odds} onChange={e => updLeg(i, "odds", e.target.value)}
                        placeholder="Odds" style={inp} />
                    )}
                  </div>
                </div>
              ))}
              {betType === "Teaser" && (
                <div style={{ marginTop: 4, marginBottom: 6 }}>
                  <span style={lbl}>TEASER ODDS</span>
                  <input value={odds} onChange={e => setOdds(e.target.value)}
                    placeholder="-120" style={inp} />
                </div>
              )}
                <button onClick={addLeg} style={{
                  width: "100%", padding: "7px", background: "transparent",
                  border: `1px dashed ${t.formBorder}`, borderRadius: 4,
                  color: t.muted, fontSize: 9, cursor: "pointer",
                  letterSpacing: 2, fontFamily: "'Space Mono',monospace",
                }}>+ ADD LEG</button>
              )}
            </div>
          )}

          {/* Units */}
          <div style={fw}>
            <span style={lbl}>UNITS RISKED</span>
            <input value={units} onChange={e => setUnits(e.target.value)} placeholder="2" style={inp} />
          </div>

          {/* Note */}
          <div style={fw}>
            <span style={lbl}>NOTE (OPTIONAL)</span>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Fade the public..." style={inp} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${t.formBorder}`, margin: "14px 0" }} />

          {/* Result */}
          <div style={fw}>
            <span style={lbl}>RESULT STAMP</span>
            {chipRow(RESULTS, result, setResult, {
              Win: t.win, Loss: t.loss, Push: t.push, "Half Win": t.win, "Half Loss": t.loss,
            })}
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div style={{
          background: effectiveT.appBg, padding: 32,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          overflowY: "auto", maxHeight: "calc(100vh - 52px)",
          transition: "background 0.3s",
        }}>
          <div style={{ width: "100%", maxWidth: 780 }}>
            <Slip cfg={cfg} size="preview" />

            {/* Actions */}
            <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => drawCanvas(cfg)} style={{
                padding: "10px 28px", background: t.accent, border: "none",
                borderRadius: 6, color: "#000", fontWeight: 700, fontSize: 10,
                letterSpacing: 2, cursor: "pointer", fontFamily: "'Space Mono',monospace",
              }}>↓ DOWNLOAD PNG</button>
              <button onClick={clear} style={{
                padding: "10px 20px", background: "transparent",
                border: `1px solid ${t.formBorder}`, borderRadius: 6,
                color: t.muted, fontSize: 10, letterSpacing: 2,
                cursor: "pointer", fontFamily: "'Space Mono',monospace",
              }}>CLEAR</button>
            </div>

            {/* Live stats */}
            {(units || (isParlay && parlayOdds(legs))) && (
              <div style={{
                marginTop: 20, padding: "14px 20px",
                background: t.formBg, border: `1px solid ${t.formBorder}`,
                borderRadius: 8, display: "flex", gap: 32,
              }}>
                {units && (
                  <>
                    <div>
                      <div style={{ color: t.muted, fontSize: 8, letterSpacing: 2 }}>RISKING</div>
                      <div style={{ color: t.text, fontWeight: 700, fontSize: 16 }}>{units}u</div>
                    </div>
                    {calcToWin(isParlay ? parlayOdds(legs) : odds, units) && (
                      <div>
                        <div style={{ color: t.muted, fontSize: 8, letterSpacing: 2 }}>TO WIN</div>
                        <div style={{ color: t.win, fontWeight: 700, fontSize: 16 }}>
                          {calcToWin(isParlay ? parlayOdds(legs) : odds, units)}u
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isParlay && parlayOdds(legs) && (
                  <div>
                    <div style={{ color: t.muted, fontSize: 8, letterSpacing: 2 }}>PARLAY ODDS</div>
                    <div style={{ color: t.accent, fontWeight: 700, fontSize: 16 }}>{parlayOdds(legs)}</div>
                  </div>
                )}
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ color: t.muted, fontSize: 8, letterSpacing: 2 }}>RESULT</div>
                  <div style={{
                    fontWeight: 700, fontSize: 14,
                    color: result === "Pending" ? t.muted : stampColor(result, t),
                  }}>{result.toUpperCase()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
