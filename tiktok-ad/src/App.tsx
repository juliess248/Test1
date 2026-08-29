import React from "react";


// ─── Brand palette ────────────────────────────────────────────────────────────
const CREAM  = "#EDE7DC";
const NAVY   = "#0E1826";
const NAVY2  = "#14202F";
const YLW    = "#F9E300";
const BLUE   = "#0047B8";
const LFILL  = "#EFE8DE";
const LBDR   = "rgba(14,24,38,0.17)";
const LFDARK = "#F4EDE4";
const LBDARK = "rgba(255,255,255,0.14)";
const SURR   = "#B8B2A8";

const BG_F = "'Bricolage Grotesque', sans-serif";
const UI_F = "'Karla', sans-serif";

const FW = 1080;
const FH = 1920;
const SX = 72;

// ─── Hex geometry (parameterised) ─────────────────────────────────────────────
const HR = 212;
type Pt = { x: number; y: number };

function hexPts(cx: number, cy: number, r = HR): Pt[] {
  const hh = Math.round(r * 0.866);
  return [
    { x: cx,       y: cy      },
    { x: cx - r/2, y: cy - hh },
    { x: cx + r/2, y: cy - hh },
    { x: cx - r,   y: cy      },
    { x: cx + r,   y: cy      },
    { x: cx - r/2, y: cy + hh },
    { x: cx + r/2, y: cy + hh },
  ];
}

// Standard sizes
const OD = 158;
const CD = 174;


// F1 big hex — sized to fit safely between headline and bottom safe zone
const HR_BIG = 270;
const OD_BIG = 200;
const CD_BIG = 218;

// ─── Puzzles ──────────────────────────────────────────────────────────────────
const P1 = ["K","E","I","M","L","P","O"] as const;
const SEQ1 = [5,6,4,1,3,2,0,6]; // POLÉMIKO
const P2 = ["N","A","D","I","O","R","S"] as const;
const SEQ2P = [2,1,0]; // DAN…

// ─── Audio engine ─────────────────────────────────────────────────────────────
let popCounter = 0;

// C-major scale for melodic taps — 8 notes maps perfectly to POLÉMIKO
const SCALE = [261, 294, 330, 349, 392, 440, 494, 523];
let tapCounter = 0;

function makeAudio() {
  let ctx: AudioContext | null = null;
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function osc(c: AudioContext, freq: number, type: OscillatorType,
               vol: number, dur: number, delay = 0, freqEnd?: number) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime + delay);
    if (freqEnd !== undefined)
      o.frequency.linearRampToValueAtTime(freqEnd, c.currentTime + delay + dur);
    g.gain.setValueAtTime(vol, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    o.start(c.currentTime + delay);
    o.stop(c.currentTime + delay + dur + 0.02);
  }
  return {
    // ── F1 ────────────────────────────────────────────────────────────────────
    whoosh() {
      // Rising sine sweep as headline arrives
      const c = ac();
      osc(c, 180, "sine", 0.06, 0.30, 0,    700);
      osc(c, 360, "sine", 0.03, 0.22, 0.06, 950);
    },
    pop() {
      // Ascending pentatonic blip for each outer circle — cycles C4→C5
      const c = ac();
      const freqs = [261, 294, 330, 392, 440, 523];
      const freq  = freqs[popCounter % freqs.length];
      popCounter++;
      osc(c, freq,       "sine", 0.09, 0.08);
      osc(c, freq * 1.5, "sine", 0.04, 0.06, 0.01);
    },
    impact() {
      // K lands: low thud + high sparkle shimmer
      const c = ac();
      osc(c,   80, "sine", 0.24, 0.15, 0,    35);
      osc(c, 1600, "sine", 0.08, 0.30, 0.02, 700);
      osc(c, 2400, "sine", 0.04, 0.20, 0.05, 1000);
    },
    // ── F2 ────────────────────────────────────────────────────────────────────
    wordReveal() {
      // Soft 2-note chord when word panel slides in
      const c = ac();
      osc(c, 523, "sine", 0.07, 0.28);
      osc(c, 659, "sine", 0.05, 0.28, 0.04);
    },
    letterTap() {
      // Melodic tap: cycles up the C-major scale (POLÉMIKO = 8 perfect notes)
      const c = ac();
      const freq = SCALE[tapCounter % SCALE.length];
      tapCounter++;
      osc(c, freq,      "sine", 0.11, 0.11);
      osc(c, freq * 2,  "sine", 0.04, 0.07, 0.02); // octave shimmer
      osc(c, freq * 3,  "sine", 0.02, 0.05, 0.03); // 3rd harmonic
    },
    // ── F3 ────────────────────────────────────────────────────────────────────
    success() {
      // Full 4-note fanfare with harmony layer
      const c = ac();
      [523, 659, 784, 1047].forEach((hz, i) => {
        osc(c, hz,       "sine", 0.14, 0.38, i * 0.12);
        osc(c, hz * 1.5, "sine", 0.05, 0.28, i * 0.12 + 0.06);
      });
    },
    rewardCoin() {
      // Classic coin collect: two quick high blips
      const c = ac();
      osc(c,  988, "sine", 0.13, 0.06);
      osc(c, 1319, "sine", 0.15, 0.14, 0.07);
    },
    pangrama() {
      // Glittery ascending sparkle cascade for ★ PANGRAMA!
      const c = ac();
      [700, 900, 1100, 1300, 1550, 1850, 2200].forEach((hz, i) =>
        osc(c, hz, "sine", 0.07 - i*0.007, 0.22, i * 0.055));
    },
    // ── F4 ────────────────────────────────────────────────────────────────────
    challenge() {
      // Playful 3-note "uh oh" descending
      const c = ac();
      [440, 370, 294].forEach((hz, i) =>
        osc(c, hz, "sine", 0.10, 0.24, i * 0.11));
    },
    // ── F5 ────────────────────────────────────────────────────────────────────
    cta() {
      const c = ac();
      // Whoosh as pill flies up
      osc(c, 140, "sine", 0.07, 0.30, 0,    520);
      // Thud on landing
      osc(c,  65, "sine", 0.28, 0.13, 0.28, 28);
      osc(c, 110, "sine", 0.12, 0.10, 0.28, 40);
      // Rising chord blooms after impact
      [392, 523, 659, 784].forEach((hz, i) =>
        osc(c, hz, "sine", 0.09, 0.40, 0.33 + i * 0.06));
      // Sparkle shimmer on top
      osc(c, 2000, "sine", 0.05, 0.22, 0.36, 800);
    },
    // ── kept for any residual uses ─────────────────────────────────────────────
    tap() {
      const c = ac();
      osc(c, 880 + Math.random()*80, "sine", 0.09, 0.07);
    },
  };
}
type Audio = ReturnType<typeof makeAudio>;

// ─── Animation helpers ────────────────────────────────────────────────────────
const prog   = (t: number, s: number, d: number) => Math.max(0, Math.min(1, (t-s)/d));
const eo     = (x: number) => 1 - Math.pow(1-x, 3);
const eoBack = (x: number) => { const c = 1.70158; return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2); };
const lerp   = (a: number, b: number, t: number) => a + (b-a)*t;

// ─── Base circle ─────────────────────────────────────────────────────────────
type Theme = "light" | "dark" | "yellow";

function Circle({
  letter, cx, cy, size, yellow, theme="light",
  scale=1, opacity=1, translateY=0,
}: {
  letter: string; cx: number; cy: number; size: number;
  yellow: boolean; theme?: Theme; scale?: number; opacity?: number; translateY?: number;
}) {
  let fill: string, border: string, textColor = NAVY;
  if (theme === "yellow") {
    if (yellow) { fill = NAVY; border = "none"; textColor = YLW; }
    else         { fill = "#FFFFFF"; border = "none"; }
  } else if (theme === "dark") {
    fill   = yellow ? YLW  : LFDARK;
    border = yellow ? "none" : `2.5px solid ${LBDARK}`;
  } else {
    fill   = yellow ? YLW  : LFILL;
    border = yellow ? "none" : `2.5px solid ${LBDR}`;
  }
  const fs = Math.round(size * 0.35);
  return (
    <div style={{
      position:"absolute",
      left:cx-size/2, top:cy-size/2,
      width:size, height:size,
      transform:`translateY(${translateY}px) scale(${scale})`, transformOrigin:"center center", opacity,
    }}>
      <div style={{
        width:"100%", height:"100%", borderRadius:"50%",
        background:fill, border,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:UI_F, fontWeight:700, fontSize:fs,
        color:textColor, boxSizing:"border-box",
      }}>{letter}</div>
    </div>
  );
}

// ─── Selection path ───────────────────────────────────────────────────────────
function SelPath({ pts, svgW=FW, svgH=FH }: { pts: Pt[]; svgW?: number; svgH?: number }) {
  if (pts.length < 2) return null;
  const d = pts.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  return (
    <svg style={{ position:"absolute", inset:0, width:svgW, height:svgH, pointerEvents:"none" }}>
      <path d={d} fill="none" stroke={YLW} strokeWidth={11}
        strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
    </svg>
  );
}

// ─── Static hex puzzle ────────────────────────────────────────────────────────
function HexPuzzle({
  letters, cx, cy, r=HR, od=OD, cd=CD,
  selIdx=[] as number[], pathSeq=[] as number[],
  dim=false, theme="light" as Theme, svgW=FW, svgH=FH,
}: {
  letters: readonly string[]; cx: number; cy: number;
  r?: number; od?: number; cd?: number;
  selIdx?: number[]; pathSeq?: number[]; dim?: boolean; theme?: Theme;
  svgW?: number; svgH?: number;
}) {
  const pts = hexPts(cx, cy, r);
  return (
    <div style={{ position:"absolute", inset:0, opacity:dim ? 0.18 : 1 }}>
      <SelPath pts={pathSeq.map(i=>pts[i])} svgW={svgW} svgH={svgH} />
      {letters.map((l,i) => (
        <Circle key={i} letter={l}
          cx={pts[i].x} cy={pts[i].y}
          size={i===0?cd:od}
          yellow={i===0||selIdx.includes(i)}
          theme={theme}
        />
      ))}
    </div>
  );
}

// ─── Animated hex puzzle ──────────────────────────────────────────────────────
function AnimHex({
  letters, cx, cy, r=HR, od=OD, cd=CD, t,
  entryStart=0, entryStagger=70, entryDur=280,
  outerFirst=false,
  selIdx=[] as number[], pathSeq=[] as number[],
  dim=false, theme="light" as Theme, svgW=FW, svgH=FH,
}: {
  letters: readonly string[]; cx: number; cy: number;
  r?: number; od?: number; cd?: number; t: number;
  entryStart?: number; entryStagger?: number; entryDur?: number;
  outerFirst?: boolean;
  selIdx?: number[]; pathSeq?: number[]; dim?: boolean; theme?: Theme;
  svgW?: number; svgH?: number;
}) {
  const pts = hexPts(cx, cy, r);
  // outerFirst: indices 1-6 stagger in 0..5, centre (0) gets slot 6
  function slotOf(i: number) {
    if (!outerFirst) return i;
    return i === 0 ? 6 : i - 1;
  }
  return (
    <div style={{ position:"absolute", inset:0, opacity:dim ? 0.18 : 1 }}>
      <SelPath pts={pathSeq.map(i=>pts[i])} svgW={svgW} svgH={svgH} />
      {letters.map((l,i) => {
        const sc = eoBack(prog(t, entryStart + slotOf(i)*entryStagger, entryDur));
        return (
          <Circle key={i} letter={l}
            cx={pts[i].x} cy={pts[i].y}
            size={i===0?cd:od}
            yellow={i===0||selIdx.includes(i)}
            theme={theme}
            scale={sc} opacity={Math.min(sc,1)}
          />
        );
      })}
    </div>
  );
}

