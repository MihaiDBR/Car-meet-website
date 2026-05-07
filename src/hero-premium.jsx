// DropDown Romania — Premium Hero v4
// Concept: modern bento dashboard — live status + giant title + live countdown card + stats strip
// Inspiration: Linear, Vercel, Stripe — typography-driven, no decorative imagery

function HeroPremium() {
  const { motion, useMotionValue, useSpring, useTransform } = window.Motion;
  const isMobile = useIsMobile();
  const scrollY  = useScrollY();

  const heroOpacity = isMobile ? 1 : Math.max(0, 1 - scrollY / 800);
  const heroShift   = isMobile ? 0 : -scrollY * 0.18;

  // Mouse-follow spotlight (desktop only)
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smX = useSpring(mx, { stiffness: 60, damping: 28 });
  const smY = useSpring(my, { stiffness: 60, damping: 28 });
  const spotlight = useTransform(
    [smX, smY],
    ([x, y]) => `radial-gradient(620px circle at ${x}% ${y}%, rgba(99,102,241,0.13), transparent 55%)`
  );

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width)  * 100);
    my.set(((e.clientY - r.top)  / r.height) * 100);
  };

  // Live countdown
  const [t, setT] = React.useState({ d: 0, h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    const target = new Date('2026-06-13T10:00:00').getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');

  const TITLE = ['D','R','O','P','D','O','W','N'];

  return (
    <section
      onMouseMove={!isMobile ? onMove : undefined}
      style={{
        position: 'relative', minHeight: '100vh',
        overflow: 'hidden',
        opacity: heroOpacity,
        transform: `translateY(${heroShift}px)`,
        willChange: 'transform, opacity',
        display: 'flex', flexDirection: 'column',
      }}
    >

      {/* ── Mesh gradient background ─────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(99,102,241,0.18), transparent 60%)',
          'radial-gradient(ellipse 70% 60% at 100% 100%, rgba(59,130,246,0.16), transparent 65%)',
          'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99,102,241,0.05), transparent 70%)',
        ].join(','),
      }}/>

      {/* ── Mouse spotlight ──────────────────────────────────────── */}
      {!isMobile && (
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: spotlight,
        }}/>
      )}

      {/* ── Subtle grid ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)',
      }}/>

      {/* ── Top live status bar ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
        style={{
          position: 'relative', zIndex: 4,
          marginTop: isMobile ? 70 : 80,
          padding: isMobile ? '12px 16px' : '14px 32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
          <motion.div
            animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e' }}
          />
          <div style={{ position: 'absolute', inset: 1, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px rgba(34,197,94,0.8)' }}/>
        </div>
        <span className="mono" style={{ fontSize: 9, color: '#22c55e', letterSpacing: '0.42em', flexShrink: 0 }}>LIVE</span>
        <div style={{ height: 12, width: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}/>
        <span className="mono" style={{
          fontSize: isMobile ? 9 : 10,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.32em',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          DROPDOWN '26 · 13–14 IUN · STADIONUL STEAUA · BUCUREȘTI · 500+ CARS
        </span>
        {!isMobile && (
          <span className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.4em', flexShrink: 0 }}>
            EDITION 06 / RO
          </span>
        )}
      </motion.div>

      {/* ── Main bento grid ──────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 3,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.35fr) minmax(0, 1fr)',
        gap: isMobile ? 28 : 56,
        padding: isMobile ? '40px 16px 32px' : '70px clamp(28px,5vw,72px) 56px',
        maxWidth: 1500,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        alignItems: 'center',
      }}>

        {/* ── LEFT: title block ──────────────────────────────── */}
        <div>
          {/* Edition badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 12px',
              borderRadius: 999,
              border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
              marginBottom: 28,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#818CF8', boxShadow: '0 0 8px rgba(129,140,248,0.7)' }}/>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '0.42em', color: 'rgba(255,255,255,0.85)' }}>
              EDIȚIA 6 · CAR CULTURE RO
            </span>
          </motion.div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: isMobile ? 'clamp(64px, 17vw, 100px)' : 'clamp(96px, 11vw, 200px)',
            lineHeight: 0.85,
            letterSpacing: '-0.018em',
            margin: 0,
            marginBottom: 8,
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'hidden',
          }}>
            {TITLE.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  delay: 0.35 + i * 0.05,
                  type: 'spring', stiffness: 90, damping: 15,
                }}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.45) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >{ch}</motion.span>
            ))}
          </h1>

          {/* Subtitle line */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: [0.22,1,0.36,1] }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              marginBottom: 28, marginTop: 8,
            }}
          >
            <div style={{
              width: 32, height: 1,
              background: 'linear-gradient(to right, var(--accent), rgba(59,130,246,0.2))',
            }}/>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? 12 : 14,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              The largest car meet · Romania
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: isMobile ? 14 : 16,
              fontWeight: 300,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 460,
              margin: 0,
              marginBottom: 36,
            }}
          >
            48 de ore non-stop. 500+ mașini modificate. O arenă întreagă transformată în sanctuarul culturii auto.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            style={{
              display: 'flex', gap: 10,
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <motion.a
              href={TICKET_URL} target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ width: isMobile ? '100%' : 'auto', textAlign: 'center' }}
            >
              CUMPĂRĂ BILET →
            </motion.a>
            <motion.a
              href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="btn-ghost"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ width: isMobile ? '100%' : 'auto', textAlign: 'center' }}
            >
              @DROPDOWNROMANIA
            </motion.a>
          </motion.div>
        </div>

        {/* ── RIGHT: live countdown card ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.95, ease: [0.22,1,0.36,1] }}
          style={{
            position: 'relative',
            padding: isMobile ? '22px 22px' : '28px 30px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012))',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset',
          }}
        >
          {/* Top gradient accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.6), rgba(59,130,246,0.6), transparent)',
          }}/>
          {/* Corner glow */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
            pointerEvents: 'none',
          }}/>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, position: 'relative' }}>
            <span className="mono" style={{
              fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.42em',
            }}>EVENT COUNTDOWN</span>
            <span className="mono" style={{
              fontSize: 9, color: '#818CF8', letterSpacing: '0.3em',
              padding: '3px 10px', borderRadius: 2,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)',
            }}>T-{t.d}D</span>
          </div>

          {/* Numbers grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: isMobile ? 6 : 10, marginBottom: 26,
            position: 'relative',
          }}>
            {[
              { lbl: 'ZILE', val: pad(t.d) },
              { lbl: 'ORE',  val: pad(t.h) },
              { lbl: 'MIN',  val: pad(t.m) },
              { lbl: 'SEC',  val: pad(t.s) },
            ].map((u) => (
              <div key={u.lbl} style={{
                textAlign: 'center',
                padding: isMobile ? '10px 0' : '12px 0',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: isMobile ? 'clamp(24px,7vw,32px)' : 'clamp(28px,3.4vw,44px)',
                  fontWeight: 500, color: '#fff', letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1, marginBottom: 8,
                }}>{u.val}</div>
                <div className="mono" style={{
                  fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.32em',
                }}>{u.lbl}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 18 }}/>

          {/* Detail rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, position: 'relative' }}>
            {[
              { lbl: 'DATE',  val: '13–14 IUN 2026'  },
              { lbl: 'VENUE', val: 'STADIONUL STEAUA' },
              { lbl: 'UNITS', val: '500+ CARS'       },
            ].map((row) => (
              <div key={row.lbl} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.32em' }}>
                  {row.lbl}
                </span>
                <span className="mono" style={{ fontSize: 11, color: '#fff', letterSpacing: '0.16em', fontWeight: 500 }}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom stats strip ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'relative', zIndex: 3,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: isMobile ? '16px 16px' : '22px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: isMobile ? 6 : 24,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {[
          { num: '500+', lbl: 'MAȘINI MODIFICATE' },
          { num: '15K',  lbl: 'SPECTATORI'        },
          { num: '48H',  lbl: 'NON-STOP'          },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'baseline',
            justifyContent: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 1 : 10,
            borderLeft: i > 0 && !isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: isMobile ? 22 : 30,
              color: '#fff', letterSpacing: '0.02em',
              lineHeight: 1,
            }}>{s.num}</span>
            <span className="mono" style={{
              fontSize: isMobile ? 8 : 9,
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.32em',
            }}>{s.lbl}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

window.HeroPremium = HeroPremium;
