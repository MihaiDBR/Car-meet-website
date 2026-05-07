// ============================================================================
// DropDown Romania — Cinematic Landing (v3)
// ============================================================================

// TICKET_URL, INSTAGRAM_URL, WEBSITE_URL, EMAIL, CAR360_SLIDES,
// TOTAL_FRAMES, PANELS — defined in src/constants.js

const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM, useCallback: uC } = React;

// ---------- Hero background: headlight beams, exhaust smoke, car ghost ----------

function HeadlightBeams() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Left headlight beam */}
      <div style={{
        position: 'absolute',
        left: '38%',
        bottom: '-10%',
        width: 520,
        height: '120vh',
        background: 'linear-gradient(to top, rgba(255,255,255,0.0) 0%, rgba(59,130,246,0.32) 12%, rgba(59,130,246,0.14) 35%, rgba(59,130,246,0.04) 60%, transparent 90%)',
        clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)',
        transform: 'translateX(-50%) rotate(-2deg)',
        transformOrigin: '50% 100%',
        filter: 'blur(24px)',
        mixBlendMode: 'screen',
        animation: 'headlight-sway 7s ease-in-out infinite',
      }}/>
      {/* Right headlight beam */}
      <div style={{
        position: 'absolute',
        left: '62%',
        bottom: '-10%',
        width: 520,
        height: '120vh',
        background: 'linear-gradient(to top, rgba(255,255,255,0.0) 0%, rgba(59,130,246,0.32) 12%, rgba(59,130,246,0.14) 35%, rgba(59,130,246,0.04) 60%, transparent 90%)',
        clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)',
        transform: 'translateX(-50%) rotate(2deg)',
        transformOrigin: '50% 100%',
        filter: 'blur(24px)',
        mixBlendMode: 'screen',
        animation: 'headlight-sway-r 8.5s ease-in-out infinite',
      }}/>
      {/* Fog / ground glow */}
      <div style={{
        position: 'absolute', left: '50%', bottom: '-30%',
        width: 'min(1200px, 140vw)', height: 'min(800px, 100vw)',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at center top, rgba(59,130,246,0.15), transparent 65%)',
        filter: 'blur(40px)',
        animation: 'pulse-glow 9s ease-in-out infinite',
      }}/>
    </div>
  );
}

function ExhaustSmoke({ count = 20 }) {
  const particles = uM(() => (
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      dur: Math.random() * 10 + 10,
      delay: Math.random() * 12,
      drift: (Math.random() - 0.5) * 200,
      blur: Math.random() > 0.5 ? 2 : 0,
      blue: Math.random() > 0.5,
    }))
  ), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: 0,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: p.blue ? '#3B82F6' : 'rgba(255,255,255,0.8)',
          boxShadow: p.blue ? '0 0 6px rgba(59,130,246,0.7)' : '0 0 4px rgba(255,255,255,0.5)',
          filter: p.blur ? `blur(${p.blur}px)` : 'none',
          animation: `exhaust-drift ${p.dur}s linear ${p.delay}s infinite`,
          '--drift': `${p.drift}px`,
          opacity: 0,
        }}/>
      ))}
    </div>
  );
}

function HeroAtmosphere() {
  const mouse = useMousePosition();
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
    }}>
      {/* Soft blue orb that drifts with mouse — no SVG car */}
      <div style={{
        position: 'absolute',
        top: '60%', left: '50%',
        width: 'min(900px, 90vw)', height: 'min(900px, 90vw)',
        transform: `translate(calc(-50% + ${mouse.x * 30}px), calc(-50% + ${mouse.y * 18}px))`,
        background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.06) 35%, transparent 65%)',
        filter: 'blur(30px)',
        willChange: 'transform',
      }}/>
      {/* Horizontal scan lines suggesting speed */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 2px, transparent 2px 6px)',
        mixBlendMode: 'overlay',
      }}/>
    </div>
  );
}

// ---------- NAV ----------

function Nav() {
  const y = useScrollY();
  const isMobile = useIsMobile();
  const scrolled = y > 50;
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: isMobile ? '14px 16px' : '18px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      animation: 'nav-in 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards',
      background: scrolled ? 'rgba(6,6,10,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
    }}>
      <div className="display" style={{ fontSize: isMobile ? 22 : 24, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%',
          boxShadow: '0 0 10px var(--accent-glow)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}/>
        DROP<span style={{ color: 'var(--accent)' }}>DOWN</span>
      </div>
      <a href={TICKET_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
        padding: isMobile ? '10px 18px' : '11px 22px',
        minHeight: 0,
        fontSize: isMobile ? 13 : 14,
        letterSpacing: '0.22em',
      }}>BILETE</a>
    </nav>
  );
}

// ---------- HERO ----------

function Hero() {
  const isMobile = useIsMobile();
  const y = useScrollY();
  const heroOpacity = isMobile ? 1 : Math.max(0, 1 - y / 700);
  const heroShift = isMobile ? 0 : -y * 0.3;

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: heroOpacity,
      transform: `translateY(${heroShift}px)`,
      willChange: 'transform, opacity',
      paddingTop: isMobile ? 100 : 120,
      paddingBottom: isMobile ? 120 : 140,
      paddingLeft: isMobile ? 16 : 24,
      paddingRight: isMobile ? 16 : 24,
    }}>
      <HeadlightBeams/>
      <HeroAtmosphere/>
      <ExhaustSmoke count={isMobile ? 0 : 22}/>

      {!isMobile && (
        <>
          <div style={{ position: 'absolute', top: 96, left: 32, zIndex: 2, pointerEvents: 'none' }}>
            <Reveal variant="fade-right" delay={800}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.18em', lineHeight: 1.6 }}>
                [N 44°26′] [E 26°04′]<br/>
                BUCHAREST · RO
              </div>
            </Reveal>
          </div>
          <div style={{ position: 'absolute', top: 96, right: 32, zIndex: 2, pointerEvents: 'none' }}>
            <Reveal variant="fade-left" delay={800}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.18em', lineHeight: 1.6, textAlign: 'right' }}>
                FIXTURE 06 / JUNE 2026<br/>
                48H · 500+ UNITS
              </div>
            </Reveal>
          </div>
        </>
      )}

      <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 1200, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: isMobile ? '6px 14px' : '8px 20px',
          border: '1px solid var(--border)',
          borderRadius: 999,
          background: 'rgba(59,130,246,0.08)',
          backdropFilter: 'blur(8px)',
          marginBottom: isMobile ? 28 : 36,
          animation: 'badge-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s backwards',
          maxWidth: '100%',
        }}>
          <span style={{
            width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%',
            boxShadow: '0 0 8px var(--accent-glow)', animation: 'pulse-glow 2s ease-in-out infinite', flexShrink: 0,
          }}/>
          <span className="eyebrow" style={{
            fontSize: isMobile ? 9 : 11, color: 'var(--text-secondary)',
            letterSpacing: isMobile ? '0.22em' : '0.36em',
          }}>EDIȚIA 6 · 13–14 IUNIE 2026</span>
        </div>

        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(64px, 16vw, 220px)',
          lineHeight: 0.85,
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          <div style={{ overflow: 'hidden' }}>
            <SplitText split="chars" delay={800} stagger={40}>DROP</SplitText>
          </div>
          <div style={{ overflow: 'hidden', marginTop: 'clamp(-8px, -1vw, -4px)' }}>
            <SplitText split="chars" delay={1000} stagger={50} style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(59,130,246,0.65)',
            }}>DOWN</SplitText>
          </div>
        </h1>

        <Reveal variant="fade-up" delay={1400}>
          <div className="eyebrow" style={{
            marginTop: isMobile ? 24 : 36,
            fontSize: isMobile ? 11 : 14, color: 'var(--text-secondary)',
            letterSpacing: isMobile ? '0.28em' : '0.5em',
          }}>ARE YOU DOWN FOR IT!?</div>
        </Reveal>

        <Reveal variant="fade-up" delay={1600}>
          <div className="mono" style={{
            marginTop: 12,
            fontSize: isMobile ? 10 : 12,
            color: 'var(--text-muted)', letterSpacing: isMobile ? '0.22em' : '0.3em',
          }}>◇ STADIONUL STEAUA · BUCUREȘTI</div>
        </Reveal>

        <Reveal variant="fade-up" delay={1800}>
          <div style={{
            marginTop: isMobile ? 32 : 44,
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <a href={TICKET_URL} target="_blank" rel="noopener noreferrer" className="btn-primary"
              style={{ fontSize: 17, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 340 : 'none' }}>
              CUMPĂRĂ BILET
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost"
              style={{ fontSize: 17, width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 340 : 'none' }}>
              INSTAGRAM →
            </a>
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator — absolute at bottom of hero */}
      <div style={{
        position: 'absolute',
        bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'nav-in 1s ease 2.5s backwards',
        zIndex: 3,
      }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.3em' }}>SCROLL</span>
        <div style={{
          width: 1, height: 30,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
          animation: 'scroll-bounce 2s ease-in-out infinite',
        }}/>
      </div>
    </section>
  );
}