// ─── Word panel ───────────────────────────────────────────────────────────────
function WordPanel({
  word, top, check=false, panelBg=NAVY2, opacity=1, translateY=0,
}: {
  word: string; top: number; check?: boolean; panelBg?: string;
  opacity?: number; translateY?: number;
}) {
  return (
    <div style={{
      position:"absolute", top, left:SX, right:FW-950,
      height:120, background:panelBg, borderRadius:22,
      display:"flex", alignItems:"center",
      paddingLeft:46, paddingRight:38, gap:22,
      boxSizing:"border-box",
      opacity, transform:`translateY(${translateY}px)`,
    }}>
      <span style={{
        fontFamily:UI_F, fontWeight:700,
        fontSize:80, letterSpacing:"0.03em", color:YLW, flex:1,
      }}>{word}</span>
      {check && (
        <div style={{
          width:72, height:72, borderRadius:"50%", background:YLW,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
            <path d="M2 13L13 24L32 4" stroke={NAVY}
              strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// STATIC FRAMES (storyboard)
// ════════════════════════════════════════════════════════════════════════════════

function Frame1() {
  return (
    <div style={{ width:FW, height:FH, background:YLW, position:"relative" }}>
      {/* Headline — large, immediate hook */}
      <div style={{ position:"absolute", top:290, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:110, lineHeight:1.04, color:NAVY }}>
        Bo ta mira<br />e palabra?
      </div>
      {/* Hex — top≈633, bottom≈1167 */}
      <HexPuzzle letters={P1} cx={540} cy={900} r={HR_BIG} od={OD_BIG} cd={CD_BIG} theme="yellow" />
      {/* Rule hint — very bottom of frame */}
      <div style={{
        position:"absolute", bottom:50, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:14,
      }}>
        <div style={{
          width:44, height:44, borderRadius:"50%", background:NAVY,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:UI_F, fontWeight:700, fontSize:22, color:YLW, flexShrink:0,
        }}>K</div>
        <span style={{ fontFamily:UI_F, fontWeight:600, fontSize:38, color:NAVY }}>
          mester den tur palabra
        </span>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div style={{ width:FW, height:FH, background:CREAM, position:"relative" }}>
      <WordPanel word="POLÉMIKO" top={180} />
      <HexPuzzle letters={P1} cx={540} cy={960} selIdx={[1,2,3,4,5,6]} pathSeq={SEQ1} />
    </div>
  );
}

function Frame3() {
  return (
    <div style={{ width:FW, height:FH, background:BLUE, position:"relative" }}>
      <WordPanel word="POLÉMIKO" check top={180} panelBg={NAVY2} />
      <div style={{ position:"absolute", top:352, left:SX,
        display:"flex", alignItems:"baseline", gap:20 }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:152, color:YLW, lineHeight:1 }}>+15</span>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:52, color:CREAM, opacity:0.7 }}>punto</span>
      </div>
      <div style={{ position:"absolute", top:550, left:SX,
        display:"flex", alignItems:"center", gap:18 }}>
        <span style={{ fontSize:56 }}>★</span>
        <span style={{ fontFamily:BG_F, fontWeight:700, fontSize:62, color:YLW, letterSpacing:"0.04em" }}>
          PANGRAMA!
        </span>
      </div>
      <HexPuzzle letters={P1} cx={540} cy={1040} dim theme="dark" />
    </div>
  );
}

function Frame4() {
  return (
    <div style={{ width:FW, height:FH, background:CREAM, position:"relative" }}>
      <div style={{ position:"absolute", top:180, left:SX, right:FW-950,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.02, color:NAVY }}>
        Fásil?<br />Prueba<br />esaki…
      </div>
      <div style={{
        position:"absolute", top:510, left:SX, right:FW-950,
        height:120, background:NAVY2, borderRadius:22,
        display:"flex", alignItems:"center", paddingLeft:46, gap:6, boxSizing:"border-box",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:YLW }}>DAN</span>
        <span style={{ display:"inline-block", width:5, height:70, background:"rgba(249,227,0,0.35)", borderRadius:3 }} />
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:"rgba(249,227,0,0.13)" }}>____</span>
      </div>
      <HexPuzzle letters={P2} cx={540} cy={980} selIdx={[1,2]} pathSeq={SEQ2P} />
    </div>
  );
}

function Frame5() {
  return (
    <div style={{ width:FW, height:FH, background:NAVY, position:"relative", overflow:"hidden" }}>
      {/* Ghost hex */}
      <div style={{ position:"absolute", inset:0, opacity:0.07 }}>
        <HexPuzzle letters={P1} cx={540} cy={1020} theme="dark" />
      </div>
      <div style={{ position:"absolute", top:230, left:SX,
        fontFamily:BG_F, fontWeight:700, fontSize:50, color:CREAM, letterSpacing:"-0.01em" }}>
        Palabra di Kòrsou
      </div>
      <div style={{ position:"absolute", top:336, left:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.04, color:CREAM }}>
        Kon bon bo<br />Papiamentu ta?
      </div>
      {/* CTA pill */}
      <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
        style={{
          position:"absolute", bottom:904,
          left:"50%", transform:"translateX(-50%)",
          width:740, height:132, borderRadius:66,
          background:YLW, textDecoration:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:68, color:NAVY, letterSpacing:"-0.01em" }}>
          HUNGA AWOR →
        </span>
      </a>
      {/* Reinforcement line — sits safely below CTA, above y=1248 */}
      <div style={{
        position:"absolute", bottom:840, left:0, right:0, textAlign:"center",
        fontFamily:UI_F, fontWeight:500, fontSize:34, color:CREAM, opacity:0.38,
        letterSpacing:"0.02em",
      }}>Gratis di hunga · Un wega nobo tur dia</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ANIMATED FRAMES
// ════════════════════════════════════════════════════════════════════════════════

// F1 — Hook (2000 ms)
// Beat 1 (0–360ms):   headline snaps up fast
// Beat 2 (400–820ms): outer circles fire in rapid stagger
// Beat 3 (900–1260ms): K drops with unified easing (position + scale both overshoot)
// Tail  (1260–2000ms): K pulses twice to keep energy alive

const F1_K_ENTRY     = 900;
const F1_K_DONE      = 1260;
const F1_OUTER_START = 400;
const F1_OUTER_STAG  = 58;

export function AnimF1({ t }: { t: number }) {
  const pts = hexPts(540, 900, HR_BIG);

  // Beat 1 — headline snaps in fast, no scale trick (clean & punchy)
  const headP = eoBack(prog(t, 0, 360));

  // Beat 2 — outer circles: tight stagger, each with strong overshoot
  const OUTER_DUR = 220;

  // Beat 3 — K: BOTH position and scale use eoBack so they overshoot together
  const kP     = eoBack(prog(t, F1_K_ENTRY, 360));
  const kDropY = lerp(-150, 0, kP);   // same easing as scale → they land together
  const kScale = Math.max(0, kP);

  // Tail — K double-pulse (two sine bumps) to fill the silence
  const pulse1 = t > F1_K_DONE
    ? 0.12 * Math.sin(prog(t, F1_K_DONE,       340) * Math.PI) : 0;
  const pulse2 = t > F1_K_DONE + 420
    ? 0.08 * Math.sin(prog(t, F1_K_DONE + 420, 280) * Math.PI) : 0;
  const kFinal = kScale * (1 + pulse1 + pulse2);

  return (
    <div style={{ width:FW, height:FH, background:YLW, position:"relative", overflow:"hidden" }}>

      {/* Headline — snaps in at safe zone top */}
      <div style={{
        position:"absolute", top:290, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:110, lineHeight:1.04, color:NAVY,
        opacity:Math.min(headP, 1),
        transform:`translateY(${lerp(70, 0, Math.min(headP, 1))}px)`,
        transformOrigin:"left top",
      }}>Bo ta mira<br />e palabra?</div>

      {/* Outer circles — rapid stagger */}
      {[1,2,3,4,5,6].map((i, ord) => {
        const sc = eoBack(prog(t, F1_OUTER_START + ord*F1_OUTER_STAG, OUTER_DUR));
        return (
          <Circle key={i} letter={P1[i]}
            cx={pts[i].x} cy={pts[i].y} size={OD_BIG}
            yellow={false} theme="yellow"
            scale={sc} opacity={Math.min(sc * 1.5, 1)}
          />
        );
      })}

      {/* K — position and scale overshoot in unison, then double-pulses */}
      <Circle letter={P1[0]}
        cx={pts[0].x} cy={pts[0].y} size={CD_BIG}
        yellow theme="yellow"
        scale={kFinal}
        translateY={kDropY}
        opacity={Math.min(prog(t, F1_K_ENTRY, 140), 1)}
      />

      {/* Rule hint — fades in after K lands */}
      {(() => {
        const ruleP = eo(prog(t, F1_K_DONE + 60, 320));
        return (
          <div style={{
            position:"absolute", bottom:50, left:0, right:0,
            display:"flex", alignItems:"center", justifyContent:"center", gap:14,
            opacity:ruleP,
          }}>
            <div style={{
              width:44, height:44, borderRadius:"50%", background:NAVY,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:UI_F, fontWeight:700, fontSize:22, color:YLW, flexShrink:0,
            }}>K</div>
            <span style={{
              fontFamily:UI_F, fontWeight:600, fontSize:38, color:NAVY,
            }}>mester den tur palabra</span>
          </div>
        );
      })()}
    </div>
  );
}

// F2 — Gameplay (4000 ms) ─────────────────────────────────────────────────────
const F2_TAPS = [700, 1130, 1560, 1990, 2420, 2850, 3280, 3700];

const F2_WORD = ["P","O","L","É","M","I","K","O"]; // precomposed É (U+00C9)

export function AnimF2({ t }: { t: number }) {
  const nTapped  = F2_TAPS.filter(tt => t >= tt).length;
  const wordBuilt = F2_WORD.slice(0, nTapped).join("");
  const partial  = SEQ1.slice(0, nTapped);
  const selSet   = new Set(partial.filter(i => i !== 0));
  const panelP   = eo(prog(t, 0, 280));

  return (
    <div style={{ width:FW, height:FH, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:180, left:SX, right:FW-950,
        height:120, background:NAVY2, borderRadius:22,
        display:"flex", alignItems:"center", paddingLeft:46, paddingRight:38,
        boxSizing:"border-box",
        opacity:panelP, transform:`translateY(${lerp(-28,0,panelP)}px)`,
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:YLW }}>
          {wordBuilt}
        </span>
        {nTapped < 8 && (
          <span style={{
            display:"inline-block", width:5, height:70,
            background:"rgba(249,227,0,0.38)", borderRadius:3, marginLeft:6,
          }} />
        )}
      </div>
      <AnimHex
        letters={P1} cx={540} cy={920} t={t}
        entryStart={0} entryStagger={40} entryDur={200}
        selIdx={[...selSet]} pathSeq={partial}
      />
    </div>
  );
}

// F3 — Solved (2000 ms) ───────────────────────────────────────────────────────
export function AnimF3({ t }: { t: number }) {
  const panelP   = eoBack(prog(t, 0, 380));
  const checkP   = eoBack(prog(t, 280, 280));
  const scoreP   = eoBack(prog(t, 340, 420));
  const pangramP = eoBack(prog(t, 760, 340));

  return (
    <div style={{ width:FW, height:FH, background:BLUE, position:"relative" }}>
      {/* Solved panel */}
      <div style={{
        position:"absolute", top:180, left:SX, right:FW-950,
        height:120, background:NAVY2, borderRadius:22,
        display:"flex", alignItems:"center", paddingLeft:46, paddingRight:38, gap:22,
        boxSizing:"border-box",
        opacity:Math.min(panelP,1),
        transform:`scale(${lerp(0.88,1,Math.min(panelP,1))})`,
        transformOrigin:"left center",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:YLW, flex:1 }}>
          POLÉMIKO
        </span>
        <div style={{
          width:72, height:72, borderRadius:"50%", background:YLW, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transform:`scale(${eoBack(checkP)})`,
        }}>
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
            <path d="M2 13L13 24L32 4" stroke={NAVY} strokeWidth="4.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* +15 */}
      <div style={{
        position:"absolute", top:352, left:SX,
        display:"flex", alignItems:"baseline", gap:20,
        opacity:Math.min(scoreP,1),
        transform:`scale(${scoreP}) translateY(${lerp(30,0,Math.min(scoreP,1))}px)`,
        transformOrigin:"left bottom",
      }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:152, color:YLW, lineHeight:1 }}>+15</span>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:52, color:CREAM, opacity:0.7 }}>punto</span>
      </div>

      {/* ★ PANGRAMA! */}
      <div style={{
        position:"absolute", top:550, left:SX,
        display:"flex", alignItems:"center", gap:18,
        opacity:Math.min(pangramP,1),
        transform:`translateY(${lerp(24,0,Math.min(pangramP,1))}px)`,
      }}>
        <span style={{ fontSize:56, lineHeight:1 }}>★</span>
        <span style={{ fontFamily:BG_F, fontWeight:700, fontSize:62, color:YLW, letterSpacing:"0.04em" }}>
          PANGRAMA!
        </span>
      </div>

      <HexPuzzle letters={P1} cx={540} cy={1040} dim theme="dark" />
    </div>
  );
}

