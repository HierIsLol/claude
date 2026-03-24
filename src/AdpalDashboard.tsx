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
  red:     '#e05c3a',
  bg:      '#edf1f8',
  card:    '#ffffff',
  surface: '#f4f7fc',
  muted:   '#8899aa',
  blobB:   'rgba(74,111,165,0.13)',
  blobR:   'rgba(224,92,58,0.10)',
};

// ─── Animation timing (frames @ 30 fps = 10 s) ────────────────────────────────
//
//  0 – 30   : Background + ADPAL logo springs in
//  30 – 55  : Dashboard card slides up
//  45 – 90  : Three metric cards stagger in
//  90 – 170 : Chart section fades in; lines draw left→right
//  170 – 200: Hold (full dashboard visible)
//  200 – 248: 3-D tilt + first zoom   (camera banks)
//  248 – 286: Deep zoom into chart    (camera pushes in)
//  286 – 300: Fade-out
//
const T = {
  logo:     5,
  dash:     30,
  card1:    45,
  card2:    60,
  card3:    75,
  chart:    90,
  chartEnd: 170,
  tilt:     200,
  tiltEnd:  248,
  zoomIn:   248,
  zoomEnd:  286,
  fadeOut:  286,
  end:      300,
};

// ─── Chart data (normalised 0–1, 1 = top) ────────────────────────────────────

const OMZET_RAW  = [0.38, 0.34, 0.42, 0.52, 0.61, 0.59, 0.62, 0.59, 0.47, 0.43, 0.53, 0.78];
const KOSTEN_RAW = [0.26, 0.21, 0.28, 0.36, 0.50, 0.42, 0.45, 0.35, 0.24, 0.35, 0.52, 0.80];

// SVG viewport for the chart
const CW = 900, CH = 310, PL = 35, PB = 25;
const CBOT = CH - PB;   // Y coordinate of the X-axis

function buildPoints(data: number[]) {
  return data.map((y, i) => ({
    x: PL + (i / (data.length - 1)) * (CW - PL),
    y: (1 - y) * CBOT,
  }));
}

const OMZET_PTS  = buildPoints(OMZET_RAW);
const KOSTEN_PTS = buildPoints(KOSTEN_RAW);

// Returns the partial polyline string, fill polygon string, and tip dot position
function chartPaths(pts: {x: number; y: number}[], prog: number) {
  if (prog <= 0 || pts.length < 2) {
    return {line: '', fill: '', dot: pts[0]};
  }
  const total = pts.length - 1;
  const p     = Math.min(prog, 1) * total;
  const fi    = Math.floor(p);
  const fr    = p - fi;

  const vis = [...pts.slice(0, fi + 1)];
  const dot =
    fi < total
      ? {
          x: pts[fi].x + (pts[fi + 1].x - pts[fi].x) * fr,
          y: pts[fi].y + (pts[fi + 1].y - pts[fi].y) * fr,
        }
      : pts[total];

  if (fi < total) vis.push(dot);

  const fmt = ({x, y}: {x: number; y: number}) =>
    `${x.toFixed(1)},${y.toFixed(1)}`;

  const line = vis.map(fmt).join(' ');
  const fill = `${line} ${dot.x.toFixed(1)},${CBOT} ${PL},${CBOT}`;

  return {line, fill, dot};
}

// ─── Metric card sub-component ────────────────────────────────────────────────

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
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.muted,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          color: C.navy,
          lineHeight: 1,
          marginBottom: sub ? 8 : 0,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{fontSize: 11, fontWeight: 600, color: C.blue}}>{sub}</div>
      )}
    </div>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

