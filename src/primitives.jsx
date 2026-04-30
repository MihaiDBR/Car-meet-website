// Animation primitives & hooks
const { useState, useEffect, useRef, useCallback, useMemo } = React;

function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return m;
}
function useIsDesktopWide(bp = 1024) {
  const [d, setD] = useState(typeof window !== 'undefined' ? window.innerWidth >= bp : false);
  useEffect(() => {
    const check = () => setD(window.innerWidth >= bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return d;
}
function useIsTouch() {
  const [t, setT] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setT(!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return t;
}

function useInView(ref, { threshold = 0.15, triggerOnce = true } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          if (triggerOnce) obs.disconnect();
        } else if (!triggerOnce) setInView(false);
      });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return inView;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setY(window.scrollY); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return y;
}

function useMousePosition() {
  const touch = useIsTouch();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tgt = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (touch) return;
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      tgt.current = { x: (e.clientX - w / 2) / (w / 2), y: (e.clientY - h / 2) / (h / 2) };
    };
    let raf;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (tgt.current.x - cur.x) * 0.08;
      cur.y += (tgt.current.y - cur.y) * 0.08;
      setPos({ x: cur.x, y: cur.y });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [touch]);
  return touch ? { x: 0, y: 0 } : pos;
}

function SplitText({ children, split = 'chars', className = '', style = {}, stagger, delay = 0, as: Tag = 'span' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15 });
  const text = typeof children === 'string' ? children : String(children);
  const parts = split === 'words' ? text.split(' ') : Array.from(text);
  const step = stagger ?? (split === 'words' ? 80 : 30);
  return (
    <Tag ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span style={{
            display: 'inline-block',
            transform: inView ? 'translateY(0)' : 'translateY(110%)',
            opacity: inView ? 1 : 0,
            transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay + i * step}ms, opacity 0.5s ease ${delay + i * step}ms`,
            whiteSpace: 'pre',
            willChange: 'transform, opacity',
          }}>
            {p === ' ' ? '\u00A0' : p}{split === 'words' && i < parts.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

function Reveal({ variant = 'fade-up', delay = 0, duration = 1000, threshold = 0.15, children, className = '', style = {}, as: Tag = 'div' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold });
  const variants = {
    'fade-up':    { from: { opacity: 0, transform: 'translateY(50px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    'fade-left':  { from: { opacity: 0, transform: 'translateX(-50px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    'fade-right': { from: { opacity: 0, transform: 'translateX(50px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    'scale-in':   { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
    'clip-up':    { from: { clipPath: 'inset(100% 0 0 0)' }, to: { clipPath: 'inset(0)' } },
    'blur-in':    { from: { opacity: 0, filter: 'blur(15px)' }, to: { opacity: 1, filter: 'blur(0)' } },
  };
  const v = variants[variant];
  return (
    <Tag ref={ref} className={className} style={{
      ...(inView ? v.to : v.from),
      transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      willChange: 'transform, opacity, filter, clip-path',
      ...style,
    }}>{children}</Tag>
  );
}

function AnimatedCounter({ target, suffix = '', duration = 2000, className = '', style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const t0 = performance.now();
    const animate = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setVal(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);
  return <span ref={ref} className={className} style={style}>{val.toLocaleString()}{suffix}</span>;
}

function CarSilhouette({ color = 'currentColor', strokeWidth = 1.5, style = {}, className = '', spinWheels = false, glow = true }) {
  const spokes = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="55%" stopColor={color} stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.35"/>
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.08"/>
        </linearGradient>
        <radialGradient id="headlightGlow" cx="0.3" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#EAF2FF" stopOpacity="1"/>
          <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="tailGlow" cx="0.7" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#FFB3B3" stopOpacity="1"/>
          <stop offset="60%" stopColor="#EF4444" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="128" rx="170" ry="3" fill="#000" opacity="0.55"/>
      <ellipse cx="200" cy="130" rx="145" ry="1.5" fill={color} opacity="0.25"/>

      {/* Front splitter / lip */}
      <path d="M 22 120 L 52 118 L 50 124 L 24 124 Z" fill="#000" opacity="0.75"/>
      {/* Rear diffuser */}
      <path d="M 346 120 L 378 118 L 376 124 L 348 124 Z" fill="#000" opacity="0.75"/>

      {/* Main body (low slung coupe — long hood, fastback roof, ducktail) */}
      <path
        d="M 28 118
           L 28 104
           Q 32 96 44 94
           L 74 88
           Q 92 84 108 78
           L 138 62
           Q 152 52 172 48
           L 252 48
           Q 274 50 288 62
           L 312 78
           Q 330 86 348 90
           L 368 96
           Q 376 100 376 108
           L 376 118
           Z"
        fill="url(#carBody)"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>

      {/* Hood crease line */}
      <path d="M 50 100 Q 88 92 126 82" stroke={color} strokeOpacity="0.35" strokeWidth="0.8" fill="none"/>
      <path d="M 50 108 Q 90 100 128 90" stroke={color} strokeOpacity="0.18" strokeWidth="0.6" fill="none"/>

      {/* Greenhouse (windshield + rear window) */}
      <path
        d="M 140 64
           Q 156 52 176 50
           L 248 50
           Q 268 52 282 64
           L 290 76
           L 156 76 Z"
        fill="url(#carGlass)"
        stroke={color} strokeOpacity="0.55" strokeWidth="0.9" strokeLinejoin="round"/>

      {/* Chrome window trim highlight */}
      <path d="M 156 76 L 290 76" stroke={color} strokeOpacity="0.7" strokeWidth="0.8"/>
      {/* B-pillar */}
      <line x1="212" y1="50" x2="212" y2="76" stroke={color} strokeOpacity="0.45" strokeWidth="0.9"/>

      {/* Character side line (door crease) */}
      <path d="M 50 108 Q 180 104 340 104" stroke={color} strokeOpacity="0.28" strokeWidth="0.8" fill="none"/>
      {/* Door cut lines */}
      <path d="M 170 76 L 186 118" stroke={color} strokeOpacity="0.22" strokeWidth="0.7" fill="none"/>
      <path d="M 232 76 L 248 118" stroke={color} strokeOpacity="0.22" strokeWidth="0.7" fill="none"/>

      {/* Side mirror */}
      <path d="M 148 62 Q 154 52 164 52 L 168 62 Z" fill={color} fillOpacity="0.55" stroke={color} strokeOpacity="0.4" strokeWidth="0.5"/>

      {/* Door handles */}
      <rect x="196" y="94" width="10" height="2" rx="1" fill={color} fillOpacity="0.5"/>
      <rect x="252" y="94" width="10" height="2" rx="1" fill={color} fillOpacity="0.5"/>

      {/* Ducktail / rear spoiler */}
      <path d="M 300 80 L 350 82 Q 358 83 360 90 L 300 92 Z" fill={color} fillOpacity="0.45" stroke={color} strokeOpacity="0.5" strokeWidth="0.7"/>

      {/* Side skirt (aggressive aero) */}
      <path d="M 84 116 L 332 116 L 324 124 L 92 124 Z" fill="#000" opacity="0.8"/>
      <path d="M 84 116 L 332 116" stroke={color} strokeOpacity="0.4" strokeWidth="0.8"/>

      {/* Flared front fender arch */}
      <path d="M 58 118 Q 62 80 110 78 Q 158 80 162 118"
        fill="none" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round"/>
      {/* Flared rear fender arch */}
      <path d="M 254 118 Q 258 80 306 78 Q 354 80 358 118"
        fill="none" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round"/>

      {/* Dark wheel wells (depth) */}
      <path d="M 66 118 Q 70 86 110 84 Q 150 86 154 118 Z" fill="#000" opacity="0.85"/>
      <path d="M 262 118 Q 266 86 306 84 Q 346 86 350 118 Z" fill="#000" opacity="0.85"/>

      {/* Front wheel */}
      <g transform="translate(110, 118)" style={spinWheels ? { animation: 'spin-slow 1.4s linear infinite', transformOrigin: 'center', transformBox: 'fill-box' } : undefined}>
        <circle r="22" fill="#050508" stroke={color} strokeWidth={strokeWidth}/>
        <circle r="18" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="0.7"/>
        {spokes.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M 0 0 L -3 -17 L 0 -18 L 3 -17 Z" fill={color} fillOpacity="0.85"/>
          </g>
        ))}
        <circle r="5" fill="#0a0a12" stroke={color} strokeWidth="0.8"/>
        <circle r="2" fill={color}/>
      </g>

      {/* Rear wheel */}
      <g transform="translate(306, 118)" style={spinWheels ? { animation: 'spin-slow 1.4s linear infinite', transformOrigin: 'center', transformBox: 'fill-box' } : undefined}>
        <circle r="22" fill="#050508" stroke={color} strokeWidth={strokeWidth}/>
        <circle r="18" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="0.7"/>
        {spokes.map((a) => (
          <g key={a} transform={`rotate(${a + 36})`}>
            <path d="M 0 0 L -3 -17 L 0 -18 L 3 -17 Z" fill={color} fillOpacity="0.85"/>
          </g>
        ))}
        <circle r="5" fill="#0a0a12" stroke={color} strokeWidth="0.8"/>
        <circle r="2" fill={color}/>
      </g>

      {/* Headlight (projector style) */}
      <path d="M 30 100 L 58 92 L 62 100 L 32 108 Z" fill="url(#headlightGlow)" stroke={color} strokeOpacity="0.6" strokeWidth="0.5"/>
      {glow && <ellipse cx="38" cy="100" rx="10" ry="3" fill="#EAF2FF" opacity="0.7"/>}

      {/* Taillight strip */}
      <rect x="348" y="96" width="26" height="5" rx="1" fill="url(#tailGlow)" stroke="#EF4444" strokeOpacity="0.4" strokeWidth="0.4"/>

      {/* Exhaust twin tips */}
      <rect x="372" y="114" width="6" height="4" rx="1" fill="#999" stroke={color} strokeOpacity="0.5" strokeWidth="0.4"/>
      <rect x="362" y="114" width="6" height="4" rx="1" fill="#999" stroke={color} strokeOpacity="0.5" strokeWidth="0.4"/>

      {/* Badge dot */}
      <circle cx="220" cy="98" r="1.6" fill={color} fillOpacity="0.55"/>
    </svg>
  );
}

/* Front 3/4 view — used for 360 showcase. Same viewBox so it swaps cleanly. */
function CarFrontView({ color = 'currentColor', strokeWidth = 1.5, style = {}, className = '' }) {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
      <defs>
        <linearGradient id="carFrontBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="55%" stopColor={color} stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.45"/>
        </linearGradient>
        <radialGradient id="fHeadlight" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#EAF2FF" stopOpacity="1"/>
          <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="128" rx="150" ry="4" fill="#000" opacity="0.55"/>

      {/* Main front silhouette — wide, low, aggressive */}
      <path
        d="M 70 120
           L 70 110
           Q 72 98 84 92
           L 110 72
           Q 122 58 144 56
           L 256 56
           Q 278 58 290 72
           L 316 92
           Q 328 98 330 110
           L 330 120
           Z"
        fill="url(#carFrontBody)"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>

      {/* Hood / windshield */}
      <path
        d="M 120 76 L 140 62 L 260 62 L 280 76 Z"
        fill={color} fillOpacity="0.25"
        stroke={color} strokeOpacity="0.45" strokeWidth="0.8"/>
      {/* Hood center crease */}
      <line x1="200" y1="62" x2="200" y2="76" stroke={color} strokeOpacity="0.3" strokeWidth="0.7"/>

      {/* Bumper / grille */}
      <rect x="130" y="100" width="140" height="14" rx="3" fill="#050508" stroke={color} strokeOpacity="0.55" strokeWidth="0.8"/>
      {/* Grille slats */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={138 + i * 30} y1="102" x2={138 + i * 30} y2="112" stroke={color} strokeOpacity="0.35" strokeWidth="0.6"/>
      ))}
      {/* Center badge */}
      <circle cx="200" cy="107" r="3" fill={color} fillOpacity="0.6"/>

      {/* Headlights (sharp angular) */}
      <path d="M 90 88 L 128 80 L 132 92 L 94 98 Z" fill="url(#fHeadlight)" stroke={color} strokeOpacity="0.6" strokeWidth="0.5"/>
      <path d="M 310 88 L 272 80 L 268 92 L 306 98 Z" fill="url(#fHeadlight)" stroke={color} strokeOpacity="0.6" strokeWidth="0.5"/>

      {/* Front splitter */}
      <path d="M 80 118 L 320 118 L 315 124 L 85 124 Z" fill="#000" opacity="0.85"/>

      {/* Wheels peeking */}
      <ellipse cx="88" cy="118" rx="14" ry="6" fill="#0a0a12" stroke={color} strokeWidth="1"/>
      <ellipse cx="312" cy="118" rx="14" ry="6" fill="#0a0a12" stroke={color} strokeWidth="1"/>
    </svg>
  );
}

function Rim({ size = 160, style = {}, spin = true, reverse = false }) {
  const spokes = [0, 60, 120, 180, 240, 300];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{
      animation: spin ? `${reverse ? 'spin-rev' : 'spin-slow'} 20s linear infinite` : 'none',
      ...style,
    }}>
      <circle cx="100" cy="100" r="96" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
      <circle cx="100" cy="100" r="84" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1" fill="none"/>
      <circle cx="100" cy="100" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none"/>
      {spokes.map((a) => (
        <line key={a}
          x1="100" y1="100"
          x2={100 + 68 * Math.cos((a - 90) * Math.PI / 180)}
          y2={100 + 68 * Math.sin((a - 90) * Math.PI / 180)}
          stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
      ))}
      <circle cx="100" cy="100" r="14" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(59,130,246,0.1)"/>
      <circle cx="100" cy="100" r="4" fill="var(--accent)"/>
    </svg>
  );
}

function SpeedoArc({ size = 80, progress = 1, className = '', style = {} }) {
  // Thin SVG arc that "draws" itself
  const r = 34, circ = Math.PI * r; // half-circle arc length
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <svg ref={ref} width={size} height={size / 2 + 4} viewBox="0 0 80 44" className={className} style={style}>
      <path d={`M 6 40 A ${r} ${r} 0 0 1 74 40`}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none"/>
      <path d={`M 6 40 A ${r} ${r} 0 0 1 74 40`}
        stroke="var(--accent)" strokeWidth="1.5" fill="none"
        strokeDasharray={circ}
        strokeDashoffset={inView ? (circ * (1 - progress)) : circ}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s' }}
        strokeLinecap="round"/>
      {/* Tick marks */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const a = Math.PI + Math.PI * t;
        const x1 = 40 + Math.cos(a) * r;
        const y1 = 40 + Math.sin(a) * r;
        const x2 = 40 + Math.cos(a) * (r + 3);
        const y2 = 40 + Math.sin(a) * (r + 3);
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>;
      })}
    </svg>
  );
}

function RoadDivider({ showCar = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  return (
    <div ref={ref} style={{
      position: 'relative', height: showCar ? 80 : 40,
      display: 'flex', alignItems: 'center',
      margin: '0 auto', maxWidth: 1400, padding: '0 24px',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 24, right: 24, top: '50%',
        height: 1,
        backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0 12px, transparent 12px 24px)',
        transform: 'translateY(-50%)',
      }}/>
      {showCar && (
        <div style={{
          position: 'absolute', bottom: 18, left: 0, right: 0,
          animation: inView ? 'car-drive 6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards' : 'none',
          transform: 'translateX(-10%)',
          willChange: 'transform',
        }}>
          <CarSilhouette color="var(--accent)" strokeWidth={1.2}
            style={{ width: 120, height: 42, opacity: 0.9, filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' }}/>
        </div>
      )}
    </div>
  );
}

/* ScrollFrameCar — image sequence rendered to canvas, driven by `progress` (0→1).
   Usage: drop frames in /frames/car_001.webp .. car_NNN.webp, set frameCount.
   If frames aren't present yet, shows a placeholder so the page doesn't break. */
function ScrollFrameCar({
  frameCount = 60,
  framePattern = 'frames/car_{n}.webp',
  progress = 0,
  style = {},
  aspectRatio = '16 / 9',
  pad = 3, // zero-padding: 3 => 001, 002 ... 060
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);

  // Preload every frame (once)
  useEffect(() => {
    let cancelled = false;
    let l = 0, f = 0;
    const imgs = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const idx = String(i + 1).padStart(pad, '0');
      img.src = framePattern.replace('{n}', idx);
      img.decoding = 'async';
      img.onload = () => { if (cancelled) return; l++; setLoaded(l); };
      img.onerror = () => { if (cancelled) return; f++; setFailed(f); };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => { cancelled = true; };
  }, [frameCount, framePattern, pad]);

  // Draw the current frame when progress changes (or when a frame finishes loading)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const wrap = wrapRef.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = wrap?.clientWidth || 800;
    const cssH = wrap?.clientHeight || 450;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
    }
    const idx = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * (frameCount - 1) + 0.0001)));
    const img = imagesRef.current[idx];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!img || !img.complete || !img.naturalWidth) return;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const cAspect = canvas.width / canvas.height;
    const iAspect = iw / ih;
    let dw, dh;
    if (iAspect > cAspect) { dw = canvas.width; dh = dw / iAspect; }
    else { dh = canvas.height; dw = dh * iAspect; }
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  }, [progress, loaded, failed, frameCount]);

  // Handle resize — redraw on next tick
  useEffect(() => {
    const onResize = () => setLoaded((v) => v); // trigger re-draw via state nudge
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const allFailed = failed === frameCount;
  const ready = loaded > 0;
  const pct = Math.round((loaded / frameCount) * 100);

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', aspectRatio, ...style }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}/>
      {!ready && !allFailed && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 10, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(99,102,241,0.02))',
          border: '1px dashed rgba(59,130,246,0.2)', borderRadius: 12,
        }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.35)' }}>
            LOADING FRAMES · {pct}%
          </div>
          <div style={{ width: 160, height: 1, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: 1, width: `${pct}%`, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}/>
          </div>
        </div>
      )}
      {allFailed && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 10, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(99,102,241,0.02))',
          border: '1px dashed rgba(59,130,246,0.25)', borderRadius: 12,
          textAlign: 'center', padding: 20,
        }}>
          <span style={{ fontSize: 34, opacity: 0.3 }}>🏎️</span>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.32em', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
            DROP {frameCount} FRAMES IN<br/>
            <span style={{ color: 'var(--accent)' }}>{framePattern.replace('{n}', '001')}</span> → <span style={{ color: 'var(--accent)' }}>{framePattern.replace('{n}', String(frameCount).padStart(pad, '0'))}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: 2, width: `${p}%`,
      background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)',
      zIndex: 9999, pointerEvents: 'none',
    }}/>
  );
}

Object.assign(window, {
  useIsMobile, useIsDesktopWide, useIsTouch, useInView, useScrollY, useMousePosition,
  SplitText, Reveal, AnimatedCounter, CarSilhouette, CarFrontView, Rim, SpeedoArc, RoadDivider, ScrollProgressBar,
  ScrollFrameCar,
});