// ---------- MARQUEE ----------

function Marquee({ text, reverse = false }) {
  const isMobile = useIsMobile();
  const items = Array.from({ length: 8 }, () => text).join('    ·    ');
  return (
    <div style={{
      position: 'relative',
      padding: isMobile ? '22px 0' : '36px 0',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'inline-block', whiteSpace: 'nowrap', willChange: 'transform',
        animation: `${reverse ? 'marquee-r' : 'marquee-l'} 38s linear infinite`,
      }}>
        <span className="display" style={{
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'rgba(255,255,255,0.05)',
          letterSpacing: '0.05em', paddingRight: 80,
        }}>{items}</span>
        <span className="display" style={{
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'rgba(255,255,255,0.05)',
          letterSpacing: '0.05em', paddingRight: 80,
        }}>{items}</span>
      </div>
    </div>
  );
}

// ---------- STATS ----------

function Stats() {
  const isMobile = useIsMobile();
  const stats = [
    { v: 500, s: '+', label: 'MAȘINI' },
    { v: 15,  s: 'K', label: 'SPECTATORI' },
    { v: 6,   s: '', label: 'EDIȚII' },
    { v: 2,   s: '', label: 'ZILE' },
  ];
  return (
    <section style={{ padding: isMobile ? '80px 20px' : '140px 40px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: isMobile ? 48 : 72, display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em' }}>[ 01 — FIGURI ]</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)', minWidth: 40 }}/>
          </div>
        </Reveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 28 : 32,
        }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 140}>
              <div style={{
                position: 'relative', textAlign: 'center',
                padding: '32px 18px 26px',
                border: '1px solid var(--border)', borderRadius: 6,
                background: 'rgba(255,255,255,0.015)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <SpeedoArc size={86} progress={0.85}/>
                </div>
                <div className="display" style={{
                  fontSize: 'clamp(44px, 7vw, 72px)',
                  color: 'var(--accent)',
                  lineHeight: 0.9,
                  textShadow: '0 0 30px rgba(59,130,246,0.3)',
                }}>
                  <AnimatedCounter target={s.v} suffix={s.s}/>
                </div>
                <div className="eyebrow" style={{
                  marginTop: 14, color: 'var(--text-secondary)', fontSize: 10, letterSpacing: '0.35em',
                }}>{s.label}</div>
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 40, height: 1, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)',
                }}/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- SPEED TEASER DIVIDER ----------

