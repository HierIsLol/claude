import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Brand colours ────────────────────────────────────────────────────────────

const C = {
  navy:    '#12213f',
  blue:    '#4a6fa5',
  red:     '#e8412a',   // levendig rood
  bg:      '#edf1f8',
  card:    '#ffffff',
  surface: '#f4f7fc',
  muted:   '#8899aa',
  blobB:   'rgba(74,111,165,0.13)',
  blobR:   'rgba(201,120,104,0.10)',
};

// ─── Animation timing (frames @ 30 fps ≈ 8 s) ─────────────────────────────────
//
//   0 –  35 : Logo springs in
//  30 –  65 : Dashboard card slides up
//  45 –  85 : Metric cards stagger in
//  78 – 190 : Lines draw left→right
// 115 – 210 : Camera zooms into white chart area (starts while lines animate)
// 210 – 240 : Fade-out
//
const T = {
  logo:      5,
  dash:      30,
  card1:     45,
  card2:     60,
  card3:     73,
  chart:     78,
  chartEnd:  185,
  zoomIn:    115,   // zoom starts while lines still animate
  zoomEnd:   215,
  spikeIn:   188,   // lijn schiet omhoog aan het einde
  spikeEnd:  218,
  fadeOut:   218,
  end:       248,
};

// ─── Chart data (normalised 0–1, 1 = top) ────────────────────────────────────

const OMZET_RAW  = [0.38, 0.36, 0.46, 0.58, 0.68, 0.72, 0.76, 0.71, 0.65, 0.62, 0.68, 0.72];
const KOSTEN_RAW = [0.26, 0.21, 0.28, 0.36, 0.50, 0.42, 0.45, 0.35, 0.24, 0.35, 0.52, 0.76];

const CW = 900, CH = 310, PL = 35, PB = 25;
const CBOT = CH - PB;

function buildPoints(data: number[]) {
  return data.map((y, i) => ({
    x: PL + (i / (data.length - 1)) * (CW - PL),
    y: (1 - y) * CBOT,
  }));
}

const OMZET_PTS  = buildPoints(OMZET_RAW);
const KOSTEN_PTS = buildPoints(KOSTEN_RAW);