// F4 — Challenge (3000 ms) ────────────────────────────────────────────────────
const F4_TAPS = [900, 1500, 2100];

export function AnimF4({ t }: { t: number }) {
  const nTapped  = F4_TAPS.filter(tt => t >= tt).length;
  const partial  = SEQ2P.slice(0, nTapped);
  const selSet   = new Set(partial.filter(i => i !== 0));
  const wordBuilt = "DAN".slice(0, nTapped);
  const headP    = eo(prog(t, 0, 480));
  const panelP   = eo(prog(t, 380, 320));
  const blink    = nTapped >= 3 && Math.floor(t / 500) % 2 === 0;

  return (
    <div style={{ width:FW, height:FH, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:180, left:SX, right:FW-950,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.02, color:NAVY,
        opacity:headP, transform:`translateY(${lerp(50,0,headP)}px)`,
      }}>Fásil?<br />Prueba<br />esaki…</div>

      <div style={{
        position:"absolute", top:510, left:SX, right:FW-950,
        height:120, background:NAVY2, borderRadius:22,
        display:"flex", alignItems:"center", paddingLeft:46, gap:6,
        boxSizing:"border-box",
        opacity:panelP, transform:`translateY(${lerp(20,0,panelP)}px)`,
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:YLW }}>
          {wordBuilt}
        </span>
        <span style={{
          display:"inline-block", width:5, height:70,
          background:blink ? "rgba(249,227,0,0.38)" : "transparent", borderRadius:3,
        }} />
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:80, letterSpacing:"0.03em", color:"rgba(249,227,0,0.13)" }}>
          {"____".slice(0, 4 - nTapped)}
        </span>
      </div>

      <AnimHex
        letters={P2} cx={540} cy={980} t={t}
        entryStart={200} entryStagger={70} entryDur={260}
        selIdx={[...selSet]} pathSeq={partial}
      />
    </div>
  );
}

// F5 — End card (4000 ms) ─────────────────────────────────────────────────────
const F5_CTA_ENTRY = 1400;
const F5_CTA_DONE  = 1900; // eoBack(500ms) overshoots and settles here

export function AnimF5({ t }: { t: number }) {
  const brandP  = eo(prog(t, 0, 420));
  const hookP   = eo(prog(t, 260, 520));
  const hexP    = eo(prog(t, 500, 900));

  // Pill slams up: both translateY and scale use eoBack so they land together
  const ctaP   = eoBack(prog(t, F5_CTA_ENTRY, 480));
  const slideY = lerp(340, 0, ctaP); // rises 340px from below its resting spot

  // Arrow nudges right on a loop after pill settles (~500ms period, ease in-out)
  const settled = Math.max(0, t - F5_CTA_DONE);
  const arrowCycle = (settled % 520) / 520;           // 0→1 per cycle
  const arrowX = settled > 0
    ? 22 * Math.pow(Math.sin(arrowCycle * Math.PI), 2) // smooth bump right
    : 0;

  return (
    <div style={{ width:FW, height:FH, background:NAVY, position:"relative", overflow:"hidden" }}>
      {/* Ghost hex fades in */}
      <div style={{ position:"absolute", inset:0, opacity:0.07*hexP }}>
        <HexPuzzle letters={P1} cx={540} cy={1020} theme="dark" />
      </div>

      <div style={{
        position:"absolute", top:230, left:SX,
        fontFamily:BG_F, fontWeight:700, fontSize:50, color:CREAM, letterSpacing:"-0.01em",
        opacity:brandP, transform:`translateY(${lerp(20,0,brandP)}px)`,
      }}>Palabra di Kòrsou</div>

      <div style={{
        position:"absolute", top:336, left:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.04, color:CREAM,
        opacity:hookP, transform:`translateY(${lerp(40,0,hookP)}px)`,
      }}>Kon bon bo<br />Papiamentu ta?</div>

      {/* CTA pill — slams up from below with eoBack overshoot */}
      <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
        style={{
          position:"absolute", bottom:904,
          left:"50%",
          transform:`translateX(-50%) translateY(${slideY}px) scale(${Math.max(0, ctaP)})`,
          transformOrigin:"center bottom",
          width:740, height:132, borderRadius:66,
          background:YLW, textDecoration:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:0,
          opacity:Math.min(Math.max(0, ctaP * 3), 1),
        }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:68, color:NAVY, letterSpacing:"-0.01em" }}>
          HUNGA AWOR&nbsp;
        </span>
        {/* Arrow nudges right on a loop */}
        <span style={{
          fontFamily:BG_F, fontWeight:800, fontSize:68, color:NAVY,
          display:"inline-block",
          transform:`translateX(${arrowX}px)`,
        }}>→</span>
      </a>

      {/* Reinforcement line — fades in after CTA, within safe zone */}
      <div style={{
        position:"absolute", bottom:840, left:0, right:0, textAlign:"center",
        fontFamily:UI_F, fontWeight:500, fontSize:34, color:CREAM,
        opacity:0.38 * eo(prog(t, F5_CTA_DONE + 200, 400)),
        letterSpacing:"0.02em",
      }}>Gratis di hunga · Un wega nobo tur dia</div>

    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// 16:9 ANIMATED FRAMES
// ════════════════════════════════════════════════════════════════════════════════

export function AnimF1Wide({ t }: { t: number }) {
  const pts     = hexPts(HEX16_CX, HEX16_CY, HR);
  const headP   = eoBack(prog(t, 0, 360));
  const OUTER_DUR = 220;
  const kP      = eoBack(prog(t, F1_K_ENTRY, 360));
  const kDropY  = lerp(-140, 0, kP);
  const kScale  = Math.max(0, kP);
  const pulse1  = t > F1_K_DONE ? 0.12 * Math.sin(prog(t, F1_K_DONE, 340) * Math.PI) : 0;
  const pulse2  = t > F1_K_DONE + 420 ? 0.08 * Math.sin(prog(t, F1_K_DONE + 420, 280) * Math.PI) : 0;
  const kFinal  = kScale * (1 + pulse1 + pulse2);
  const ruleP   = eo(prog(t, F1_K_DONE + 60, 320));

  return (
    <div style={{ width:FW16, height:FH16, background:YLW, position:"relative", overflow:"hidden" }}>
      {/* Left — headline */}
      <div style={{
        position:"absolute", left:SX16, top:220, right:FW16/2,
        fontFamily:BG_F, fontWeight:800, fontSize:110, lineHeight:1.04, color:NAVY,
        opacity:Math.min(headP, 1),
        transform:`translateX(${lerp(-80, 0, Math.min(headP, 1))}px)`,
      }}>Bo ta mira<br />e palabra?</div>
      <div style={{
        position:"absolute", left:SX16, top:490, right:FW16/2,
        fontFamily:UI_F, fontWeight:700, fontSize:28, color:NAVY,
        opacity:0.5 * eo(prog(t, 280, 240)), letterSpacing:"0.01em",
      }}>Palabra di Kòrsou · E wega di palabra</div>

      {/* Right — hex */}
      {[1,2,3,4,5,6].map((i, ord) => {
        const sc = eoBack(prog(t, F1_OUTER_START + ord*F1_OUTER_STAG, OUTER_DUR));
        return (
          <Circle key={i} letter={P1[i]}
            cx={pts[i].x} cy={pts[i].y} size={OD}
            yellow={false} theme="yellow"
            scale={sc} opacity={Math.min(sc * 1.5, 1)}
          />
        );
      })}
      <Circle letter={P1[0]}
        cx={pts[0].x} cy={pts[0].y} size={CD}
        yellow theme="yellow"
        scale={kFinal} translateY={kDropY}
        opacity={Math.min(prog(t, F1_K_ENTRY, 140), 1)}
      />

      {/* Rule hint */}
      <div style={{
        position:"absolute", bottom:44, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:12,
        opacity:ruleP,
      }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:NAVY,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:UI_F, fontWeight:700, fontSize:18, color:YLW }}>K</div>
        <span style={{ fontFamily:UI_F, fontWeight:600, fontSize:32, color:NAVY }}>
          mester den tur palabra
        </span>
      </div>
    </div>
  );
}

export function AnimF2Wide({ t }: { t: number }) {
  const nTapped   = F2_TAPS.filter(tt => t >= tt).length;
  const wordBuilt = F2_WORD.slice(0, nTapped).join("");
  const partial   = SEQ1.slice(0, nTapped);
  const selSet    = new Set(partial.filter(i => i !== 0));
  const panelP    = eo(prog(t, 0, 280));

  return (
    <div style={{ width:FW16, height:FH16, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:80, left:SX16, right:SX16,
        height:110, background:NAVY2, borderRadius:20,
        display:"flex", alignItems:"center", paddingLeft:46, boxSizing:"border-box",
        opacity:panelP, transform:`translateY(${lerp(-24,0,panelP)}px)`,
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:70,
          letterSpacing:"0.03em", color:YLW }}>{wordBuilt}</span>
        {nTapped < 8 && <span style={{ display:"inline-block", width:5, height:58,
          background:"rgba(249,227,0,0.38)", borderRadius:3, marginLeft:6 }} />}
      </div>
      <AnimHex letters={P1} cx={960} cy={640} t={t}
        entryStart={0} entryStagger={40} entryDur={200}
        selIdx={[...selSet]} pathSeq={partial}
        svgW={FW16} svgH={FH16} />
    </div>
  );
}

