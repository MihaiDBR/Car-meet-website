// Mosaic Gallery — 9 photos, asymmetric grid, scroll-zoom-in, "pickup" lightbox
//
// Behavior:
//   - On scroll-into-view: each card fades in + scales from 0.85 → 1 with stagger
//   - Click a card: photo "pickups" — flies from its grid position to a centered
//     fullscreen lightbox while leaving a glowing placeholder slot in the grid
//   - Inside lightbox: ←/→ keys + swipe to navigate, ESC/click-outside to dismiss
//   - When closing or navigating: photo flies BACK to its slot, slot un-glows
//
// Placeholders use procedural gradient + overlay text so the user sees a real
// editorial-looking layout immediately. Replace `IMAGES[i].src` with real URLs
// to swap them in.

const { useState: gS, useEffect: gE, useRef: gR, useMemo: gM, useCallback: gC } = React;

// GALLERY_ITEMS → src/constants.js

// Asymmetric mosaic — each item gets a span class. CSS grid handles the rest.
// Tall = row-span 2, Wide = col-span 2. On mobile collapses to 2 cols normal.

function GalleryCard({ item, idx, onOpen, isOpen, registerRef }) {
  const cardRef = gR(null);
  const [visible, setVisible] = gS(false);
  const [hover, setHover] = gS(false);

  gE(() => {
    const el = cardRef.current;
    if (!el) return;
    registerRef(idx, el);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [idx, registerRef]);

  const spanClass = [
    'gallery-card',
    item.span === 'tall' ? 'gallery-card-tall' : '',
    item.span === 'wide' ? 'gallery-card-wide' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={spanClass}
      onClick={() => onOpen(idx)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid var(--border)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.88)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${idx * 70}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${idx * 70}ms`,
      }}
    >
      {/* SLOT — visible while photo is "lifted" into the lightbox */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0a0a10',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.35s ease',
        zIndex: 1,
      }}>
        {/* Inner glow rim — signals "from here a photo was lifted" */}
        <div style={{
          position: 'absolute', inset: 8,
          border: `1px dashed hsla(${item.hue}, 80%, 60%, 0.5)`,
          borderRadius: 2,
          boxShadow: `inset 0 0 40px hsla(${item.hue}, 80%, 50%, 0.15), 0 0 30px hsla(${item.hue}, 80%, 50%, 0.1)`,
        }}/>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: `hsl(${item.hue}, 70%, 65%)`, letterSpacing: '0.3em',
          textShadow: `0 0 12px hsla(${item.hue}, 80%, 50%, 0.6)`,
        }}>[ LIFTED ]</div>
      </div>

      {/* PHOTO — hidden when isOpen (it's now in the lightbox layer) */}
      <PhotoContent
        item={item}
        hover={hover}
        style={{
          opacity: isOpen ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
}

// The actual photo / placeholder content
function PhotoContent({ item, hover = false, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: item.src
        ? `url(${item.src}) center/cover no-repeat`
        : `linear-gradient(135deg, hsl(${item.hue}, 50%, 18%) 0%, hsl(${item.hue}, 65%, 35%) 50%, hsl(${item.hue}, 40%, 12%) 100%)`,
      ...style,
    }}>
      {/* Diagonal lines texture for placeholders only */}
      {!item.src && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, transparent 0, transparent 12px, rgba(0,0,0,0.18) 12px, rgba(0,0,0,0.18) 13px)`,
          mixBlendMode: 'multiply',
        }}/>
      )}
      {/* Bottom gradient for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)',
        opacity: hover ? 1 : 0.7,
        transition: 'opacity 0.3s ease',
      }}/>
      {/* Label */}
      <div style={{
        position: 'absolute', left: 18, bottom: 16,
        display: 'flex', alignItems: 'baseline', gap: 12,
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3em',
        }}>{String(item.id).padStart(2, '0')}</span>
        <span className="display" style={{
          fontSize: 22, color: '#fff', letterSpacing: '0.06em',
          textShadow: '0 2px 12px rgba(0,0,0,0.7)',
        }}>{item.label}</span>
      </div>
      {/* Hover overlay icon */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        width: 32, height: 32,
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        opacity: hover ? 1 : 0.7,
        transition: 'all 0.3s ease',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3h3M3 3v3M11 11H8M11 11V8M3 11h3M3 11V8M11 3H8M11 3v3" stroke="white" strokeWidth="1.2"/>
        </svg>
      </div>
    </div>
  );
}