// Smooth cubic-bezier path (Catmull-Rom) + animated tip dot
function smoothChart(pts: {x: number; y: number}[], prog: number) {
  if (prog <= 0 || pts.length < 2) return {path: '', dot: pts[0]};

  const total = pts.length - 1;
  const p  = Math.min(prog, 1) * total;
  const fi = Math.floor(p);
  const fr = p - fi;

  const vis = [...pts.slice(0, fi + 1)];
  const dot =
    fi < total
      ? {
          x: pts[fi].x + (pts[fi + 1].x - pts[fi].x) * fr,
          y: pts[fi].y + (pts[fi + 1].y - pts[fi].y) * fr,
        }
      : pts[total];
  if (fi < total) vis.push(dot);

  if (vis.length < 2) return {path: `M ${vis[0].x},${vis[0].y}`, dot};

  // Catmull-Rom → cubic bezier  (tension 0.28 gives gentle curves)
  const t = 0.28;
  let d = `M ${vis[0].x.toFixed(1)},${vis[0].y.toFixed(1)}`;
  for (let i = 1; i < vis.length; i++) {
    const p0 = vis[Math.max(0, i - 2)];
    const p1 = vis[i - 1];
    const p2 = vis[i];
    const p3 = vis[Math.min(vis.length - 1, i + 1)];
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return {path: d, dot};
}

// ─── Metric card ──────────────────────────────────────────────────────────────

const MetricCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({label, value, sub, frame, fps, delay}) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 190, mass: 0.65},
  });
  return (
    <div
      style={{
        flex: 1,
        background: C.card,
        borderRadius: 18,
        padding: '22px 28px',
        boxShadow: '0 4px 24px rgba(18,33,63,0.09), 0 1px 4px rgba(18,33,63,0.05)',
        transform: `translateY(${(1 - s) * 52}px)`,
        opacity: s,
      }}
    >
      <div style={{fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10}}>
        {label}
      </div>
      <div style={{fontSize: 38, fontWeight: 800, color: C.navy, lineHeight: 1, marginBottom: sub ? 8 : 0}}>
        {value}
      </div>
      {sub && <div style={{fontSize: 11, fontWeight: 600, color: C.blue}}>{sub}</div>}
    </div>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

export const AdpalDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sp = (start: number, cfg?: Partial<{damping: number; stiffness: number; mass: number}>) =>
    spring({frame: frame - start, fps, config: {damping: 20, stiffness: 170, mass: 0.8, ...cfg}});

  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  // Logo + dashboard springs
  const logoS = sp(T.logo, {damping: 16, stiffness: 220, mass: 0.5});
  const dashS = sp(T.dash, {damping: 24, stiffness: 140});

  // Chart drawing (0 → 1)
  const chartProg = interpolate(frame, [T.chart, T.chartEnd], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  // End spike — omzet-lijn schiet omhoog na het tekenen
  const spikeProg = interpolate(frame, [T.spikeIn, T.spikeEnd], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // Camera zoom into chart — starts while lines are mid-draw
  const zoomProg = interpolate(frame, [T.zoomIn, T.zoomEnd], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  // Fade-out
  const opacity = interpolate(frame, [T.fadeOut, T.end], [1, 0], clamp);

  // ── 3-D zoom — sterke zijkant-rotatie ────────────────────────────────────
  const rotX  = zoomProg * 18;    // meer naar voren/achteren kantelen
  const rotY  = zoomProg * 32;    // andere kant op
  const scale = 1 + zoomProg * 1.9;

  // Pivot verschuift naar chart
  const pivotY = interpolate(frame, [T.zoomIn, T.zoomEnd], [50, 68], clamp);

  const transform3D = [
    'perspective(800px)',
    `rotateX(${rotX}deg)`,
    `rotateY(${rotY}deg)`,
    `scale(${scale.toFixed(4)})`,
  ].join(' ');

  // Dynamische punten: laatste punt van omzet schiet omhoog bij spike
  const spikeTopY = 0.72 + spikeProg * 0.24;   // 0.72 → 0.96
  const omzetDynamic = [...OMZET_RAW.slice(0, -1), spikeTopY];
  const omzetDynPts  = buildPoints(omzetDynamic);

  // Chart paths (smooth curves)
  const omz = smoothChart(omzetDynPts, Math.max(chartProg, spikeProg > 0 ? 1 : 0));
  const kst = smoothChart(KOSTEN_PTS, chartProg);
  const chartVisible = chartProg > 0.02;

  // Chart section entrance
  const chartOpacity = interpolate(frame, [T.chart - 10, T.chart + 16], [0, 1], clamp);
  const chartSlide   = interpolate(frame, [T.chart - 10, T.chart + 16], [22, 0], clamp);

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: "'Inter','Helvetica Neue','Arial',sans-serif", overflow: 'hidden'}}>

      {/* Wit fade-out overlay */}
      <div style={{position: 'absolute', inset: 0, background: 'white', opacity: 1 - opacity, zIndex: 999, pointerEvents: 'none'}} />

      {/* Decorative blobs */}
      <div style={{position: 'absolute', top: -110, left: -70, width: 480, height: 480, borderRadius: '50%', background: C.blobB}} />
      <div style={{position: 'absolute', bottom: -90, right: -55, width: 420, height: 420, borderRadius: '50%', background: C.blobR}} />
      <div style={{position: 'absolute', top: '38%', right: '11%', width: 240, height: 240, borderRadius: '50%', background: C.blobB, opacity: 0.55}} />
      <div style={{position: 'absolute', top: '18%', left: '5%', width: 160, height: 160, borderRadius: '50%', background: C.blobR, opacity: 0.45}} />

      {/* 3-D container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 100px 56px',
          transformOrigin: `50% ${pivotY}%`,
          transform: transform3D,
        }}
      >
        {/* ADPAL logo */}
        <img
          src="https://instructies.s3.us-east-1.amazonaws.com/AdPal_logo_no_white+(1)+kopie.png"
          style={{
            height: 80,
            marginBottom: 48,
            transform: `scale(${logoS}) translateY(${(1 - logoS) * -32}px)`,
            opacity: logoS,
          }}
        />

        {/* Dashboard card */}
        <div
          style={{
            background: C.card,
            borderRadius: 28,
            padding: '38px 46px',
            width: '100%',
            boxShadow: '0 12px 64px rgba(18,33,63,0.13), 0 2px 16px rgba(18,33,63,0.06)',
            transform: `translateY(${(1 - dashS) * 72}px)`,
            opacity: dashS,
          }}
        >
          {/* Section header */}
          <div style={{fontSize: 17, fontWeight: 700, color: C.navy, opacity: 0.65, marginBottom: 24, letterSpacing: '-0.01em'}}>
            Campagne resultaten
          </div>

          {/* Metric cards */}
          <div style={{display: 'flex', gap: 24, marginBottom: 46}}>
            <MetricCard label="Conversies" value="133"   frame={frame} fps={fps} delay={T.card1} />
            <MetricCard label="Omzet"      value="€6.8K" frame={frame} fps={fps} delay={T.card2} />
            <MetricCard label="Kosten"     value="€2.7K" sub="ACoS 39.7%" frame={frame} fps={fps} delay={T.card3} />
          </div>

          {/* Chart section */}
          <div style={{opacity: chartOpacity, transform: `translateY(${chartSlide}px)`}}>
            <div style={{fontSize: 16, fontWeight: 700, color: C.navy, opacity: 0.72, marginBottom: 14}}>
              Prestatie overzicht
            </div>

            {/* Legend */}
            <div style={{display: 'flex', gap: 28, justifyContent: 'flex-end', marginBottom: 14}}>
              {[{label: 'Omzet', color: C.red}, {label: 'Kosten', color: C.blue}].map(({label, color}) => (
                <div key={label} style={{display: 'flex', alignItems: 'center', gap: 7}}>
                  <div style={{width: 26, height: 3, background: color, borderRadius: 2}} />
                  <span style={{fontSize: 12, color: C.muted, fontWeight: 500}}>{label}</span>
                </div>
              ))}
            </div>

            {/* White chart box */}
            <div style={{background: C.surface, borderRadius: 18, padding: '20px 24px 14px'}}>
              <svg viewBox={`0 0 ${CW} ${CH}`} style={{width: '100%', height: 'auto', display: 'block'}}>

                {/* Grid */}
                {[0.25, 0.5, 0.75].map((v) => (
                  <line key={v}
                    x1={PL} y1={(1 - v) * CBOT} x2={CW} y2={(1 - v) * CBOT}
                    stroke="rgba(18,33,63,0.07)" strokeWidth="1" strokeDasharray="5,5"
                  />
                ))}

                {/* Axes */}
                <line x1={PL} y1={0}    x2={PL} y2={CBOT} stroke={C.navy} strokeWidth="2.5" />
                <line x1={PL} y1={CBOT} x2={CW} y2={CBOT} stroke={C.navy} strokeWidth="2.5" />

                {/* Smooth lines — no fill */}
                {chartVisible && (
                  <>
                    <path d={omz.path} fill="none" stroke={C.red}  strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={kst.path} fill="none" stroke={C.blue} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}

                {/* Animated tip dots */}
                {chartProg > 0.05 && (
                  <>
                    <circle cx={omz.dot.x} cy={omz.dot.y} r="6" fill={C.red}  stroke="white" strokeWidth="2.5" />
                    <circle cx={kst.dot.x} cy={kst.dot.y} r="6" fill={C.blue} stroke="white" strokeWidth="2.5" />
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