export function AnimF3Wide({ t }: { t: number }) {
  const panelP   = eoBack(prog(t, 0, 380));
  const checkP   = eoBack(prog(t, 280, 280));
  const scoreP   = eoBack(prog(t, 340, 420));
  const pangramP = eoBack(prog(t, 760, 340));

  return (
    <div style={{ width:FW16, height:FH16, background:BLUE, position:"relative" }}>
      {/* Solved hex — left */}
      <HexPuzzle letters={P1} cx={420} cy={540} selIdx={[1,2,3,4,5,6]}
        pathSeq={SEQ1} theme="dark" svgW={FW16} svgH={FH16} />

      {/* Right — reveals */}
      <div style={{ position:"absolute", left:FW16/2+40, top:80, right:SX16 }}>
        <div style={{
          height:100, background:NAVY2, borderRadius:18, marginBottom:32,
          display:"flex", alignItems:"center", paddingLeft:36, paddingRight:32, gap:18,
          boxSizing:"border-box",
          opacity:Math.min(panelP,1),
          transform:`scale(${lerp(0.88,1,Math.min(panelP,1))})`,
          transformOrigin:"left center",
        }}>
          <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:64,
            letterSpacing:"0.03em", color:YLW, flex:1 }}>POLÉMIKO</span>
          <div style={{ width:60, height:60, borderRadius:"50%", background:YLW, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            transform:`scale(${eoBack(checkP)})` }}>
            <svg width="28" height="22" viewBox="0 0 34 26" fill="none">
              <path d="M2 13L13 24L32 4" stroke={NAVY} strokeWidth="4.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={{
          display:"flex", alignItems:"baseline", gap:16, marginBottom:24,
          opacity:Math.min(scoreP,1),
          transform:`translateY(${lerp(24,0,Math.min(scoreP,1))}px)`,
        }}>
          <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:120, color:YLW, lineHeight:1 }}>+15</span>
          <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:44, color:CREAM, opacity:0.7 }}>punto</span>
        </div>

        <div style={{
          display:"flex", alignItems:"center", gap:14,
          opacity:Math.min(pangramP,1),
          transform:`translateY(${lerp(20,0,Math.min(pangramP,1))}px)`,
        }}>
          <span style={{ fontSize:46, lineHeight:1 }}>★</span>
          <span style={{ fontFamily:BG_F, fontWeight:700, fontSize:52,
            color:YLW, letterSpacing:"0.04em" }}>PANGRAMA!</span>
        </div>
      </div>
    </div>
  );
}

export function AnimF4Wide({ t }: { t: number }) {
  const nTapped   = F4_TAPS.filter(tt => t >= tt).length;
  const partial   = SEQ2P.slice(0, nTapped);
  const selSet    = new Set(partial.filter(i => i !== 0));
  const wordBuilt = "DAN".slice(0, nTapped);
  const headP     = eo(prog(t, 0, 480));
  const panelP    = eo(prog(t, 380, 320));
  const blink     = nTapped >= 3 && Math.floor(t / 500) % 2 === 0;

  return (
    <div style={{ width:FW16, height:FH16, background:CREAM, position:"relative" }}>
      {/* Left — challenge */}
      <div style={{ position:"absolute", left:SX16, top:0, bottom:0, right:FW16/2,
        display:"flex", flexDirection:"column", justifyContent:"center", gap:24 }}>
        <div style={{
          fontFamily:BG_F, fontWeight:800, fontSize:90, lineHeight:1.02, color:NAVY,
          opacity:headP, transform:`translateY(${lerp(40,0,headP)}px)`,
        }}>Fásil?<br />Prueba<br />esaki…</div>
        <div style={{
          height:100, background:NAVY2, borderRadius:18,
          display:"flex", alignItems:"center", paddingLeft:36, gap:6, boxSizing:"border-box",
          opacity:panelP, transform:`translateY(${lerp(16,0,panelP)}px)`,
        }}>
          <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
            letterSpacing:"0.03em", color:YLW }}>{wordBuilt}</span>
          <span style={{ display:"inline-block", width:5, height:58,
            background:blink?"rgba(249,227,0,0.38)":"transparent", borderRadius:3 }}/>
          <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
            letterSpacing:"0.03em", color:"rgba(249,227,0,0.13)" }}>{"____".slice(0,4-nTapped)}</span>
        </div>
      </div>
      {/* Right — new puzzle */}
      <AnimHex letters={P2} cx={HEX16_CX} cy={HEX16_CY} t={t}
        entryStart={200} entryStagger={70} entryDur={260}
        selIdx={[...selSet]} pathSeq={partial}
        svgW={FW16} svgH={FH16} />
    </div>
  );
}