// Lightbox — performs the FLIP "pickup" animation from card slot to centered view
function Lightbox({ openIdx, originRect, onClose, onNavigate }) {
  const [phase, gPhase] = gS('opening'); // opening → open → closing
  const [navDir, setNavDir] = gS(0); // -1 prev, +1 next, 0 idle
  const overlayRef = gR(null);

  // Animation phase machine
  gE(() => {
    if (openIdx == null) return;
    gPhase('opening');
    const t = setTimeout(() => gPhase('open'), 30); // next frame → trigger transition
    return () => clearTimeout(t);
  }, [openIdx]);

  // Keyboard handlers
  gE(() => {
    if (openIdx == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNav(+1);
      if (e.key === 'ArrowLeft') handleNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx]);

  // Touch/swipe
  gE(() => {
    if (openIdx == null) return;
    let startX = 0; let startY = 0; let active = false;
    const onStart = (e) => {
      const t = e.touches[0]; startX = t.clientX; startY = t.clientY; active = true;
    };
    const onEnd = (e) => {
      if (!active) return; active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX; const dy = t.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        handleNav(dx < 0 ? +1 : -1);
      } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
        handleClose();
      }
    };
    const el = overlayRef.current;
    if (!el) return;
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [openIdx]);

  function handleClose() {
    gPhase('closing');
    setTimeout(() => onClose(), 460);
  }
  function handleNav(dir) {
    setNavDir(dir);
    gPhase('closing');
    setTimeout(() => {
      onNavigate(dir);
      setNavDir(0);
    }, 380);
  }

  if (openIdx == null) return null;
  const item = GALLERY_ITEMS[openIdx];

  // Compute transform: in opening/closing we sit at originRect; in 'open' we
  // sit at a centered target rect.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 768;
  const targetW = Math.min(vw - (isMobile ? 32 : 80), 1100);
  const targetH = Math.min(vh - (isMobile ? 120 : 140), targetW * 0.66);
  const targetX = (vw - targetW) / 2;
  const targetY = (vh - targetH) / 2;

  const at = phase === 'open';
  const x = at ? targetX : originRect.left;
  const y = at ? targetY : originRect.top;
  const w = at ? targetW : originRect.width;
  const h = at ? targetH : originRect.height;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: phase === 'open'
          ? 'rgba(6,6,10,0.85)'
          : 'rgba(6,6,10,0)',
        backdropFilter: phase === 'open' ? 'blur(20px) saturate(1.2)' : 'blur(0)',
        WebkitBackdropFilter: phase === 'open' ? 'blur(20px) saturate(1.2)' : 'blur(0)',
        transition: 'background 0.45s ease, backdrop-filter 0.45s ease',
        cursor: 'zoom-out',
      }}
    >
      {/* Photo — animates from origin rect → centered */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: x, top: y, width: w, height: h,
          // Slight rotate during transit makes it feel "picked up"
          transform: phase === 'opening' || phase === 'closing'
            ? (navDir !== 0 ? `rotate(${navDir * 1.2}deg) translateY(${navDir !== 0 ? 0 : 0}px)` : 'rotate(0deg)')
            : 'rotate(0deg)',
          boxShadow: phase === 'open'
            ? '0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 8px 30px rgba(0,0,0,0.4)',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'left 0.55s cubic-bezier(0.22,1,0.36,1), top 0.55s cubic-bezier(0.22,1,0.36,1), width 0.55s cubic-bezier(0.22,1,0.36,1), height 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, transform 0.4s ease',
          willChange: 'left, top, width, height, transform',
          cursor: 'default',
        }}
      >
        <PhotoContent item={item} hover={false}/>
      </div>

      {/* Counter + close hint — only visible at full-open */}
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: phase === 'open' ? 1 : 0,
        transition: 'opacity 0.35s ease 0.15s',
        pointerEvents: phase === 'open' ? 'auto' : 'none',
      }}>
        <span className="mono" style={{
          fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.35em',
        }}>
          {String(openIdx + 1).padStart(2, '0')}
          <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.3)' }}>/</span>
          {String(GALLERY_ITEMS.length).padStart(2, '0')}
        </span>
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', width: 38, height: 38, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            touchAction: 'manipulation',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="white" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>

      {/* Prev/Next arrows */}
      {['prev', 'next'].map((dir) => (
        <button
          key={dir}
          onClick={() => handleNav(dir === 'next' ? +1 : -1)}
          aria-label={dir}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [dir === 'next' ? 'right' : 'left']: 18,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', width: 48, height: 48, borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            opacity: phase === 'open' ? 1 : 0,
            transition: 'opacity 0.35s ease 0.2s, background 0.2s ease',
            pointerEvents: phase === 'open' ? 'auto' : 'none',
            touchAction: 'manipulation',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
            transform: dir === 'next' ? 'rotate(0deg)' : 'rotate(180deg)',
          }}>
            <path d="M5 2l6 6-6 6" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      ))}

      {/* Hint at bottom */}
      <div style={{
        position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center',
        opacity: phase === 'open' ? 0.5 : 0,
        transition: 'opacity 0.35s ease 0.25s',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: '#fff', letterSpacing: '0.35em',
      }}>← SWIPE / ARROWS / ESC →</div>
    </div>
  );
}