export const AdpalDashboard: React.FC = () => {
  const frame        = useCurrentFrame();
  const {fps}        = useVideoConfig();

  // Helper: spring from a start frame
  const sp = (start: number, cfg?: Partial<{damping: number; stiffness: number; mass: number}>) =>
    spring({frame: frame - start, fps, config: {damping: 20, stiffness: 170, mass: 0.8, ...cfg}});

  // ── Logo ──────────────────────────────────────────────────────────────────
  const logoS = sp(T.logo, {damping: 16, stiffness: 220, mass: 0.5});

  // ── Dashboard panel ───────────────────────────────────────────────────────
  const dashS = sp(T.dash, {damping: 24, stiffness: 140});

  // ── Chart drawing progress ────────────────────────────────────────────────
  const chartProg = interpolate(frame, [T.chart, T.chartEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // ── 3-D tilt progress ─────────────────────────────────────────────────────
  const tiltProg = interpolate(frame, [T.tilt, T.tiltEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // ── Deep zoom progress ────────────────────────────────────────────────────
  const zoomProg = interpolate(frame, [T.zoomIn, T.zoomEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // ── Fade-out ──────────────────────────────────────────────────────────────
  const opacity = interpolate(frame, [T.fadeOut, T.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // ── 3-D camera math ───────────────────────────────────────────────────────
  //  Phase 1 (tilt): camera banks to the side and zooms to 1.5×
  //  Phase 2 (zoom): pushes deeper to 2.6×, pivot shifts toward chart area
  const rotX    = tiltProg * 13;                              // top tilts away
  const rotY    = tiltProg * -7;                              // slight left bank
  const scale   = 1 + tiltProg * 0.50 + zoomProg * 1.10;    // 1 → 1.5 → 2.6

  // Transform-origin shifts downward during zoom so the pivot is over the chart
  const pivotY  = interpolate(frame, [T.tilt, T.zoomEnd], [44, 67], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const transform3D = [
    `perspective(900px)`,
    `rotateX(${rotX}deg)`,
    `rotateY(${rotY}deg)`,
    `scale(${scale.toFixed(4)})`,
  ].join(' ');

  // ── Partial chart paths ───────────────────────────────────────────────────
  const omz = chartPaths(OMZET_PTS, chartProg);
  const kst = chartPaths(KOSTEN_PTS, chartProg);

  const chartVisible = chartProg > 0.02;

  // ── Chart section fade-in ─────────────────────────────────────────────────
  const chartSectionOpacity = interpolate(
    frame,
    [T.chart - 12, T.chart + 18],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const chartSectionSlide = interpolate(
    frame,
    [T.chart - 12, T.chart + 18],
    [24, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: "'Inter','Helvetica Neue','Arial',sans-serif",
        overflow: 'hidden',
        opacity,
      }}
    >
      {/* ── Decorative background blobs ────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: -110,
          left: -70,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: C.blobB,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -90,
          right: -55,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: C.blobR,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '38%',
          right: '11%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: C.blobB,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '5%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: C.blobR,
          opacity: 0.45,
        }}
      />

      {/* ── 3-D animated container ─────────────────────────────────────── */}
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

        {/* ADPAL logotype */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: C.navy,
            letterSpacing: '-0.025em',
            marginBottom: 48,
            transform: `scale(${logoS}) translateY(${(1 - logoS) * -32}px)`,
            opacity: logoS,
          }}
        >
          ADPAL
        </div>

        {/* Main dashboard card */}
        <div
          style={{
            background: C.card,
            borderRadius: 28,
            padding: '38px 46px',
            width: '100%',
            boxShadow:
              '0 12px 64px rgba(18,33,63,0.13), 0 2px 16px rgba(18,33,63,0.06)',
            transform: `translateY(${(1 - dashS) * 72}px)`,
            opacity: dashS,
          }}
        >

          {/* Section header */}
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: C.navy,
              opacity: 0.65,
              marginBottom: 24,
              letterSpacing: '-0.01em',
            }}
          >
            Campagne resultaten
          </div>

          {/* Metric cards */}
          <div style={{display: 'flex', gap: 24, marginBottom: 46}}>
            <MetricCard
              label="Conversies"
              value="133"
              frame={frame}
              fps={fps}
              delay={T.card1}
            />
            <MetricCard
              label="Omzet"
              value="€6.8K"
              frame={frame}
              fps={fps}
              delay={T.card2}
            />
            <MetricCard
              label="Kosten"
              value="€2.7K"
              sub="ACoS 39.7%"
              frame={frame}
              fps={fps}
              delay={T.card3}
            />
          </div>

          {/* Chart section */}
          <div
            style={{
              opacity: chartSectionOpacity,
              transform: `translateY(${chartSectionSlide}px)`,
            }}
          >
            {/* Chart title */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.navy,
                opacity: 0.72,
                marginBottom: 14,
              }}
            >
              Prestatie overzicht
            </div>

            {/* Legend */}
            <div
              style={{
                display: 'flex',
                gap: 28,
                justifyContent: 'flex-end',
                marginBottom: 14,
              }}
            >
              {[
                {label: 'Omzet', color: C.red},
                {label: 'Kosten', color: C.blue},
              ].map(({label, color}) => (
                <div
                  key={label}
                  style={{display: 'flex', alignItems: 'center', gap: 7}}
                >
                  <div
                    style={{
                      width: 26,
                      height: 3,
                      background: color,
                      borderRadius: 2,
                    }}
                  />
                  <span
                    style={{fontSize: 12, color: C.muted, fontWeight: 500}}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart SVG */}
            <div
              style={{
                background: C.surface,
                borderRadius: 18,
                padding: '20px 24px 14px',
              }}
            >
              <svg
                viewBox={`0 0 ${CW} ${CH}`}
                style={{width: '100%', height: 'auto', display: 'block'}}
              >
                <defs>
                  <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.red}  stopOpacity="0.18" />
                    <stop offset="100%" stopColor={C.red}  stopOpacity="0"    />
                  </linearGradient>
                  <linearGradient id="gK" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.blue} stopOpacity="0.14" />
                    <stop offset="100%" stopColor={C.blue} stopOpacity="0"    />
                  </linearGradient>
                </defs>

                {/* Dashed horizontal grid lines */}
                {[0.25, 0.5, 0.75].map((v) => (
                  <line
                    key={v}
                    x1={PL}
                    y1={(1 - v) * CBOT}
                    x2={CW}
                    y2={(1 - v) * CBOT}
                    stroke="rgba(18,33,63,0.07)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                ))}

                {/* Y axis */}
                <line
                  x1={PL} y1={0}
                  x2={PL} y2={CBOT}
                  stroke={C.navy}
                  strokeWidth="2.5"
                />
                {/* X axis */}
                <line
                  x1={PL}  y1={CBOT}
                  x2={CW}  y2={CBOT}
                  stroke={C.navy}
                  strokeWidth="2.5"
                />

                {/* Gradient fill areas */}
                {chartVisible && (
                  <>
                    <polygon points={omz.fill} fill="url(#gO)" />
                    <polygon points={kst.fill} fill="url(#gK)" />
                  </>
                )}

                {/* Animated polylines */}
                {chartVisible && (
                  <>
                    <polyline
                      points={omz.line}
                      fill="none"
                      stroke={C.red}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points={kst.line}
                      fill="none"
                      stroke={C.blue}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Animated tip dots */}
                {chartProg > 0.05 && (
                  <>
                    <circle
                      cx={omz.dot.x} cy={omz.dot.y}
                      r="6"
                      fill={C.red}
                      stroke="white"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={kst.dot.x} cy={kst.dot.y}
                      r="6"
                      fill={C.blue}
                      stroke="white"
                      strokeWidth="2.5"
                    />
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