export function AnimF5Wide({ t }: { t: number }) {
  const brandP  = eo(prog(t, 0, 420));
  const hookP   = eo(prog(t, 260, 520));
  const ctaP    = eoBack(prog(t, F5_CTA_ENTRY, 480));
  const slideY  = lerp(200, 0, ctaP);
  const settled = Math.max(0, t - F5_CTA_DONE);
  const arrowX  = settled > 0
    ? 18 * Math.pow(Math.sin(((settled%520)/520) * Math.PI), 2) : 0;

  return (
    <div style={{ width:FW16, height:FH16, background:NAVY, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28 }}>
        <div style={{
          fontFamily:BG_F, fontWeight:700, fontSize:42, color:CREAM,
          opacity:brandP, transform:`translateY(${lerp(16,0,brandP)}px)`,
        }}>Palabra di Kòrsou</div>
        <div style={{
          fontFamily:BG_F, fontWeight:800, fontSize:72, lineHeight:1.04, color:CREAM,
          textAlign:"center",
          opacity:hookP, transform:`translateY(${lerp(32,0,hookP)}px)`,
        }}>Kon bon bo<br />Papiamentu ta?</div>
        <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
          style={{
            display:"flex", alignItems:"center", gap:0,
            background:YLW, borderRadius:60,
            padding:"22px 52px", textDecoration:"none", cursor:"pointer",
            fontFamily:BG_F, fontWeight:800, fontSize:52, color:NAVY, letterSpacing:"-0.01em",
            transform:`translateY(${slideY}px) scale(${Math.max(0, ctaP)})`,
            transformOrigin:"center bottom",
            opacity:Math.min(Math.max(0, ctaP * 3), 1),
          }}>
          <span>HUNGA AWOR&nbsp;</span>
          <span style={{ display:"inline-block", transform:`translateX(${arrowX}px)` }}>→</span>
        </a>
        <div style={{
          fontFamily:UI_F, fontWeight:500, fontSize:24, color:CREAM,
          opacity:0.38 * eo(prog(t, F5_CTA_DONE + 200, 400)),
          letterSpacing:"0.02em",
        }}>Gratis di hunga · Un wega nobo tur dia</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Wide (16:9) preview — YouTube/Meta style
// ────────────────────────────────────────────────────────────────────────────────
function WidePreview({ onClose }: { onClose: () => void }) {
  const [elapsed, setElapsed] = React.useState(0);
  const [paused,  setPaused]  = React.useState(false);
  const rafRef   = React.useRef<number|null>(null);
  const lastRef  = React.useRef<number|null>(null);
  const audio    = React.useRef<Audio>(makeAudio());
  const fired    = React.useRef(new Set<string>());
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [scale,  setScale]    = React.useState(1);

  React.useEffect(() => {
    if (!shellRef.current) return;
    const ro = new ResizeObserver(entries => {
      setScale(entries[0].contentRect.width / FW16);
    });
    ro.observe(shellRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (paused) return;
    function tick(now: number) {
      if (lastRef.current === null) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      setElapsed(e => {
        const next = e + delta;
        if (next >= TOTAL_MS) { setPaused(true); return TOTAL_MS; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused]);

  React.useEffect(() => {
    for (const [cueMs, key, method] of SOUND_CUES) {
      if (elapsed >= cueMs && !fired.current.has(key)) {
        fired.current.add(key);
        (audio.current[method] as () => void)();
      }
    }
  }, [elapsed]);

  function togglePlay() {
    if (elapsed >= TOTAL_MS) {
      setElapsed(0); lastRef.current = null; fired.current.clear();
      popCounter = 0; tapCounter = 0; setPaused(false);
    } else {
      lastRef.current = null; setPaused(p => !p);
    }
  }

  const { fi, ft } = frameAt(elapsed);
  const pct = (elapsed / TOTAL_MS) * 100;
  const AnimFrames16 = [AnimF1Wide, AnimF2Wide, AnimF3Wide, AnimF4Wide, AnimF5Wide];
  const ActiveFrame  = AnimFrames16[fi];

  let cum = 0;
  const ticks = DURATIONS.slice(0,-1).map(d => { cum+=d; return (cum/TOTAL_MS)*100; });

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"#0a0a0a",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
    }}>
      {/* 16:9 frame */}
      <div style={{
        width:"calc(100vw - 48px)", maxWidth:1200,
        aspectRatio:"16/9",
        position:"relative", overflow:"hidden",
        borderRadius:10,
        boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <div ref={shellRef} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          <div style={{
            position:"absolute", top:0, left:0, width:FW16, height:FH16,
            transform:`scale(${scale})`, transformOrigin:"top left",
          }}>
            <ActiveFrame t={ft} />
          </div>
        </div>

        {/* Frame badge */}
        <div style={{
          position:"absolute", top:10, right:12,
          background:"rgba(0,0,0,0.5)", borderRadius:8,
          padding:"3px 9px",
          fontFamily:UI_F, fontWeight:700, fontSize:11, color:"rgba(255,255,255,0.7)",
          pointerEvents:"none",
        }}>{fi+1}/5</div>

        <div style={{ position:"absolute", inset:0, cursor:"pointer", zIndex:10 }}
          onClick={togglePlay} />
      </div>

      {/* Controls */}
      <div style={{
        display:"flex", alignItems:"center", gap:14,
        width:"calc(100vw - 48px)", maxWidth:1200, marginTop:14,
      }}>
        <button onClick={togglePlay} style={{
          width:44, height:44, borderRadius:"50%",
          background:YLW, border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          {paused || elapsed >= TOTAL_MS
            ? <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1l12 7-12 7V1z" fill={NAVY}/>
              </svg>
            : <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                <rect x="0.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
                <rect x="7.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
              </svg>
          }
        </button>
        <div style={{ flex:1 }}>
          <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.15)", position:"relative" }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0,
              width:`${pct}%`, background:YLW, borderRadius:2,
              transition:"width 0.05s linear",
            }}/>
            {ticks.map((p,i) => (
              <div key={i} style={{
                position:"absolute", top:-2, bottom:-2, left:`${p}%`,
                width:1.5, background:"rgba(255,255,255,0.25)", borderRadius:1,
              }}/>
            ))}
          </div>
          <div style={{
            marginTop:5, display:"flex", justifyContent:"space-between",
            fontFamily:UI_F, fontWeight:500, fontSize:10, color:"rgba(255,255,255,0.35)",
          }}>
            <span>{(elapsed/1000).toFixed(1)}s</span>
            <span>15.0s</span>
          </div>
        </div>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:11,
          color:"rgba(255,255,255,0.35)", flexShrink:0 }}>16:9</span>
      </div>

      <button onClick={onClose} style={{
        position:"fixed", top:18, right:20,
        background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)",
        color:"rgba(255,255,255,0.7)", borderRadius:"50%",
        width:36, height:36, cursor:"pointer", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>×</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TIKTOK PREVIEW
// ════════════════════════════════════════════════════════════════════════════════

const DURATIONS = [2000, 4000, 2000, 3000, 4000];
const TOTAL_MS  = DURATIONS.reduce((a,b)=>a+b,0);

function frameAt(ms: number) {
  let cum = 0;
  for (let i = 0; i < DURATIONS.length; i++) {
    if (ms < cum + DURATIONS[i]) return { fi:i, ft:ms-cum };
    cum += DURATIONS[i];
  }
  return { fi:DURATIONS.length-1, ft:DURATIONS[DURATIONS.length-1] };
}

// F1 starts at 0ms. K enters at F1_K_ENTRY ≈ 838ms.
// F2 starts at 2000ms. Taps at 2000+F2_TAPS[i].
// F3 starts at 6000ms. Success at 6350ms (scoreP starts at 340ms into F3).
// F4 starts at 8000ms. Challenge intro, taps at 8000+F4_TAPS[i].
// F5 starts at 11000ms. CTA at 1400ms into F5 = 12400ms.
// F3 starts at 6000ms, F4 at 8000ms, F5 at 11000ms
const SOUND_CUES: [number, string, keyof Audio][] = [
  // ── F1 ──────────────────────────────────────────────────────────────────────
  [0,          "f1head",   "whoosh"],   // headline snaps in
  ...Array.from({length:6}, (_,i): [number, string, keyof Audio] =>
    [F1_OUTER_START + i*F1_OUTER_STAG, `cpop${i}`, "pop"]),  // 6 ascending pops
  [F1_K_ENTRY, "kimpact",  "impact"],   // K drops and lands

  // ── F2 ──────────────────────────────────────────────────────────────────────
  [2000,       "f2panel",  "wordReveal"],  // word panel slides in
  ...F2_TAPS.map((t,i): [number, string, keyof Audio] =>
    [2000+t, `ltap${i}`, "letterTap"]),    // 8 melodic letter taps (C major scale)

  // ── F3 ──────────────────────────────────────────────────────────────────────
  [6050,       "f3panel",  "success"],     // solved panel + check
  [6340,       "f3coin",   "rewardCoin"],  // +15 bounces in
  [6760,       "f3star",   "pangrama"],    // ★ PANGRAMA! sparkle cascade

  // ── F4 ──────────────────────────────────────────────────────────────────────
  [8050,       "f4intro",  "challenge"],   // playful "uh oh" descend
  ...F4_TAPS.map((t,i): [number, string, keyof Audio] =>
    [8000+t, `f4tap${i}`, "letterTap"]),   // DAN taps continue the scale

  // ── F5 ──────────────────────────────────────────────────────────────────────
  [12400,      "f5cta",    "cta"],         // CTA pill slams in with bass + chord
];

function TikTokPreview({ onClose }: { onClose: () => void }) {
  const [elapsed, setElapsed] = React.useState(0);
  const [paused,  setPaused]  = React.useState(false);
  const rafRef   = React.useRef<number|null>(null);
  const lastRef  = React.useRef<number|null>(null);
  const audio    = React.useRef<Audio>(makeAudio());
  const fired    = React.useRef(new Set<string>());
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.36);

  React.useEffect(() => {
    if (!shellRef.current) return;
    const ro = new ResizeObserver(entries => {
      setScale(entries[0].contentRect.height / FH);
    });
    ro.observe(shellRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (paused) return;
    function tick(now: number) {
      if (lastRef.current === null) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      setElapsed(e => {
        const next = e + delta;
        if (next >= TOTAL_MS) { setPaused(true); return TOTAL_MS; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused]);

  React.useEffect(() => {
    for (const [cueMs, key, method] of SOUND_CUES) {
      if (elapsed >= cueMs && !fired.current.has(key)) {
        fired.current.add(key);
        (audio.current[method] as () => void)();
      }
    }
  }, [elapsed]);

  function togglePlay() {
    if (elapsed >= TOTAL_MS) {
      setElapsed(0); lastRef.current = null; fired.current.clear(); popCounter = 0; tapCounter = 0; setPaused(false);
    } else {
      lastRef.current = null; setPaused(p=>!p);
    }
  }

  const { fi, ft } = frameAt(elapsed);
  const pct = (elapsed / TOTAL_MS) * 100;
  const AnimFrames = [AnimF1, AnimF2, AnimF3, AnimF4, AnimF5];
  const ActiveFrame = AnimFrames[fi];

  let cum = 0;
  const ticks = DURATIONS.slice(0,-1).map(d => { cum+=d; return (cum/TOTAL_MS)*100; });

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(6,8,12,0.94)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:20,
    }}>
      {/* Phone shell */}
      <div style={{
        height:"calc(100vh - 100px)", aspectRatio:"9/16", position:"relative",
        borderRadius:32, overflow:"hidden",
        boxShadow:"0 0 0 1.5px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <div ref={shellRef} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          <div style={{
            position:"absolute", top:0, left:0, width:FW, height:FH,
            transform:`scale(${scale})`, transformOrigin:"top left",
          }}>
            <ActiveFrame t={ft} />
          </div>
        </div>

        {/* Right icons */}
        <div style={{
          position:"absolute", right:0, bottom:"18%", width:56, paddingRight:8,
          display:"flex", flexDirection:"column", alignItems:"center", gap:18,
          pointerEvents:"none",
        }}>
          {[{l:"♡",c:"48K"},{l:"💬",c:"1.4K"},{l:"↗",c:"Deel"}].map((ic,i) => (
            <div key={i} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              fontFamily:UI_F, fontWeight:700, fontSize:9, color:"#fff",
              textShadow:"0 1px 4px rgba(0,0,0,0.7)",
            }}>
              <span style={{ fontSize:22 }}>{ic.l}</span>
              <span>{ic.c}</span>
            </div>
          ))}
        </div>

        {/* Bottom caption */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"16%",
          background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding:"0 14px 14px", pointerEvents:"none",
        }}>
          <div style={{ fontFamily:UI_F, fontWeight:700, fontSize:11, color:"#fff", marginBottom:3 }}>
            @palabradikorsou
          </div>
          <div style={{ fontFamily:UI_F, fontWeight:500, fontSize:10, color:"rgba(255,255,255,0.82)" }}>
            Bo por haña POLÉMIKO? 🇨🇼 Hunga gratis ↓
          </div>
        </div>

        {/* Frame badge */}
        <div style={{
          position:"absolute", top:10, right:10,
          background:"rgba(0,0,0,0.42)", borderRadius:12,
          padding:"3px 9px",
          fontFamily:UI_F, fontWeight:700, fontSize:10, color:"rgba(255,255,255,0.7)",
          pointerEvents:"none",
        }}>{fi+1}/5</div>

        <div style={{ position:"absolute", inset:0, cursor:"pointer", zIndex:10 }}
          onClick={togglePlay} />
      </div>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:14, width:"min(360px,88vw)" }}>
        <button onClick={togglePlay} style={{
          width:44, height:44, borderRadius:"50%",
          background:YLW, border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          {paused || elapsed >= TOTAL_MS
            ? <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1l12 7-12 7V1z" fill={NAVY}/>
              </svg>
            : <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                <rect x="0.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
                <rect x="7.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
              </svg>
          }
        </button>
        <div style={{ flex:1 }}>
          <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.15)", position:"relative" }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0,
              width:`${pct}%`, background:YLW, borderRadius:2,
              transition:"width 0.05s linear",
            }} />
            {ticks.map((p,i) => (
              <div key={i} style={{
                position:"absolute", top:-2, bottom:-2, left:`${p}%`,
                width:1.5, background:"rgba(255,255,255,0.25)", borderRadius:1,
              }}/>
            ))}
          </div>
          <div style={{
            marginTop:5, display:"flex", justifyContent:"space-between",
            fontFamily:UI_F, fontWeight:500, fontSize:10, color:"rgba(255,255,255,0.35)",
          }}>
            <span>{(elapsed/1000).toFixed(1)}s</span>
            <span>15.0s</span>
          </div>
        </div>
      </div>

      <button onClick={onClose} style={{
        position:"fixed", top:18, right:20,
        background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)",
        color:"rgba(255,255,255,0.7)", borderRadius:"50%",
        width:36, height:36, cursor:"pointer", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>×</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// 16:9 FRAMES (1920 × 1080 — YouTube / Meta landscape)
// ════════════════════════════════════════════════════════════════════════════════
const FW16 = 1920;
const FH16 = 1080;
const SX16 = 100; // side margin

// Hex positioned right-of-centre for landscape split layouts
const HEX16_CX = 1380;
const HEX16_CY = 540;

function RuleHint16({ color=NAVY, kColor=YLW }: { color?: string; kColor?: string }) {
  return (
    <div style={{
      position:"absolute", bottom:44, left:0, right:0,
      display:"flex", alignItems:"center", justifyContent:"center", gap:12,
    }}>
      <div style={{
        width:40, height:40, borderRadius:"50%", background:color,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:UI_F, fontWeight:700, fontSize:20, color:kColor, flexShrink:0,
      }}>K</div>
      <span style={{ fontFamily:UI_F, fontWeight:600, fontSize:34, color }}>
        mester den tur palabra
      </span>
    </div>
  );
}

function Frame1Wide() {
  return (
    <div style={{ width:FW16, height:FH16, background:YLW, position:"relative" }}>
      {/* Left — text column */}
      <div style={{ position:"absolute", left:SX16, top:220, right:FW16/2 }}>
        <div style={{ fontFamily:BG_F, fontWeight:800, fontSize:120, lineHeight:1.04, color:NAVY }}>
          Bo ta mira<br />e palabra?
        </div>
        <div style={{ marginTop:32, fontFamily:UI_F, fontWeight:700, fontSize:30,
          color:NAVY, opacity:0.5, letterSpacing:"0.01em" }}>
          Palabra di Kòrsou · E wega di palabra
        </div>
      </div>
      {/* Right — hex */}
      <HexPuzzle letters={P1} cx={HEX16_CX} cy={HEX16_CY}
        theme="yellow" svgW={FW16} svgH={FH16} />
      <RuleHint16 />
    </div>
  );
}

function Frame2Wide() {
  return (
    <div style={{ width:FW16, height:FH16, background:CREAM, position:"relative" }}>
      {/* Word panel — full width at top */}
      <div style={{
        position:"absolute", top:80, left:SX16, right:SX16,
        height:110, background:NAVY2, borderRadius:20,
        display:"flex", alignItems:"center", paddingLeft:46, boxSizing:"border-box",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:74,
          letterSpacing:"0.03em", color:YLW }}>POLÉMIK</span>
        <span style={{ display:"inline-block", width:5, height:62,
          background:"rgba(249,227,0,0.38)", borderRadius:3, marginLeft:6 }} />
      </div>
      {/* Hex — centered */}
      <HexPuzzle letters={P1} cx={960} cy={640}
        selIdx={[1,2,3,4,5,6]}
        pathSeq={SEQ1.slice(0,7)}
        svgW={FW16} svgH={FH16} />
    </div>
  );
}

function Frame3Wide() {
  return (
    <div style={{ width:FW16, height:FH16, background:BLUE, position:"relative" }}>
      {/* Hex left — solved */}
      <HexPuzzle letters={P1} cx={480} cy={HEX16_CY}
        selIdx={[1,2,3,4,5,6]} pathSeq={SEQ1}
        theme="dark" svgW={FW16} svgH={FH16} />
      {/* Right — word reveal */}
      <div style={{ position:"absolute", left:FW16/2+40, top:0, bottom:0,
        display:"flex", flexDirection:"column", justifyContent:"center", gap:20 }}>
        <div style={{ fontFamily:BG_F, fontWeight:800, fontSize:110,
          letterSpacing:"0.04em", color:YLW, lineHeight:1 }}>
          POLÉMIKO
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {[1,2,3].map(i => (
            <svg key={i} width="48" height="46" viewBox="0 0 48 46" fill="none">
              <path d="M24 2l5.6 11.3L43 15.3l-9.5 9.3 2.2 13-11.7-6.1-11.7 6.1 2.2-13L5 15.3l13.4-2L24 2z"
                fill={YLW} />
            </svg>
          ))}
        </div>
        <div style={{ fontFamily:UI_F, fontWeight:600, fontSize:34,
          color:"rgba(255,255,255,0.7)" }}>
          8 di 8 letra · 3 estreya
        </div>
      </div>
    </div>
  );
}

function Frame4Wide() {
  return (
    <div style={{ width:FW16, height:FH16, background:CREAM, position:"relative" }}>
      {/* Left — challenge text */}
      <div style={{ position:"absolute", left:SX16, top:0, bottom:0, right:FW16/2,
        display:"flex", flexDirection:"column", justifyContent:"center", gap:18 }}>
        <div style={{ fontFamily:BG_F, fontWeight:800, fontSize:100,
          lineHeight:1.06, color:NAVY }}>
          Awor<br />bo toka?
        </div>
        <div style={{ fontFamily:UI_F, fontWeight:600, fontSize:34, color:NAVY, opacity:0.55 }}>
          Un wega nobo tur dia
        </div>
      </div>
      {/* Right — next hex puzzle */}
      <HexPuzzle letters={P2} cx={HEX16_CX} cy={HEX16_CY}
        selIdx={[2,1,0]} pathSeq={SEQ2P}
        svgW={FW16} svgH={FH16} />
    </div>
  );
}

function Frame5Wide() {
  return (
    <div style={{ width:FW16, height:FH16, background:NAVY, position:"relative" }}>
      {/* Centered CTA */}
      <div style={{ position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32 }}>
        <div style={{ fontFamily:BG_F, fontWeight:800, fontSize:68,
          color:CREAM, textAlign:"center", lineHeight:1.12 }}>
          Gratis di hunga<br />Un wega nobo tur dia
        </div>
        <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
          style={{
            display:"flex", alignItems:"center", gap:18,
            background:YLW, border:"none", borderRadius:80,
            padding:"26px 56px", cursor:"pointer", textDecoration:"none",
            fontFamily:BG_F, fontWeight:800, fontSize:44, color:NAVY,
            letterSpacing:"0.02em",
          }}>
          Hunga awor
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16h20M18 8l8 8-8 8" stroke={NAVY}
              strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <div style={{ fontFamily:UI_F, fontWeight:600, fontSize:28,
          color:CREAM, opacity:0.4, letterSpacing:"0.03em" }}>
          palabradikorsou.com
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// 1:1 FRAMES (1080 × 1080 — Instagram / Meta square)
// ════════════════════════════════════════════════════════════════════════════════
const FW11 = 1080;
const FH11 = 1080;
// Hex sits just below centre — top of circles ≈ y337, bottom ≈ y863
const HEX11_CX = 540;
const HEX11_CY = 600;

// ── Static 1:1 ───────────────────────────────────────────────────────────────

function Frame1_11() {
  return (
    <div style={{ width:FW11, height:FH11, background:YLW, position:"relative" }}>
      <div style={{ position:"absolute", top:80, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.04, color:NAVY }}>
        Bo ta mira<br />e palabra?
      </div>
      <HexPuzzle letters={P1} cx={HEX11_CX} cy={HEX11_CY} theme="yellow" />
      <div style={{ position:"absolute", bottom:40, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:NAVY,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:UI_F, fontWeight:700, fontSize:20, color:YLW }}>K</div>
        <span style={{ fontFamily:UI_F, fontWeight:600, fontSize:34, color:NAVY }}>
          mester den tur palabra
        </span>
      </div>
    </div>
  );
}

function Frame2_11() {
  return (
    <div style={{ width:FW11, height:FH11, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:60, left:SX, right:SX,
        height:110, background:NAVY2, borderRadius:20,
        display:"flex", alignItems:"center", paddingLeft:46, boxSizing:"border-box",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:72,
          letterSpacing:"0.03em", color:YLW }}>POLÉMIK</span>
        <span style={{ display:"inline-block", width:5, height:60,
          background:"rgba(249,227,0,0.38)", borderRadius:3, marginLeft:6 }} />
      </div>
      <HexPuzzle letters={P1} cx={HEX11_CX} cy={640}
        selIdx={[1,2,3,4,5,6]} pathSeq={SEQ1} />
    </div>
  );
}

function Frame3_11() {
  return (
    <div style={{ width:FW11, height:FH11, background:BLUE, position:"relative" }}>
      <div style={{ position:"absolute", top:60, left:SX, right:SX,
        height:100, background:NAVY2, borderRadius:18,
        display:"flex", alignItems:"center", paddingLeft:40, paddingRight:32, gap:16,
        boxSizing:"border-box" }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:62,
          letterSpacing:"0.03em", color:YLW, flex:1 }}>POLÉMIKO</span>
        <div style={{ width:58, height:58, borderRadius:"50%", background:YLW, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="28" height="22" viewBox="0 0 34 26" fill="none">
            <path d="M2 13L13 24L32 4" stroke={NAVY} strokeWidth="4.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ position:"absolute", top:210, left:SX,
        display:"flex", alignItems:"baseline", gap:16 }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:110, color:YLW, lineHeight:1 }}>+15</span>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:46, color:CREAM, opacity:0.7 }}>punto</span>
      </div>
      <div style={{ position:"absolute", top:355, left:SX,
        display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:46 }}>★</span>
        <span style={{ fontFamily:BG_F, fontWeight:700, fontSize:52, color:YLW, letterSpacing:"0.04em" }}>
          PANGRAMA!
        </span>
      </div>
      <HexPuzzle letters={P1} cx={HEX11_CX} cy={750} dim theme="dark" />
    </div>
  );
}

function Frame4_11() {
  return (
    <div style={{ width:FW11, height:FH11, background:CREAM, position:"relative" }}>
      <div style={{ position:"absolute", top:60, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:80, lineHeight:1.02, color:NAVY }}>
        Fásil?<br />Prueba<br />esaki…
      </div>
      <div style={{
        position:"absolute", top:330, left:SX, right:SX,
        height:96, background:NAVY2, borderRadius:18,
        display:"flex", alignItems:"center", paddingLeft:40, gap:6, boxSizing:"border-box",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
          letterSpacing:"0.03em", color:YLW }}>DAN</span>
        <span style={{ display:"inline-block", width:5, height:58,
          background:"rgba(249,227,0,0.35)", borderRadius:3 }} />
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
          letterSpacing:"0.03em", color:"rgba(249,227,0,0.13)" }}>____</span>
      </div>
      <HexPuzzle letters={P2} cx={HEX11_CX} cy={730} selIdx={[1,2]} pathSeq={SEQ2P} />
    </div>
  );
}