// Main gallery section
function MosaicGallery() {
  const [openIdx, setOpenIdx] = gS(null);
  const [originRect, setOriginRect] = gS({ left: 0, top: 0, width: 0, height: 0 });
  const cardRefsRef = gR({}); // idx -> DOM node

  const registerRef = gC((idx, node) => {
    cardRefsRef.current[idx] = node;
  }, []);

  const openAt = gC((idx) => {
    const el = cardRefsRef.current[idx];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOriginRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    setOpenIdx(idx);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = gC(() => {
    setOpenIdx(null);
    document.body.style.overflow = '';
  }, []);

  const navigate = gC((dir) => {
    setOpenIdx((cur) => {
      if (cur == null) return cur;
      const next = (cur + dir + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
      // Update origin rect to the new card's position
      const el = cardRefsRef.current[next];
      if (el) {
        const r = el.getBoundingClientRect();
        setOriginRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      }
      return next;
    });
  }, []);

  return (
    <section style={{ padding: 'clamp(60px, 9vw, 120px) 20px', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ marginBottom: 'clamp(36px, 6vw, 72px)' }}>
          <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.3em' }}>[ 07 — GALERIE ]</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)', minWidth: 40 }}/>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>EDIȚII ANTERIOARE</span>
          </div>
          <h2 className="display" style={{
            fontSize: 'clamp(44px, 9vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.01em',
            margin: 0, maxWidth: 1100,
          }}>
            <span style={{ display: 'inline-block', overflow: 'hidden' }}>
              <SplitText split="words">MOMENTE.</SplitText>
            </span>{' '}
            <span style={{ display: 'inline-block', overflow: 'hidden', color: 'var(--accent)' }}>
              <SplitText split="words" delay={140}>SUNET. FUM.</SplitText>
            </span>
          </h2>
          <p style={{
            marginTop: 22, maxWidth: 580, fontSize: 14, lineHeight: 1.7,
            color: 'var(--text-secondary)', fontWeight: 300,
          }}>
            Click pe orice cadru pentru a-l ridica de pe masă. Folosește săgețile, swipe sau ESC.
          </p>
        </div>

        {/* Mosaic grid */}
        <div className="gallery-grid" style={{
          display: 'grid',
          gap: 14,
        }}>
          {GALLERY_ITEMS.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              idx={i}
              onOpen={openAt}
              isOpen={openIdx === i}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>

      <Lightbox
        openIdx={openIdx}
        originRect={originRect}
        onClose={close}
        onNavigate={navigate}
      />

    </section>
  );
}

// Export to window so other Babel scripts can pick it up
window.MosaicGallery = MosaicGallery;