function SpeedTeaser() {
  const ref = uR(null);
  const [prog, setProg] = uS(0);

  uE(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.65 - rect.top) / (window.innerHeight * 0.65)));
      setProg(p);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const entered = prog > 0.12;
  const glowOpacity = (prog * 0.22).toFixed(3);

  return (
    <div ref={ref} style={{
      position: 'relative', height: 260,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Radial glow that brightens as section enters view */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 140% at 50% 50%, rgba(59,130,246,${glowOpacity}), transparent 65%)`,
        transition: 'background 0.1s linear',
      }}/>

      {/* Speed lines radiating from center */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1440 260"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 28 }, (_, i) => {
          const angle = (i / 28) * Math.PI * 2;
          const cx = 720, cy = 130;
          const inner = 20 + prog * 60;
          const rawOuter = inner + 30 + prog * 380;
          const outer = Math.min(rawOuter, 820);
          const alpha = (0.04 + prog * 0.14).toFixed(3);
          return (
            <line key={i}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * outer}
              y2={cy + Math.sin(angle) * outer}
              stroke={`rgba(59,130,246,${alpha})`}
              strokeWidth={0.6 + prog * 0.5}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', userSelect: 'none' }}>
        <div className="mono" style={{
          fontSize: 10, color: 'var(--accent)', letterSpacing: '0.45em',
          marginBottom: 16, textTransform: 'uppercase',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
        }}>
          STADIONUL STEAUA · BUCUREȘTI
        </div>
        <div className="display" style={{
          fontSize: 'clamp(50px, 8vw, 112px)',
          lineHeight: 0.9, letterSpacing: '-0.01em', color: '#fff',
          textShadow: `0 0 ${30 + prog * 80}px rgba(59,130,246,${(0.15 + prog * 0.4).toFixed(3)})`,
          opacity: entered ? 1 : 0,
          transform: `translateY(${entered ? 0 : 18}px) scale(${entered ? 1 : 0.93})`,
          transition: 'opacity 0.65s ease, transform 0.65s ease, text-shadow 0.1s linear',
        }}>
          13 · 06 · 2026
        </div>
        <div className="mono" style={{
          fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.4em',
          marginTop: 16, textTransform: 'uppercase',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.55s 0.12s ease, transform 0.55s 0.12s ease',
        }}>
          ↓ COUNTDOWN ↓
        </div>
      </div>
    </div>
  );
}

// ---------- COUNTDOWN ----------

function Countdown() {
  const isMobile = useIsMobile();
  const target = new Date('2026-06-13T10:00:00+03:00').getTime();
  const [t, setT] = uS(() => Math.max(0, target - Date.now()));
  uE(() => {
    const id = setInterval(() => setT(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.floor(t / 86400000);
  const h = Math.floor((t % 86400000) / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);
  const units = [['ZILE', d], ['ORE', h], ['MIN', m], ['SEC', s]];
  return (
    <section style={{ padding: isMobile ? '60px 20px 80px' : '100px 40px 140px', textAlign: 'center' }}>
      <Reveal>
        <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em', marginBottom: 20 }}>
          [ 02 — CRONOMETRU ]
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="display" style={{
          fontSize: 'clamp(22px, 3.2vw, 36px)', letterSpacing: '0.05em',
          marginBottom: isMobile ? 36 : 56, color: 'var(--text-secondary)',
        }}>PORȚILE SE DESCHID ÎN</div>
      </Reveal>
      <Reveal variant="blur-in" delay={240}>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? 12 : 'clamp(14px, 2.2vw, 28px)',
          maxWidth: 900, margin: '0 auto',
        }}>
          {units.map(([label, val], i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: 'center', minWidth: isMobile ? 74 : 108, flex: isMobile ? '1 1 42%' : 'none' }}>
                <div style={{
                  position: 'relative', padding: isMobile ? '16px 8px' : '20px 12px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.018)',
                  borderRadius: 4,
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderLeft: '1px solid var(--accent)', borderTop: '1px solid var(--accent)' }}/>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRight: '1px solid var(--accent)', borderBottom: '1px solid var(--accent)' }}/>
                  <div className="display" style={{
                    fontSize: 'clamp(36px, 6vw, 52px)', lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>{String(val).padStart(2, '0')}</div>
                </div>
                <div className="eyebrow" style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.38em' }}>{label}</div>
              </div>
              {i < units.length - 1 && !isMobile && (
                <span className="display" style={{ fontSize: 36, color: 'var(--accent-dim)', marginTop: -24 }}>:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- ABOUT ----------

function About() {
  const isMobile = useIsMobile();
  const touch = useIsTouch();
  const cardRef = uR(null);
  const [tilt, setTilt] = uS({ rx: 0, ry: 0 });
  const onMove = (e) => {
    if (touch || isMobile) return;
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <section style={{ padding: isMobile ? '80px 20px' : '140px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: isMobile ? 40 : 80, display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em' }}>[ 03 — MANIFEST ]</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)', minWidth: 40 }}/>
          </div>
        </Reveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          gap: isMobile ? 48 : 80,
          alignItems: 'center',
        }}>
          <div>
            <Reveal variant="fade-right">
              <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 20, letterSpacing: '0.5em' }}>DESPRE EVENIMENT</div>
            </Reveal>
            <h2 className="display" style={{
              fontSize: 'clamp(40px, 6.5vw, 104px)',
              lineHeight: 0.92, letterSpacing: '-0.01em',
            }}>
              <div style={{ overflow: 'hidden' }}><SplitText split="words">CEL MAI MARE</SplitText></div>
              <div style={{ overflow: 'hidden', color: 'var(--accent)', textShadow: '0 0 40px rgba(59,130,246,0.3)' }}>
                <SplitText split="words" delay={120}>CAR MEETING</SplitText>
              </div>
              <div style={{ overflow: 'hidden' }}><SplitText split="words" delay={240}>DIN ROMÂNIA</SplitText></div>
            </h2>
            <Reveal variant="blur-in" delay={500}>
              <p style={{
                marginTop: 32, maxWidth: 560,
                fontSize: isMobile ? 14 : 16, lineHeight: 1.8,
                color: 'var(--text-secondary)', fontWeight: 300,
              }}>
                DropDown reunește pasionații de mașini modificate pe Stadionul Steaua din București.
                Retro, tuning, OEM+, stance, drift — totul într-un weekend epic. Alături de mașini:
                vendori auto, service-uri specializate, ateliere de detailing, zonă de food. Nu e
                doar un eveniment. E un statement.
              </p>
            </Reveal>
            <Reveal delay={700}>
              <div style={{
                marginTop: 36, paddingTop: 28,
                borderTop: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: 32,
              }}>
                {[['GAZDUIRE', 'Steaua'], ['CAPACITATE', '15,000'], ['FORMAT', '48 ore']].map(([k, v]) => (
                  <div key={k}>
                    <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em', marginBottom: 6 }}>{k}</div>
                    <div className="display" style={{ fontSize: 22, letterSpacing: '0.04em' }}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale-in" delay={200}>
            <div
              ref={cardRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              style={{
                perspective: 1000,
                maxWidth: 500, margin: isMobile ? '0 auto' : '0 0 0 auto',
              }}>
              <div style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.14), transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))',
                border: '1px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }}>
                {['tl', 'tr', 'bl', 'br'].map((c) => (
                  <div key={c} style={{
                    position: 'absolute',
                    width: 22, height: 22,
                    top: c.includes('t') ? 14 : 'auto',
                    bottom: c.includes('b') ? 14 : 'auto',
                    left: c.includes('l') ? 14 : 'auto',
                    right: c.includes('r') ? 14 : 'auto',
                    borderTop: c.includes('t') ? '1px solid var(--accent)' : 'none',
                    borderBottom: c.includes('b') ? '1px solid var(--accent)' : 'none',
                    borderLeft: c.includes('l') ? '1px solid var(--accent)' : 'none',
                    borderRight: c.includes('r') ? '1px solid var(--accent)' : 'none',
                  }}/>
                ))}
                {/* DD6 watermark */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <div className="display" style={{
                    fontSize: 'clamp(100px, 18vw, 200px)',
                    color: 'var(--text-ghost)', letterSpacing: '-0.02em', lineHeight: 1,
                  }}>DD6</div>
                </div>
                {/* CSS rotating rings (no SVG) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '62%', aspectRatio: '1 / 1',
                  transform: 'translate(-50%, -50%)',
                  border: '1px solid rgba(59,130,246,0.28)',
                  borderRadius: '50%',
                  animation: 'spin-slow 24s linear infinite',
                  pointerEvents: 'none',
                }}/>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '48%', aspectRatio: '1 / 1',
                  transform: 'translate(-50%, -50%)',
                  border: '1px dashed rgba(255,255,255,0.18)',
                  borderRadius: '50%',
                  animation: 'spin-rev 34s linear infinite',
                  pointerEvents: 'none',
                }}/>

                {/* Image placeholder panel at bottom */}
                <div style={{
                  position: 'absolute', left: 20, right: 20, bottom: 44,
                  aspectRatio: '16 / 9',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.04))',
                  border: '1px dashed rgba(59,130,246,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 6,
                }}>
                  <span style={{ fontSize: 26, opacity: 0.25 }}>📸</span>
                  <span className="eyebrow" style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.34em' }}>
                    IMAGINE MAȘINĂ
                  </span>
                </div>

                <div className="mono" style={{
                  position: 'absolute', bottom: 14, left: 16, fontSize: 9,
                  color: 'var(--text-muted)', letterSpacing: '0.3em',
                }}>
                  <span style={{ color: 'var(--accent)' }}>● </span>ACTIVE
                </div>
                <div className="mono" style={{
                  position: 'absolute', bottom: 14, right: 16, fontSize: 9,
                  color: 'var(--text-muted)', letterSpacing: '0.3em', textAlign: 'right',
                }}>ED. 06 · 06/2026</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------- CAR 360 SHOWCASE (scroll-driven image sequence) ----------
// Generate frames with:
//   ffmpeg -i car_rotation.mp4 -t 6 -vf "fps=25,scale=1920:-1" -q:v 2 frames/frame_%04d.jpg

// CAR360_SLIDES + TOTAL_FRAMES → src/constants.js

function Car360Showcase() {
  const wrapperRef = uR(null);
  const canvasRef = uR(null);
  const backdropCanvasRef = uR(null); // desktop-only path uses these
  const stageRef = uR(null);
  const progressBarRef = uR(null);
  const bitmapsRef = uR(null); // ImageBitmap[] — null until all pre-decoded (desktop only)
  const videoRef = uR(null);   // mobile path — scroll-synced HTML5 video
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = uS(0);
  const [loadPct, setLoadPct] = uS(0);
  const [framesReady, setFramesReady] = uS(false);
  const [framesMissing, setFramesMissing] = uS(false);
  const [videoReady, setVideoReady] = uS(false);
  const [videoPrimed, setVideoPrimed] = uS(false);

  // Load + pre-decode all frames via createImageBitmap (DESKTOP ONLY).
  // Mobile uses the <video> path below — frame decoding crashes low-end devices.
  uE(() => {
    if (isMobile) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;

      const bitmaps = new Array(TOTAL_FRAMES);
      let decoded = 0;

      const finish = (bm, idx) => {
        bitmaps[idx] = bm;
        decoded++;
        if (decoded % 10 === 0 || decoded >= TOTAL_FRAMES) {
          setLoadPct(decoded / TOTAL_FRAMES);
        }
        if (decoded >= TOTAL_FRAMES) {
          bitmapsRef.current = bitmaps;
          setFramesReady(true);
        }
      };

      const decodeImg = (img, idx) => {
        if (typeof createImageBitmap === 'function') {
          createImageBitmap(img)
            .then(bm => finish(bm, idx))
            .catch(() => finish(img, idx));
        } else {
          finish(img, idx);
        }
      };

      const probe = new Image();
      probe.onerror = () => setFramesMissing(true);
      probe.onload = () => {
        decodeImg(probe, 0);
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          const img = new Image();
          const idx = i - 1;
          img.onload = () => decodeImg(img, idx);
          img.onerror = () => finish(null, idx);
          img.src = `frames/frame_${String(i).padStart(4, '0')}.jpg`;
        }
      };
      probe.src = 'frames/frame_0001.jpg';
    };

    if (typeof IntersectionObserver === 'function') {
      const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      }, { rootMargin: '150% 0px 150% 0px' });
      io.observe(wrapper);
      return () => io.disconnect();
    }

    start();
  }, [isMobile]);

  // rAF draw loop — DESKTOP ONLY. Draws pre-decoded ImageBitmaps onto canvas.
  // Mobile uses the <video> + scroll-sync effects below.
  uE(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const backdropCanvas = backdropCanvasRef.current;
    const backdropCtx = backdropCanvas ? backdropCanvas.getContext('2d', { alpha: false }) : null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId;
    let lastIdx = -1;
    let currentFrame = 0; // smoothed (lerped) frame position
    let targetFrame = 0;  // raw scroll-mapped frame position
    // Smoothing factor — higher = snappier, lower = silkier glide.
    // Mobile: snappier (0.30) because touch-scroll already has inertia.
    // Desktop: silkier (0.18) for that Apple-style scroll-rotation parallax.
    const EASE = isMobile ? 0.30 : 0.18;

    function getStageRect() {
      // On mobile we draw into a fixed-size stage element instead of the full viewport.
      const stage = stageRef.current;
      if (isMobile && stage) {
        const r = stage.getBoundingClientRect();
        return { w: r.width, h: r.height };
      }
      return { w: window.innerWidth, h: window.innerHeight };
    }

    function resize() {
      const { w, h } = getStageRect();
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Backdrop canvas always sized to viewport on mobile
      if (backdropCtx && backdropCanvas) {
        backdropCanvas.width = Math.max(1, window.innerWidth * dpr);
        backdropCanvas.height = Math.max(1, window.innerHeight * dpr);
        backdropCanvas.style.width = '100%';
        backdropCanvas.style.height = '100%';
        backdropCtx.setTransform(1, 0, 0, 1, 0, 0);
        backdropCtx.scale(dpr, dpr);
      }
      lastIdx = -1;
    }

    function drawBitmap(bm) {
      const bw = bm.width ?? bm.naturalWidth;
      const bh = bm.height ?? bm.naturalHeight;
      if (!bw || !bh) return;
      const { w: vw, h: vh } = getStageRect();
      const vAspect = bw / bh;
      const cAspect = vw / vh;
      let dw, dh, dx, dy;
      if (isMobile) {
        // Cover the stage — fills edge-to-edge, no black bars.
        const scale = Math.max(vw / bw, vh / bh);
        dw = bw * scale; dh = bh * scale;
        dx = (vw - dw) / 2; dy = (vh - dh) / 2;
      } else if (cAspect > vAspect) {
        dw = vw; dh = vw / vAspect; dx = 0; dy = (vh - dh) / 2;
      } else {
        dh = vh; dw = vh * vAspect; dx = (vw - dw) / 2; dy = 0;
      }
      ctx.fillStyle = '#06060A';
      ctx.fillRect(0, 0, vw, vh);
      ctx.drawImage(bm, dx, dy, dw, dh);

      // Mobile backdrop: same frame, scaled to COVER full viewport, heavily blurred + dimmed.
      // This fills the area around the contained stage with ambient color, no dead black.
      if (backdropCtx && isMobile) {
        const bvw = window.innerWidth;
        const bvh = window.innerHeight;
        const bScale = Math.max(bvw / bw, bvh / bh) * 1.15; // 1.15× zoom to hide blur edges
        const bdw = bw * bScale;
        const bdh = bh * bScale;
        const bdx = (bvw - bdw) / 2;
        const bdy = (bvh - bdh) / 2;
        backdropCtx.fillStyle = '#06060A';
        backdropCtx.fillRect(0, 0, bvw, bvh);
        backdropCtx.save();
        backdropCtx.filter = 'blur(48px) brightness(0.45) saturate(1.1)';
        backdropCtx.drawImage(bm, bdx, bdy, bdw, bdh);
        backdropCtx.restore();
      }
    }

    const tick = () => {
      const bitmaps = bitmapsRef.current;
      if (bitmaps) {
        const rect = wrapper.getBoundingClientRect();
        const scrollDist = Math.max(1, wrapper.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDist));

        // Map scroll progress → target frame.
        // Scrolling down increases progress → frame index goes up (rotates right).
        // Scrolling up decreases progress → frame index goes down (rotates left).
        targetFrame = progress * (TOTAL_FRAMES - 1);

        // Lerp current toward target — this is what makes it feel parallax-smooth.
        const delta = targetFrame - currentFrame;
        if (Math.abs(delta) < 0.01) {
          currentFrame = targetFrame;
        } else {
          currentFrame += delta * EASE;
        }

        const frameIdx = Math.round(currentFrame);
        const safeIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIdx));
        if (safeIdx !== lastIdx && bitmaps[safeIdx]) {
          drawBitmap(bitmaps[safeIdx]);
          lastIdx = safeIdx;
        }

        if (progressBarRef.current) {
          progressBarRef.current.style.width = (progress * 100).toFixed(2) + '%';
        }

        const idx = Math.min(3, Math.floor(progress * 4));
        setActiveSlide((prev) => (prev === idx ? prev : idx));
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile]);

  // ===== MOBILE: prime the <video> for currentTime seeking =====
  // iOS Safari requires play() to be called once (then pause) before currentTime
  // updates render visible frames. Without this, scroll-sync just shows the poster.
  uE(() => {
    if (!isMobile) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const prime = async () => {
      if (cancelled) return;
      try {
        video.muted = true;
        const p = video.play();
        if (p && typeof p.then === 'function') await p;
        if (cancelled) return;
        video.pause();
        video.currentTime = 0;
      } catch (_) {
        // autoplay blocked — try seeking anyway
      }
      if (!cancelled) {
        setVideoPrimed(true);
        setVideoReady(true);
      }
    };

    if (video.readyState >= 2) {
      prime();
    } else {
      const onReady = () => prime();
      video.addEventListener('loadeddata', onReady, { once: true });
      // Safety net — some iOS versions fire 'canplay' before 'loadeddata'
      video.addEventListener('canplay', onReady, { once: true });
      return () => {
        cancelled = true;
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('canplay', onReady);
      };
    }

    return () => { cancelled = true; };
  }, [isMobile]);

  // ===== MOBILE: scroll-driven currentTime + slide tracking =====
  uE(() => {
    if (!isMobile) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    let rafScheduled = false;

    const compute = () => {
      rafScheduled = false;
      const rect = wrapper.getBoundingClientRect();
      const scrollDist = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDist));

      const dur = video.duration;
      if (videoPrimed && dur && Number.isFinite(dur) && dur > 0) {
        const target = progress * dur;
        // Avoid redundant seeks (each seek is expensive on iOS)
        if (Math.abs((video.currentTime || 0) - target) > 0.03) {
          try { video.currentTime = target; } catch (_) {}
        }
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.width = (progress * 100).toFixed(2) + '%';
      }

      const idx = Math.min(3, Math.floor(progress * 4));
      setActiveSlide((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile, videoPrimed]);

  // ===== MOBILE LAYOUT =====
  // Replaced the 150-frame ImageBitmap canvas with a native <video> element.
  // Browser streams the MP4 on demand — no 700MB RAM spike, no crash on Android.
  if (isMobile) {
    return (
      <div ref={wrapperRef} style={{
        height: '300vh',
        position: 'relative',
      }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden',
          background: '#06060A',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}>
          {/* Main car stage — native HTML5 video, scroll-synced via currentTime */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="frames/frame_0001.jpg"
            disableRemotePlayback
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              backgroundColor: '#06060A',
            }}
          >
            <source src="car_rotation.mp4" type="video/mp4" />
          </video>

          {/* Strong vignette for text legibility */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, rgba(6,6,10,0.45) 0%, rgba(6,6,10,0.55) 45%, rgba(6,6,10,0.85) 90%, rgba(6,6,10,0.95) 100%)',
          }}/>
          {/* Extra horizontal band behind centered text for max contrast */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent 0%, transparent 25%, rgba(6,6,10,0.55) 50%, transparent 75%, transparent 100%)',
          }}/>

          {/* TOP — meta row */}
          <div style={{
            position: 'absolute', top: 16, left: 16, right: 16, zIndex: 4,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 12, pointerEvents: 'none',
          }}>
            <span className="mono" style={{
              fontSize: 10, color: '#7BB3FF', letterSpacing: '0.3em',
              textShadow: '0 1px 12px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.85)',
            }}>[ 04 — SHOWCASE ]</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{
                fontSize: 9, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.25em',
                textShadow: '0 1px 12px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.8)',
              }}>{CAR360_SLIDES[activeSlide].chapter}</span>
              <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.25)', position: 'relative' }}>
                <div ref={progressBarRef} style={{
                  position: 'absolute', top: 0, left: 0, height: 1, width: '0%',
                  background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)',
                }}/>
              </div>
            </div>
          </div>

          {/* CENTER text — absolute, stacked slides, just like desktop */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 20px', pointerEvents: 'none',
          }}>
            {CAR360_SLIDES.map((slide, i) => (
              <div key={i} style={{
                position: 'absolute', maxWidth: 480, padding: '0 16px',
                opacity: i === activeSlide ? 1 : 0,
                transform: i === activeSlide ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}>
                <div className="eyebrow" style={{
                  fontSize: 10, color: '#7BB3FF', letterSpacing: '0.45em', marginBottom: 14,
                  textShadow: '0 1px 16px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.9), 0 0 40px rgba(59,130,246,0.4)',
                  fontWeight: 600,
                }}>{slide.eyebrow}</div>
                <h3 className="display" style={{
                  fontSize: 'clamp(40px, 11vw, 68px)',
                  color: '#fff', lineHeight: 0.92, letterSpacing: '-0.01em', margin: 0,
                  textShadow: '0 2px 32px rgba(0,0,0,0.95), 0 0 48px rgba(0,0,0,0.85), 0 0 80px rgba(59,130,246,0.25)',
                }}>{slide.title}</h3>
                <p style={{
                  marginTop: 16, marginBottom: 0, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto',
                  fontSize: 13, lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.92)', fontWeight: 400,
                  textShadow: '0 1px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.9)',
                }}>{slide.desc}</p>
              </div>
            ))}
          </div>

          {/* BOTTOM — dots + hint */}
          <div style={{
            position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 4,
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
            flexWrap: 'wrap', padding: '0 20px', pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {CAR360_SLIDES.map((_, i) => (
                <div key={i} style={{
                  width: i === activeSlide ? 24 : 6, height: 2,
                  background: i === activeSlide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                  boxShadow: i === activeSlide ? '0 0 8px var(--accent-glow)' : '0 0 6px rgba(0,0,0,0.6)',
                  transition: 'width 0.4s ease, background 0.4s ease',
                }}/>
              ))}
            </div>
            <span className="mono" style={{
              fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em',
              textShadow: '0 1px 12px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.85)',
            }}>SCROLL TO EXPLORE</span>
          </div>

          {/* Loading overlay (mobile) — fades out the moment video is primed */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 18,
            background: '#06060A',
            opacity: videoReady ? 0 : 1,
            pointerEvents: videoReady ? 'none' : 'auto',
            transition: 'opacity 0.5s ease',
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.35em' }}>
              LOADING SHOWCASE
            </div>
            <div style={{
              width: 28, height: 28,
              border: '2px solid rgba(255,255,255,0.08)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin-slow 1s linear infinite',
            }}/>
          </div>
        </div>
      </div>
    );
  }

  // ===== DESKTOP LAYOUT (unchanged) =====
  return (
    <div ref={wrapperRef} style={{
      height: '500vh',
      position: 'relative',
    }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden',
        background: '#06060A',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>

        {/* Loading overlay */}
        {!framesReady && !framesMissing && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 18,
            background: '#06060A',
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.35em' }}>
              LOADING · {Math.round(loadPct * 100)}%
            </div>
            <div style={{ width: 220, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: 1,
                width: `${loadPct * 100}%`,
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent-glow)',
                transition: 'width 0.12s linear',
              }}/>
            </div>
          </div>
        )}

        {/* Frames missing — show ffmpeg command */}
        {framesMissing && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16, padding: 32, textAlign: 'center',
            background: '#06060A',
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.35em' }}>FRAMES LIPSESC</div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 2,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              Rulează în terminal (lângă index.html):<br/>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                mkdir frames<br/>
                ffmpeg -i car_rotation.mp4 -t 6 -vf "fps=25,scale=1920:-1" -q:v 2 frames/frame_%04d.jpg
              </span>
            </div>
          </div>
        )}

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(6,6,10,0.5) 70%, rgba(6,6,10,0.88) 100%)',
        }}/>

        {/* Top meta */}
        <div style={{
          position: 'absolute', top: 'clamp(12px, 2.5vh, 28px)', left: 24, right: 24, zIndex: 3,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16, pointerEvents: 'none', flexWrap: 'wrap',
        }}>
          <span className="mono" style={{
            fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em',
            textShadow: '0 1px 12px rgba(0,0,0,0.9)',
          }}>[ 04 — SHOWCASE ]</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mono" style={{
              fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.25em',
              textShadow: '0 1px 12px rgba(0,0,0,0.9)',
            }}>{CAR360_SLIDES[activeSlide].chapter}</span>
            <div style={{ width: 'clamp(80px, 14vw, 140px)', height: 1, background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
              <div ref={progressBarRef} style={{
                position: 'absolute', top: 0, left: 0, height: 1, width: '0%',
                background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)',
              }}/>
            </div>
          </div>
        </div>

        {/* Center slides */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 20px', pointerEvents: 'none',
        }}>
          {CAR360_SLIDES.map((slide, i) => (
            <div key={i} style={{
              position: 'absolute', maxWidth: 900, padding: '0 24px',
              opacity: i === activeSlide ? 1 : 0,
              transform: i === activeSlide ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}>
              <div className="eyebrow" style={{
                fontSize: 'clamp(10px, 1.1vw, 12px)',
                color: 'var(--accent)', letterSpacing: '0.45em', marginBottom: 20,
                textShadow: '0 1px 16px rgba(0,0,0,0.95)',
              }}>{slide.eyebrow}</div>
              <h3 className="display" style={{
                fontSize: 'clamp(52px, 11vw, 130px)',
                color: '#fff', lineHeight: 0.9, letterSpacing: '-0.01em',
                textShadow: '0 2px 48px rgba(0,0,0,0.85), 0 0 80px rgba(59,130,246,0.2)',
              }}>{slide.title}</h3>
              <p style={{
                marginTop: 28, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
                fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.65,
                color: 'rgba(255,255,255,0.75)', fontWeight: 300,
                textShadow: '0 1px 24px rgba(0,0,0,0.95)',
              }}>{slide.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom dots + hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 3,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
          pointerEvents: 'none', flexWrap: 'wrap', padding: '0 20px',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {CAR360_SLIDES.map((_, i) => (
              <div key={i} style={{
                width: i === activeSlide ? 28 : 8, height: 2,
                background: i === activeSlide ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                boxShadow: i === activeSlide ? '0 0 8px var(--accent-glow)' : 'none',
                transition: 'width 0.4s ease, background 0.4s ease',
              }}/>
            ))}
          </div>
          <span className="mono" style={{
            fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em',
            textShadow: '0 1px 12px rgba(0,0,0,0.9)',
          }}>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </div>
  );
}


// ---------- TIRE TREAD DIVIDER ----------

function TireTreadDivider() {
  return (
    <div style={{
      position: 'relative',
      height: 48, maxWidth: 1400, margin: '0 auto',
      padding: '0 24px', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 24, right: 24, top: '50%',
        height: 14, transform: 'translateY(-50%)',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 14px, transparent 14px 32px)',
        animation: 'tire-slide 1.8s linear infinite',
        maskImage: 'linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)',
      }}/>
      <div style={{
        position: 'absolute', left: 24, right: 24, top: 'calc(50% + 12px)',
        height: 1, background: 'rgba(59,130,246,0.2)',
        transform: 'translateY(-50%)',
      }}/>
    </div>
  );
}

// ---------- HORIZONTAL SCROLL (desktop ≥1024) ----------

// PANELS → src/constants.js

function HorizontalCategories() {
  const sectionRef = uR(null);
  const trackRef = uR(null);
  const [progress, setProgress] = uS(0);
  const [activeIdx, setActiveIdx] = uS(0);

  uE(() => {
    let raf;
    const tick = () => {
      const sec = sectionRef.current;
      const tr = trackRef.current;
      if (sec && tr) {
        const rect = sec.getBoundingClientRect();
        const total = sec.offsetHeight - window.innerHeight;
        const p = Math.max(0, Math.min(1, -rect.top / total));
        const maxTrans = tr.scrollWidth - window.innerWidth;
        tr.style.transform = `translate3d(${-p * maxTrans}px, 0, 0)`;
        setProgress(p);
        setActiveIdx(Math.min(PANELS.length - 1, Math.floor(p * PANELS.length)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Horizontal scroll on all screen sizes
  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '400vh' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        {/* Overlay meta */}
        <div style={{
          position: 'absolute', top: 28, left: 40, right: 40, zIndex: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none',
        }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em' }}>[ 05 — CATEGORII ]</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>
              {String(activeIdx + 1).padStart(2, '0')}
              <span style={{ margin: '0 6px', color: 'var(--text-ghost)' }}>/</span>
              {String(PANELS.length).padStart(2, '0')}
            </div>
            <div style={{ width: 120, height: 1, background: 'var(--border)', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: 1,
                width: `${progress * 100}%`,
                background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)',
              }}/>
            </div>
          </div>
        </div>

        <div ref={trackRef} style={{
          display: 'flex', width: `${PANELS.length * 100}vw`, height: '100%',
          willChange: 'transform',
        }}>
          {PANELS.map((p, i) => {
            const panelCenter = i / Math.max(1, PANELS.length - 1);
            const dist = Math.abs(progress - panelCenter);
            const scale = 1 - Math.min(0.12, dist * 0.8);
            const opacity = 1 - Math.min(0.55, dist * 1.8);
            return (
              <div key={p.num} style={{
                width: '100vw', height: '100%', flexShrink: 0,
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `radial-gradient(ellipse at 50% 50%, hsla(${p.hue}, 80%, 55%, 0.07), transparent 70%)`,
              }}>
                {/* Big ghost number */}
                <div className="display" style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: `translate(calc(-50% + ${(progress - panelCenter) * 180}px), -50%)`,
                  fontSize: 'clamp(300px, 40vw, 640px)',
                  color: 'rgba(255,255,255,0.035)',
                  lineHeight: 0.8, letterSpacing: '-0.04em', pointerEvents: 'none',
                }}>{p.num}</div>

                {/* Vertical text */}
                <div style={{
                  position: 'absolute', left: 48, top: '50%',
                  transform: 'rotate(-90deg) translateX(50%)',
                  transformOrigin: 'left center',
                }}>
                  <span className="mono" style={{
                    fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.4em',
                  }}>{p.vert}</span>
                </div>

                {/* Center content */}
                <div style={{
                  position: 'relative', zIndex: 2, textAlign: 'center',
                  maxWidth: 720, padding: '0 40px',
                  transform: `scale(${scale})`,
                  opacity,
                  transition: 'opacity 0.3s ease',
                }}>
                  <div style={{
                    fontSize: 64, color: `hsl(${p.hue}, 80%, 65%)`, marginBottom: 22,
                    textShadow: `0 0 40px hsla(${p.hue}, 80%, 55%, 0.6)`,
                  }}>{p.icon}</div>
                  <div className="eyebrow" style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                    PANEL {p.num} / 04
                  </div>
                  <h3 className="display" style={{
                    fontSize: 'clamp(60px, 12vw, 140px)',
                    lineHeight: 0.9, letterSpacing: '-0.01em',
                    textShadow: `0 0 60px hsla(${p.hue}, 80%, 50%, 0.35)`,
                  }}>{p.name}</h3>
                  <p style={{
                    marginTop: 24, maxWidth: 520, margin: '24px auto 0',
                    fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', fontWeight: 300,
                  }}>{p.desc}</p>
                </div>

                {/* Bottom-right coord */}
                <div style={{
                  position: 'absolute', right: 40, bottom: 48, textAlign: 'right',
                }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.3em' }}>
                    COORD<br/>
                    <span style={{ color: 'var(--accent)' }}>H{p.hue}°</span> · SAT 80
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- REGISTRATION FORM ----------

function RegistrationForm() {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = uS(false);
  const [f, setF] = uS({
    name: '', email: '', phone: '', car: '', year: '', category: '', mods: '', insta: '',
  });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.car) return;
    setSubmitted(true);
  };
  return (
    <section id="inscrieri" style={{ padding: isMobile ? '80px 20px' : '140px 40px', scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: isMobile ? 24 : 40, display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em' }}>[ 06 — ÎNSCRIERI ]</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)', minWidth: 40 }}/>
          </div>
        </Reveal>
        <h2 className="display" style={{
          fontSize: 'clamp(44px, 9vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.01em',
          textAlign: isMobile ? 'center' : 'left', marginBottom: 20,
        }}>
          <div style={{ overflow: 'hidden' }}><SplitText split="words">ÎNSCRIE-ȚI</SplitText></div>
          <div style={{ overflow: 'hidden', color: 'var(--accent)' }}><SplitText split="words" delay={120}>MAȘINA.</SplitText></div>
        </h2>
        <Reveal delay={250}>
          <p style={{
            fontSize: isMobile ? 14 : 15, lineHeight: 1.7, color: 'var(--text-secondary)', fontWeight: 300,
            maxWidth: 560, marginBottom: 44, textAlign: isMobile ? 'center' : 'left',
            marginLeft: isMobile ? 'auto' : 0, marginRight: isMobile ? 'auto' : 0,
          }}>
            Completează formularul pentru a-ți rezerva locul pe teren. Locurile sunt limitate.
            Confirmarea vine pe email în 48h.
          </p>
        </Reveal>
        <Reveal variant="scale-in" delay={350}>
          <div style={{
            position: 'relative',
            padding: isMobile ? '24px 20px' : '40px 40px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '1px solid var(--accent)', borderLeft: '1px solid var(--accent)' }}/>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '1px solid var(--accent)', borderRight: '1px solid var(--accent)' }}/>
            {submitted ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, margin: '0 auto 22px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', fontSize: 28,
                  boxShadow: '0 0 24px rgba(59,130,246,0.35)',
                }}>✓</div>
                <div className="display" style={{ fontSize: 36, letterSpacing: '0.02em', marginBottom: 10 }}>MULȚUMIM!</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
                  Vom reveni cu un email de confirmare la adresa <span style={{ color: 'var(--accent)' }}>{f.email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 18,
              }}>
                <Field label="NUME COMPLET *">
                  <input required type="text" value={f.name} onChange={up('name')} placeholder="Andrei Popescu"/>
                </Field>
                <Field label="EMAIL *">
                  <input required type="email" value={f.email} onChange={up('email')} placeholder="tu@example.com"/>
                </Field>
                <Field label="TELEFON">
                  <input type="tel" value={f.phone} onChange={up('phone')} placeholder="+40 700 000 000"/>
                </Field>
                <Field label="MARCA & MODELUL *">
                  <input required type="text" value={f.car} onChange={up('car')} placeholder="BMW E46 M3"/>
                </Field>
                <Field label="ANUL FABRICAȚIEI">
                  <input type="number" min="1960" max="2027" value={f.year} onChange={up('year')} placeholder="2003"/>
                </Field>
                <Field label="CATEGORIE">
                  <select value={f.category} onChange={up('category')}>
                    <option value="">Alege categorie</option>
                    {['Retro', 'Tuning', 'OEM+', 'Stance', 'Drift', 'Show & Shine'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="DESCRIERE MODIFICĂRI">
                    <textarea value={f.mods} onChange={up('mods')} rows={3} placeholder="Suspensie coilover, jante OZ 18', tuning Stage 2, wrap negru mat..."/>
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="LINK INSTAGRAM MAȘINĂ (opțional)">
                    <input type="url" value={f.insta} onChange={up('insta')} placeholder="https://instagram.com/..."/>
                  </Field>
                </div>
                <button type="submit" className="btn-primary" style={{
                  gridColumn: '1 / -1',
                  width: '100%', minHeight: 56, fontSize: 18, letterSpacing: '0.28em', marginTop: 4,
                }}>TRIMITE ÎNSCRIEREA →</button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label className="eyebrow" style={{
        fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)',
      }}>{label}</label>
      {children}
    </div>
  );
}

// ---------- FINAL CTA ----------

function FinalCTA() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      position: 'relative',
      padding: isMobile ? '120px 20px' : '180px 40px',
      overflow: 'hidden',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(1200px, 140vw)', height: 'min(1200px, 140vw)',
        background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.1) 35%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'pulse-glow 7s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>
      <ExhaustSmoke count={isMobile ? 0 : 24}/>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 28 }}>NE VEDEM PE STADION</div>
        </Reveal>
        <h2 className="display" style={{
          fontSize: 'clamp(56px, 11vw, 180px)',
          lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: 40,
        }}>
          <div style={{ overflow: 'hidden' }}>
            <SplitText split="words">ARE YOU DOWN</SplitText>
          </div>
          <div style={{ overflow: 'hidden', color: 'var(--accent)', textShadow: '0 0 60px rgba(59,130,246,0.4)' }}>
            <SplitText split="words" delay={120}>FOR IT!?</SplitText>
          </div>
        </h2>
        <Reveal variant="blur-in" delay={400}>
          <p style={{
            maxWidth: 560, margin: '0 auto 44px',
            fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: 'var(--text-secondary)', fontWeight: 300,
          }}>13–14 IUNIE 2026 · STADIONUL STEAUA</p>
        </Reveal>
        <Reveal delay={600}>
          <a href={TICKET_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
            fontSize: isMobile ? 18 : 22, padding: isMobile ? '18px 32px' : '22px 48px',
            letterSpacing: '0.3em', minHeight: 56,
            animation: 'glow-breathe 4s ease-in-out infinite',
            width: isMobile ? 'calc(100% - 20px)' : 'auto',
            maxWidth: isMobile ? 360 : 'none',
          }}>CUMPĂRĂ BILET ACUM</a>
        </Reveal>
        <Reveal delay={800}>
          <div className="mono" style={{
            marginTop: 40, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.35em',
          }}>POARTA SE DESCHIDE · 13.06.2026 · 10:00 EEST</div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------

function IgIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.1" fill={color} stroke="none"/>
    </svg>
  );
}
function MailIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7l9 6 9-6"/>
    </svg>
  );
}
function GlobeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18"/>
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>
    </svg>
  );
}
function TicketIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/>
      <path d="M13 6v12" strokeDasharray="2 2"/>
    </svg>
  );
}

function SocialButton({ href, icon, label, handle }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px',
      border: '1px solid var(--border)',
      borderRadius: 8,
      background: 'rgba(255,255,255,0.02)',
      transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(59,130,246,0.12)',
        color: 'var(--accent)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'left', minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.3em', marginBottom: 3 }}>{label}</div>
        <div className="display" style={{ fontSize: 15, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{handle}</div>
      </div>
    </a>
  );
}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{
      position: 'relative',
      padding: isMobile ? '72px 24px 32px' : '96px 40px 40px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.85) 100%)',
      textAlign: isMobile ? 'center' : 'left',
      borderTop: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, var(--accent) 20%, var(--accent) 80%, transparent)',
        boxShadow: '0 0 20px rgba(59,130,246,0.4)',
      }}/>
      {/* Shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: '30%',
          background: 'linear-gradient(to right, transparent, #fff, transparent)',
          animation: 'shimmer-line 6s ease-in-out infinite',
        }}/>
      </div>
      {/* Ghost car in bg */}
      <div style={{
        position: 'absolute', bottom: -40, right: -80,
        width: isMobile ? 280 : 480,
        opacity: 0.06,
        pointerEvents: 'none',
        transform: 'scaleX(-1)',
      }}>
        <CarSilhouette color="#fff" strokeWidth={1} style={{ width: '100%', height: 'auto' }}/>
      </div>

      <Reveal variant="fade-up" threshold={0.05}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {/* Top row: big logo + tagline */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-end',
            gap: isMobile ? 24 : 40,
            marginBottom: isMobile ? 40 : 56,
            paddingBottom: isMobile ? 32 : 48,
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div className="display" style={{
                fontSize: isMobile ? 48 : 72, letterSpacing: '0.04em', lineHeight: 0.9,
              }}>
                DROP<span style={{ color: 'var(--accent)', textShadow: '0 0 30px rgba(59,130,246,0.5)' }}>DOWN</span>
              </div>
              <div className="eyebrow" style={{
                marginTop: 12, color: 'var(--text-muted)', letterSpacing: '0.4em',
                fontSize: isMobile ? 10 : 12,
              }}>ARE YOU DOWN FOR IT!?</div>
            </div>
            <a href={TICKET_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
              fontSize: 15, padding: '14px 28px', minHeight: 0, whiteSpace: 'nowrap',
            }}>
              CUMPĂRĂ BILET →
            </a>
          </div>

          {/* Middle: social buttons grid */}
          <div style={{ marginBottom: isMobile ? 40 : 52 }}>
            <div className="eyebrow" style={{
              color: 'var(--accent)', letterSpacing: '0.5em',
              fontSize: 11, marginBottom: 22,
              textAlign: isMobile ? 'center' : 'left',
            }}>URMĂREȘTE-NE · FII LA CURENT</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: 14,
            }}>
              <SocialButton href={INSTAGRAM_URL} icon={<IgIcon size={20}/>}
                label="INSTAGRAM" handle="@dropdownromania"/>
              <SocialButton href={`mailto:${EMAIL}`} icon={<MailIcon size={20}/>}
                label="EMAIL" handle={EMAIL}/>
              <SocialButton href={WEBSITE_URL} icon={<GlobeIcon size={20}/>}
                label="WEBSITE" handle="dropdown.ro"/>
              <SocialButton href={TICKET_URL} icon={<TicketIcon size={20}/>}
                label="BILETE" handle="bilet.ro"/>
            </div>
          </div>

          {/* Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 32 : 48,
            marginBottom: 40,
          }}>
            <FCol title="ADRESĂ">
              Bulevardul Ghencea 45<br/>
              București, Sector 6<br/>
              România
            </FCol>
            <FCol title="EVENIMENT">
              13 — 14 Iunie 2026<br/>
              Stadionul Steaua<br/>
              Ediția 6
            </FCol>
            <FCol title="NAVIGARE">
              <FL href={TICKET_URL}>Bilete →</FL><br/>
              <FL href="#inscrieri">Înscrieri mașini →</FL><br/>
              <FL href={INSTAGRAM_URL}>Comunitate →</FL>
            </FCol>
          </div>

          {/* Bottom row */}
          <div style={{
            paddingTop: 24, borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
            flexDirection: isMobile ? 'column' : 'row', alignItems: 'center',
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.22em' }}>
              © 2026 DROPDOWN ROMANIA · TOATE DREPTURILE REZERVATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.25s, transform 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <IgIcon size={18}/>
              </a>
              <a href={`mailto:${EMAIL}`} aria-label="Email"
                style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.25s, transform 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <MailIcon size={18}/>
              </a>
              <span className="mono" style={{
                padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999,
                fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.3em',
              }}>
                <span style={{ color: 'var(--accent)' }}>●</span> LIVE
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
function FCol({ title, children }) {
  return (
    <div>
      <div className="eyebrow" style={{
        color: 'var(--accent)', letterSpacing: '0.4em', marginBottom: 16, fontSize: 11,
      }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9, fontWeight: 300 }}>
        {children}
      </div>
    </div>
  );
}
function FL({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{
        color: 'var(--text-secondary)',
        transition: 'color 0.25s',
        borderBottom: '1px solid transparent',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
    >{children}</a>
  );
}

// ---------- APP ----------

function App() {
  return (
    <>
      <ScrollProgressBar/>
      <Nav/>
      <HeroPremium/>
      <Marquee text="DROPDOWN · CAR CULTURE · STANCE · TUNING · DRIFT · STADIONUL STEAUA · BUCUREȘTI"/>
      <Stats/>
      <SpeedTeaser/>
      <Countdown/>
      <About/>
      <TireTreadDivider/>
      <Car360Showcase/>
      <HorizontalCategories/>
      <Marquee text="BMW · AUDI · PORSCHE · MERCEDES · VW · NISSAN · TOYOTA · MAZDA · HONDA · LAMBORGHINI" reverse/>
      <RegistrationForm/>
      <MosaicGallery/>
      <FinalCTA/>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