function Frame5_11() {
  return (
    <div style={{ width:FW11, height:FH11, background:NAVY, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.06 }}>
        <HexPuzzle letters={P1} cx={HEX11_CX} cy={HEX11_CY} theme="dark" />
      </div>
      <div style={{ position:"absolute", inset:0,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
        <div style={{ fontFamily:BG_F, fontWeight:700, fontSize:44, color:CREAM,
          letterSpacing:"-0.01em" }}>Palabra di Kòrsou</div>
        <div style={{ fontFamily:BG_F, fontWeight:800, fontSize:72, lineHeight:1.04,
          color:CREAM, textAlign:"center" }}>
          Kon bon bo<br />Papiamentu ta?
        </div>
        <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
          style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            background:YLW, borderRadius:60,
            padding:"22px 52px", textDecoration:"none", cursor:"pointer",
            fontFamily:BG_F, fontWeight:800, fontSize:52, color:NAVY, letterSpacing:"-0.01em",
          }}>HUNGA AWOR →</a>
        <div style={{ fontFamily:UI_F, fontWeight:500, fontSize:26,
          color:CREAM, opacity:0.35, letterSpacing:"0.02em" }}>
          Gratis di hunga · Un wega nobo tur dia
        </div>
      </div>
    </div>
  );
}

// ── Animated 1:1 ─────────────────────────────────────────────────────────────

export function AnimF1_11({ t }: { t: number }) {
  const pts    = hexPts(HEX11_CX, HEX11_CY, HR);
  const headP  = eoBack(prog(t, 0, 360));
  const OUTER_DUR = 220;
  const kP     = eoBack(prog(t, F1_K_ENTRY, 360));
  const kDropY = lerp(-120, 0, kP);
  const kScale = Math.max(0, kP);
  const pulse1 = t > F1_K_DONE ? 0.12 * Math.sin(prog(t, F1_K_DONE, 340) * Math.PI) : 0;
  const pulse2 = t > F1_K_DONE + 420 ? 0.08 * Math.sin(prog(t, F1_K_DONE + 420, 280) * Math.PI) : 0;
  const kFinal = kScale * (1 + pulse1 + pulse2);
  const ruleP  = eo(prog(t, F1_K_DONE + 60, 320));

  return (
    <div style={{ width:FW11, height:FH11, background:YLW, position:"relative", overflow:"hidden" }}>
      <div style={{
        position:"absolute", top:80, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:88, lineHeight:1.04, color:NAVY,
        opacity:Math.min(headP, 1),
        transform:`translateY(${lerp(60, 0, Math.min(headP, 1))}px)`,
      }}>Bo ta mira<br />e palabra?</div>

      {[1,2,3,4,5,6].map((i, ord) => {
        const sc = eoBack(prog(t, F1_OUTER_START + ord*F1_OUTER_STAG, OUTER_DUR));
        return (
          <Circle key={i} letter={P1[i]}
            cx={pts[i].x} cy={pts[i].y} size={OD}
            yellow={false} theme="yellow"
            scale={sc} opacity={Math.min(sc * 1.5, 1)}
          />
        );
      })}
      <Circle letter={P1[0]}
        cx={pts[0].x} cy={pts[0].y} size={CD}
        yellow theme="yellow"
        scale={kFinal} translateY={kDropY}
        opacity={Math.min(prog(t, F1_K_ENTRY, 140), 1)}
      />

      <div style={{ position:"absolute", bottom:40, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:12,
        opacity:ruleP }}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:NAVY,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:UI_F, fontWeight:700, fontSize:20, color:YLW }}>K</div>
        <span style={{ fontFamily:UI_F, fontWeight:600, fontSize:34, color:NAVY }}>
          mester den tur palabra
        </span>
      </div>
    </div>
  );
}

export function AnimF2_11({ t }: { t: number }) {
  const nTapped   = F2_TAPS.filter(tt => t >= tt).length;
  const wordBuilt = F2_WORD.slice(0, nTapped).join("");
  const partial   = SEQ1.slice(0, nTapped);
  const selSet    = new Set(partial.filter(i => i !== 0));
  const panelP    = eo(prog(t, 0, 280));

  return (
    <div style={{ width:FW11, height:FH11, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:60, left:SX, right:SX,
        height:110, background:NAVY2, borderRadius:20,
        display:"flex", alignItems:"center", paddingLeft:46, boxSizing:"border-box",
        opacity:panelP, transform:`translateY(${lerp(-24,0,panelP)}px)`,
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:72,
          letterSpacing:"0.03em", color:YLW }}>{wordBuilt}</span>
        {nTapped < 8 && <span style={{ display:"inline-block", width:5, height:58,
          background:"rgba(249,227,0,0.38)", borderRadius:3, marginLeft:6 }} />}
      </div>
      <AnimHex letters={P1} cx={HEX11_CX} cy={640} t={t}
        entryStart={0} entryStagger={40} entryDur={200}
        selIdx={[...selSet]} pathSeq={partial} />
    </div>
  );
}

export function AnimF3_11({ t }: { t: number }) {
  const panelP   = eoBack(prog(t, 0, 380));
  const checkP   = eoBack(prog(t, 280, 280));
  const scoreP   = eoBack(prog(t, 340, 420));
  const pangramP = eoBack(prog(t, 760, 340));

  return (
    <div style={{ width:FW11, height:FH11, background:BLUE, position:"relative" }}>
      <div style={{
        position:"absolute", top:60, left:SX, right:SX,
        height:100, background:NAVY2, borderRadius:18,
        display:"flex", alignItems:"center", paddingLeft:40, paddingRight:32, gap:16,
        boxSizing:"border-box",
        opacity:Math.min(panelP,1),
        transform:`scale(${lerp(0.88,1,Math.min(panelP,1))})`,
        transformOrigin:"left center",
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:62,
          letterSpacing:"0.03em", color:YLW, flex:1 }}>POLÉMIKO</span>
        <div style={{ width:58, height:58, borderRadius:"50%", background:YLW, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transform:`scale(${eoBack(checkP)})` }}>
          <svg width="28" height="22" viewBox="0 0 34 26" fill="none">
            <path d="M2 13L13 24L32 4" stroke={NAVY} strokeWidth="4.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{
        position:"absolute", top:210, left:SX,
        display:"flex", alignItems:"baseline", gap:16,
        opacity:Math.min(scoreP,1),
        transform:`translateY(${lerp(24,0,Math.min(scoreP,1))}px)`,
      }}>
        <span style={{ fontFamily:BG_F, fontWeight:800, fontSize:110, color:YLW, lineHeight:1 }}>+15</span>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:46, color:CREAM, opacity:0.7 }}>punto</span>
      </div>

      <div style={{
        position:"absolute", top:355, left:SX,
        display:"flex", alignItems:"center", gap:14,
        opacity:Math.min(pangramP,1),
        transform:`translateY(${lerp(20,0,Math.min(pangramP,1))}px)`,
      }}>
        <span style={{ fontSize:46 }}>★</span>
        <span style={{ fontFamily:BG_F, fontWeight:700, fontSize:52,
          color:YLW, letterSpacing:"0.04em" }}>PANGRAMA!</span>
      </div>

      <HexPuzzle letters={P1} cx={HEX11_CX} cy={750} dim theme="dark" />
    </div>
  );
}

export function AnimF4_11({ t }: { t: number }) {
  const nTapped   = F4_TAPS.filter(tt => t >= tt).length;
  const partial   = SEQ2P.slice(0, nTapped);
  const selSet    = new Set(partial.filter(i => i !== 0));
  const wordBuilt = "DAN".slice(0, nTapped);
  const headP     = eo(prog(t, 0, 480));
  const panelP    = eo(prog(t, 380, 320));
  const blink     = nTapped >= 3 && Math.floor(t / 500) % 2 === 0;

  return (
    <div style={{ width:FW11, height:FH11, background:CREAM, position:"relative" }}>
      <div style={{
        position:"absolute", top:60, left:SX, right:SX,
        fontFamily:BG_F, fontWeight:800, fontSize:80, lineHeight:1.02, color:NAVY,
        opacity:headP, transform:`translateY(${lerp(40,0,headP)}px)`,
      }}>Fásil?<br />Prueba<br />esaki…</div>

      <div style={{
        position:"absolute", top:330, left:SX, right:SX,
        height:96, background:NAVY2, borderRadius:18,
        display:"flex", alignItems:"center", paddingLeft:40, gap:6, boxSizing:"border-box",
        opacity:panelP, transform:`translateY(${lerp(16,0,panelP)}px)`,
      }}>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
          letterSpacing:"0.03em", color:YLW }}>{wordBuilt}</span>
        <span style={{ display:"inline-block", width:5, height:56,
          background:blink?"rgba(249,227,0,0.38)":"transparent", borderRadius:3 }}/>
        <span style={{ fontFamily:UI_F, fontWeight:700, fontSize:68,
          letterSpacing:"0.03em", color:"rgba(249,227,0,0.13)" }}>{"____".slice(0,4-nTapped)}</span>
      </div>

      <AnimHex letters={P2} cx={HEX11_CX} cy={730} t={t}
        entryStart={200} entryStagger={70} entryDur={260}
        selIdx={[...selSet]} pathSeq={partial} />
    </div>
  );
}

export function AnimF5_11({ t }: { t: number }) {
  const brandP  = eo(prog(t, 0, 420));
  const hookP   = eo(prog(t, 260, 520));
  const ctaP    = eoBack(prog(t, F5_CTA_ENTRY, 480));
  const slideY  = lerp(160, 0, ctaP);
  const settled = Math.max(0, t - F5_CTA_DONE);
  const arrowX  = settled > 0
    ? 18 * Math.pow(Math.sin(((settled%520)/520) * Math.PI), 2) : 0;

  return (
    <div style={{ width:FW11, height:FH11, background:NAVY, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.06 }}>
        <HexPuzzle letters={P1} cx={HEX11_CX} cy={HEX11_CY} theme="dark" />
      </div>
      <div style={{ position:"absolute", inset:0,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
        <div style={{
          fontFamily:BG_F, fontWeight:700, fontSize:44, color:CREAM,
          opacity:brandP, transform:`translateY(${lerp(16,0,brandP)}px)`,
        }}>Palabra di Kòrsou</div>
        <div style={{
          fontFamily:BG_F, fontWeight:800, fontSize:72, lineHeight:1.04,
          color:CREAM, textAlign:"center",
          opacity:hookP, transform:`translateY(${lerp(32,0,hookP)}px)`,
        }}>Kon bon bo<br />Papiamentu ta?</div>
        <a href="https://palabradikorsou.com/" target="_blank" rel="noopener noreferrer"
          style={{
            display:"flex", alignItems:"center",
            background:YLW, borderRadius:60,
            padding:"22px 52px", textDecoration:"none", cursor:"pointer",
            fontFamily:BG_F, fontWeight:800, fontSize:52, color:NAVY, letterSpacing:"-0.01em",
            transform:`translateY(${slideY}px) scale(${Math.max(0, ctaP)})`,
            transformOrigin:"center bottom",
            opacity:Math.min(Math.max(0, ctaP * 3), 1),
          }}>
          <span>HUNGA AWOR&nbsp;</span>
          <span style={{ display:"inline-block", transform:`translateX(${arrowX}px)` }}>→</span>
        </a>
        <div style={{
          fontFamily:UI_F, fontWeight:500, fontSize:24, color:CREAM,
          opacity:0.35 * eo(prog(t, F5_CTA_DONE + 200, 400)),
          letterSpacing:"0.02em",
        }}>Gratis di hunga · Un wega nobo tur dia</div>
      </div>
    </div>
  );
}

// ── 1:1 Preview ──────────────────────────────────────────────────────────────

function SquarePreview({ onClose }: { onClose: () => void }) {
  const [elapsed, setElapsed] = React.useState(0);
  const [paused,  setPaused]  = React.useState(false);
  const rafRef   = React.useRef<number|null>(null);
  const lastRef  = React.useRef<number|null>(null);
  const audio    = React.useRef<Audio>(makeAudio());
  const fired    = React.useRef(new Set<string>());
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [scale,  setScale]    = React.useState(1);

  React.useEffect(() => {
    if (!shellRef.current) return;
    const ro = new ResizeObserver(entries => {
      setScale(entries[0].contentRect.width / FW11);
    });
    ro.observe(shellRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (paused) return;
    function tick(now: number) {
      if (lastRef.current === null) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      setElapsed(e => {
        const next = e + delta;
        if (next >= TOTAL_MS) { setPaused(true); return TOTAL_MS; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused]);

  React.useEffect(() => {
    for (const [cueMs, key, method] of SOUND_CUES) {
      if (elapsed >= cueMs && !fired.current.has(key)) {
        fired.current.add(key);
        (audio.current[method] as () => void)();
      }
    }
  }, [elapsed]);

  function togglePlay() {
    if (elapsed >= TOTAL_MS) {
      setElapsed(0); lastRef.current = null; fired.current.clear();
      popCounter = 0; tapCounter = 0; setPaused(false);
    } else {
      lastRef.current = null; setPaused(p => !p);
    }
  }

  const { fi, ft } = frameAt(elapsed);
  const pct = (elapsed / TOTAL_MS) * 100;
  const AnimFrames11 = [AnimF1_11, AnimF2_11, AnimF3_11, AnimF4_11, AnimF5_11];
  const ActiveFrame  = AnimFrames11[fi];

  let cum = 0;
  const ticks = DURATIONS.slice(0,-1).map(d => { cum+=d; return (cum/TOTAL_MS)*100; });

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"#0a0a0a",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
    }}>
      {/* Square frame — sized to fit shorter viewport axis */}
      <div style={{
        width:"min(calc(100vh - 120px), calc(100vw - 48px))",
        aspectRatio:"1/1",
        position:"relative", overflow:"hidden",
        borderRadius:16,
        boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.7)",
      }}>
        <div ref={shellRef} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          <div style={{
            position:"absolute", top:0, left:0, width:FW11, height:FH11,
            transform:`scale(${scale})`, transformOrigin:"top left",
          }}>
            <ActiveFrame t={ft} />
          </div>
        </div>

        <div style={{
          position:"absolute", top:10, right:12,
          background:"rgba(0,0,0,0.5)", borderRadius:8,
          padding:"3px 9px",
          fontFamily:UI_F, fontWeight:700, fontSize:11, color:"rgba(255,255,255,0.7)",
          pointerEvents:"none",
        }}>{fi+1}/5</div>

        <div style={{ position:"absolute", inset:0, cursor:"pointer", zIndex:10 }}
          onClick={togglePlay} />
      </div>

      {/* Controls */}
      <div style={{
        display:"flex", alignItems:"center", gap:14, marginTop:14,
        width:"min(calc(100vh - 120px), calc(100vw - 48px))",
      }}>
        <button onClick={togglePlay} style={{
          width:44, height:44, borderRadius:"50%",
          background:YLW, border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          {paused || elapsed >= TOTAL_MS
            ? <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1l12 7-12 7V1z" fill={NAVY}/>
              </svg>
            : <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                <rect x="0.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
                <rect x="7.5" y="1" width="4" height="14" rx="1.5" fill={NAVY}/>
              </svg>
          }
        </button>
        <div style={{ flex:1 }}>
          <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.15)", position:"relative" }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0,
              width:`${pct}%`, background:YLW, borderRadius:2,
              transition:"width 0.05s linear",
            }}/>
            {ticks.map((p,i) => (
              <div key={i} style={{
                position:"absolute", top:-2, bottom:-2, left:`${p}%`,
                width:1.5, background:"rgba(255,255,255,0.25)", borderRadius:1,
              }}/>
            ))}
          </div>
          <div style={{
            marginTop:5, display:"flex", justifyContent:"space-between",
            fontFamily:UI_F, fontWeight:500, fontSize:10, color:"rgba(255,255,255,0.35)",
          }}>
            <span>{(elapsed/1000).toFixed(1)}s</span>
            <span>15.0s</span>
          </div>
        </div>
        <span style={{ fontFamily:UI_F, fontWeight:500, fontSize:11,
          color:"rgba(255,255,255,0.35)", flexShrink:0 }}>1:1</span>
      </div>

      <button onClick={onClose} style={{
        position:"fixed", top:18, right:20,
        background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)",
        color:"rgba(255,255,255,0.7)", borderRadius:"50%",
        width:36, height:36, cursor:"pointer", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>×</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// STORYBOARD SHELL
// ════════════════════════════════════════════════════════════════════════════════
const SC   = 0.260;
const SC16 = 0.240; // 1920×0.240 = 461 wide, 1080×0.240 = 259 tall
const SC11 = 0.260; // 1080×0.260 = 281 × 281 square thumbnails

const FRAMES_11 = [
  { n:1, t:"0:00–0:02", label:"Hook",      accent:YLW,   el:<Frame1_11 /> },
  { n:2, t:"0:02–0:06", label:"Gameplay",  accent:CREAM, el:<Frame2_11 /> },
  { n:3, t:"0:06–0:08", label:"Solved",    accent:BLUE,  el:<Frame3_11 /> },
  { n:4, t:"0:08–0:11", label:"Challenge", accent:CREAM, el:<Frame4_11 /> },
  { n:5, t:"0:11–0:15", label:"End Card",  accent:YLW,   el:<Frame5_11 /> },
];

function FrameCard11({ n, t, label, accent, children }:
  { n:number; t:string; label:string; accent:string; children:React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:13, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:UI_F }}>
        <div style={{
          background:accent,
          color:accent===YLW?NAVY:accent===CREAM?NAVY:CREAM,
          fontWeight:700, fontSize:11, letterSpacing:"0.08em",
          padding:"4px 12px", borderRadius:6,
        }}>F{n}</div>
        <span style={{ fontWeight:700, fontSize:12, color:"#2a2520", opacity:0.62 }}>{label}</span>
        <span style={{ fontWeight:500, fontSize:11, color:"#2a2520", opacity:0.34 }}>{t}</span>
      </div>
      <div style={{
        width:FW11*SC11, height:FH11*SC11, position:"relative", overflow:"hidden",
        borderRadius:12, outline:"1px solid rgba(14,24,38,0.07)",
        boxShadow:"0 4px 22px rgba(14,24,38,0.16), 0 1px 4px rgba(14,24,38,0.07)",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, width:FW11, height:FH11,
          transform:`scale(${SC11})`, transformOrigin:"top left",
        }}>{children}</div>
      </div>
    </div>
  );
}

const FRAMES16 = [
  { n:1, t:"0:00–0:02", label:"Hook",      accent:YLW,   el:<Frame1Wide /> },
  { n:2, t:"0:02–0:06", label:"Gameplay",  accent:CREAM, el:<Frame2Wide /> },
  { n:3, t:"0:06–0:08", label:"Solved",    accent:BLUE,  el:<Frame3Wide /> },
  { n:4, t:"0:08–0:11", label:"Challenge", accent:CREAM, el:<Frame4Wide /> },
  { n:5, t:"0:11–0:15", label:"End Card",  accent:YLW,   el:<Frame5Wide /> },
];

function FrameCard16({ n, t, label, accent, children }:
  { n:number; t:string; label:string; accent:string; children:React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:13, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:UI_F }}>
        <div style={{
          background:accent,
          color:accent===YLW?NAVY:accent===CREAM?NAVY:CREAM,
          fontWeight:700, fontSize:11, letterSpacing:"0.08em",
          padding:"4px 12px", borderRadius:6,
        }}>F{n}</div>
        <span style={{ fontWeight:700, fontSize:12, color:"#2a2520", opacity:0.62 }}>{label}</span>
        <span style={{ fontWeight:500, fontSize:11, color:"#2a2520", opacity:0.34 }}>{t}</span>
      </div>
      <div style={{
        width:FW16*SC16, height:FH16*SC16, position:"relative", overflow:"hidden",
        borderRadius:10, outline:"1px solid rgba(14,24,38,0.07)",
        boxShadow:"0 4px 22px rgba(14,24,38,0.16), 0 1px 4px rgba(14,24,38,0.07)",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, width:FW16, height:FH16,
          transform:`scale(${SC16})`, transformOrigin:"top left",
        }}>{children}</div>
      </div>
    </div>
  );
}

const FRAMES = [
  { n:1, t:"0:00–0:02", label:"Hook",      accent:YLW,   el:<Frame1 /> },
  { n:2, t:"0:02–0:06", label:"Gameplay",  accent:CREAM, el:<Frame2 /> },
  { n:3, t:"0:06–0:08", label:"Solved",    accent:BLUE,  el:<Frame3 /> },
  { n:4, t:"0:08–0:11", label:"Challenge", accent:CREAM, el:<Frame4 /> },
  { n:5, t:"0:11–0:15", label:"End Card",  accent:YLW,   el:<Frame5 /> },
];

function FrameCard({ n, t, label, accent, children }:
  { n:number; t:string; label:string; accent:string; children:React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:13, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:UI_F }}>
        <div style={{
          background:accent,
          color:accent===YLW?NAVY:accent===CREAM?NAVY:CREAM,
          fontWeight:700, fontSize:11, letterSpacing:"0.08em",
          padding:"4px 12px", borderRadius:6,
        }}>F{n}</div>
        <span style={{ fontWeight:700, fontSize:12, color:"#2a2520", opacity:0.62 }}>{label}</span>
        <span style={{ fontWeight:500, fontSize:11, color:"#2a2520", opacity:0.34 }}>{t}</span>
      </div>
      <div style={{
        width:FW*SC, height:FH*SC, position:"relative", overflow:"hidden",
        borderRadius:14, outline:"1px solid rgba(14,24,38,0.07)",
        boxShadow:"0 4px 22px rgba(14,24,38,0.16), 0 1px 4px rgba(14,24,38,0.07)",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, width:FW, height:FH,
          transform:`scale(${SC})`, transformOrigin:"top left",
        }}>{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [preview,     setPreview]     = React.useState(false);
  const [widePreview, setWidePreview] = React.useState(false);
  const [sqPreview,   setSqPreview]   = React.useState(false);
  return (
    <>
      {preview     && <TikTokPreview onClose={() => setPreview(false)} />}
      {widePreview && <WidePreview   onClose={() => setWidePreview(false)} />}
      {sqPreview   && <SquarePreview onClose={() => setSqPreview(false)} />}
      <div style={{
        minHeight:"100%", background:SURR,
        padding:"52px 48px 72px",
        fontFamily:UI_F, boxSizing:"border-box",
      }}>
        <div style={{ marginBottom:46, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:24 }}>
          <div>
            <div style={{ fontFamily:BG_F, fontWeight:700, fontSize:15, letterSpacing:"0.08em", color:"#1a1510", marginBottom:7 }}>
              PALABRA DI KÒRSOU — TIKTOK AD STORYBOARD
            </div>
            <div style={{ fontWeight:500, fontSize:13, color:"#1a1510", opacity:0.38 }}>
              1080 × 1920 px · 9:16 · 15 s · Bricolage Grotesque + Karla · 7-letter hex
            </div>
          </div>
          <button onClick={() => setPreview(true)} style={{
            flexShrink:0, display:"flex", alignItems:"center", gap:12,
            background:NAVY, border:"none", borderRadius:40,
            padding:"14px 28px", cursor:"pointer",
            fontFamily:BG_F, fontWeight:700, fontSize:15,
            color:CREAM, letterSpacing:"0.04em",
            boxShadow:"0 4px 16px rgba(14,24,38,0.22)",
          }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M1 1l12 7-12 7V1z" fill={YLW}/>
            </svg>
            Preview op TikTok
          </button>
        </div>

        {/* 9:16 storyboard row */}
        <div style={{ display:"flex", gap:26, overflowX:"auto", paddingBottom:8, alignItems:"flex-start" }}>
          {FRAMES.map(f => (
            <FrameCard key={f.n} n={f.n} t={f.t} label={f.label} accent={f.accent}>
              {f.el}
            </FrameCard>
          ))}
        </div>

        {/* 16:9 section */}
        <div style={{ marginTop:56 }}>
          <div style={{ marginBottom:28, display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", gap:24 }}>
            <div>
              <div style={{ fontFamily:BG_F, fontWeight:700, fontSize:15,
                letterSpacing:"0.08em", color:"#1a1510", marginBottom:7 }}>
                PALABRA DI KÒRSOU — META / YOUTUBE STORYBOARD
              </div>
              <div style={{ fontWeight:500, fontSize:13, color:"#1a1510", opacity:0.38 }}>
                1920 × 1080 px · 16:9 · 15 s · landscape
              </div>
            </div>
            <button onClick={() => setWidePreview(true)} style={{
              flexShrink:0, display:"flex", alignItems:"center", gap:12,
              background:NAVY, border:"none", borderRadius:40,
              padding:"14px 28px", cursor:"pointer",
              fontFamily:BG_F, fontWeight:700, fontSize:15,
              color:CREAM, letterSpacing:"0.04em",
              boxShadow:"0 4px 16px rgba(14,24,38,0.22)",
            }}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1l12 7-12 7V1z" fill={YLW}/>
              </svg>
              Preview 16:9
            </button>
          </div>
          <div style={{ display:"flex", gap:26, overflowX:"auto", paddingBottom:8, alignItems:"flex-start" }}>
            {FRAMES16.map(f => (
              <FrameCard16 key={f.n} n={f.n} t={f.t} label={f.label} accent={f.accent}>
                {f.el}
              </FrameCard16>
            ))}
          </div>
        </div>

        {/* 1:1 section */}
        <div style={{ marginTop:56 }}>
          <div style={{ marginBottom:28, display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", gap:24 }}>
            <div>
              <div style={{ fontFamily:BG_F, fontWeight:700, fontSize:15,
                letterSpacing:"0.08em", color:"#1a1510", marginBottom:7 }}>
                PALABRA DI KÒRSOU — INSTAGRAM / META SQUARE
              </div>
              <div style={{ fontWeight:500, fontSize:13, color:"#1a1510", opacity:0.38 }}>
                1080 × 1080 px · 1:1 · 15 s · square
              </div>
            </div>
            <button onClick={() => setSqPreview(true)} style={{
              flexShrink:0, display:"flex", alignItems:"center", gap:12,
              background:NAVY, border:"none", borderRadius:40,
              padding:"14px 28px", cursor:"pointer",
              fontFamily:BG_F, fontWeight:700, fontSize:15,
              color:CREAM, letterSpacing:"0.04em",
              boxShadow:"0 4px 16px rgba(14,24,38,0.22)",
            }}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1l12 7-12 7V1z" fill={YLW}/>
              </svg>
              Preview 1:1
            </button>
          </div>
          <div style={{ display:"flex", gap:26, overflowX:"auto", paddingBottom:8, alignItems:"flex-start" }}>
            {FRAMES_11.map(f => (
              <FrameCard11 key={f.n} n={f.n} t={f.t} label={f.label} accent={f.accent}>
                {f.el}
              </FrameCard11>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
