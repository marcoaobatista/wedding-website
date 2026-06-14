import { useEffect, useRef, useState } from 'react'
import './App.css'
import bowRaw from './assets/bow.svg?raw'
import armsRaw from './assets/arms.svg?raw'
import monogramRaw from './assets/cm-monogram.svg?raw'
import logoRaw from './assets/cm-logo.svg?raw'

// Prefix for files served from public/ so they resolve under the
// deployed base path (e.g. /wedding-website/). Ends with a slash.
const BASE = import.meta.env.BASE_URL

const carouselPhotos = [
  '078EBCB0-44D1-4103-8BBC-D2C020C9BE20_1_105_c.jpeg',
  '0C5E5608-FEFD-4844-BFC2-38C027E2BDB3_1_105_c.jpeg',
  '0F33F369-A1B3-4191-B6F1-FFA4E4A338A1_1_105_c.jpeg',
  '252F4261-1C35-4B9F-A265-E18E25A50474_1_105_c.jpeg',
  '3EE178B4-8D40-4139-8A6B-79BFB127A0A9_1_105_c.jpeg',
  '99F4DDD7-CE7C-4ED2-B83D-EC5EA87ABE44_1_105_c.jpeg',
  'AE0F9EB5-808F-4266-B6E2-6AEDCE14CB9D_1_105_c.jpeg',
  'CED71E1A-2454-4C87-964F-E017310F63E7_1_105_c.jpeg',
]

// Ceremony: Saturday, May 15th 2027, 3:00 PM, Midland MI (Eastern Time)
const WEDDING_DATE = new Date('2027-05-15T15:00:00-04:00')

// In-page navigation — each entry targets a section id below.
const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#details', label: 'Details' },
  { href: '#gifting', label: 'Gifting' },
  { href: '#countdown', label: 'Countdown' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#gallery', label: 'Gallery' },
]

/* Inlines an SVG so its paths can be stroke-drawn by CSS.
   Each path gets pathLength=1 (normalizes dash math) and a --i index
   used to stagger the draw. The draw starts when the scroll-reveal
   hook adds .is-revealed to the wrapper. */
function DrawnSvg({ raw, className, stagger, drawDelay, label }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.querySelectorAll('path').forEach((p, i) => {
      p.setAttribute('pathLength', '1')
      p.style.setProperty('--i', i)
    })
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      data-draw
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ '--stagger': stagger, '--draw-delay': drawDelay }}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  )
}

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal], [data-draw]'))
    let ticking = false

    const check = () => {
      ticking = false
      const vh = window.innerHeight
      els.forEach((el) => {
        if (el.classList.contains('is-revealed')) return
        const rect = el.getBoundingClientRect()
        if (rect.top < vh * 0.85 && rect.bottom > 0) {
          el.classList.add('is-revealed')
        }
      })
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(check)
      }
    }

    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target.getTime() - now)
  const totalMinutes = Math.floor(diff / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  return { days, hours, minutes }
}

/* Fixed header that sits transparent over the hero and turns into a
   frosted bar once the page scrolls. The hamburger opens a full-screen
   menu styled to match the invitation aesthetic. */
function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the menu is open: lock body scroll and allow Escape to close.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const headerClass = [
    'site-header',
    scrolled && 'is-scrolled',
    open && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={headerClass}>
        <a
          className="site-header-mark"
          href="#top"
          aria-label="Carys &amp; Marco Antônio — home"
          onClick={() => setOpen(false)}
        >
          <span
            className="site-header-logo"
            dangerouslySetInnerHTML={{ __html: logoRaw }}
          />
        </a>

        {/* inline links on wide screens; collapses to the hamburger below */}
        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </header>

      <nav
        id="site-menu"
        className={`site-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <img
          src={`${BASE}flower.svg`}
          alt=""
          className="site-menu-flower"
          aria-hidden="true"
        />
        <ul className="site-menu-list">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ '--menu-i': i }}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="site-menu-date">15 . 05 . 2027</p>
      </nav>
    </>
  )
}

function Rule({ flip = false }) {
  return (
    <div className="rule" aria-hidden="true">
      <span className="rule-line" />
      <img
        src={`${BASE}flower.svg`}
        alt=""
        className={`rule-flower${flip ? ' rule-flower--flip' : ''}`}
      />
      <span className="rule-line" />
    </div>
  )
}

export default function App() {
  const { days, hours, minutes } = useCountdown(WEDDING_DATE)
  useScrollReveal()

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <>
      <SiteHeader />
      <main>
      {/* Section 1 — Hero */}
      <section
        className="hero"
        id="top"
        style={{ backgroundImage: `url(${BASE}monet-painting.jpg)` }}
      >
        <div className="hero-inner">
          <p className="hero-script">the wedding of</p>
          <Rule flip />
          <h1 className="hero-name">
            <img
              src={`${BASE}candm.svg`}
              alt="Carys &amp; Marco Antônio"
              className="hero-name-svg"
            />
          </h1>
          <Rule />
          <p className="hero-date">15 MAY 2027 · MIDLAND, MICHIGAN</p>
        </div>
      </section>

      {/* Section 2 — Ceremony & Reception */}
      <section className="details" id="details">
        <div className="details-col" data-reveal="left">
          <p className="details-script">Ceremony</p>
          <h2 className="details-heading">TO BE WED</h2>
          <div className="details-body">
            <p>Saturday, May 15th 2027</p>
            <p>Time TBD</p>
            <p className="details-venue">Our Redeemer Church</p>
          </div>
        </div>
        <div className="details-divider" aria-hidden="true">
          <span className="details-divider-line" />
          <img src={`${BASE}flower.svg`} alt="" className="details-divider-flower" />
          <span className="details-divider-line" />
        </div>
        <div className="details-col" data-reveal="right">
          <p className="details-script">Reception</p>
          <h2 className="details-heading">TO BE FED</h2>
          <div className="details-body">
            <p>Cocktail Hour and Dinner</p>
            <p>Time TBD</p>
            <p className="details-venue">The H Hotel</p>
          </div>
        </div>
      </section>

      {/* Section 3 — Couple Photo */}
      <section
        className="couple"
        style={{ backgroundImage: `url(${BASE}hero.jpg)` }}
      >
        <DrawnSvg
          raw={monogramRaw}
          className="couple-monogram"
          stagger="400ms"
          label="C &amp; M monogram"
        />
      </section>

      {/* Section 4 — Gifting / Registry */}
      <section className="gifting" id="gifting">
        <DrawnSvg raw={bowRaw} className="gifting-bg" stagger="700ms" />
        <div className="gifting-inner" data-reveal>
          <h2 className="script-heading">Gifting</h2>
          <p className="overline">OUR WEDDING REGISTRY</p>
          <a className="ghost-button" href="#">GIVE</a>
        </div>
      </section>

      {/* Section 5 — Countdown */}
      <section className="countdown" id="countdown">
        <div className="countdown-inner">
          <div className="countdown-unit" data-reveal>
            <span className="countdown-number">{days}</span>
            <span className="countdown-label">DAYS</span>
          </div>
          <div className="countdown-unit" data-reveal style={{ '--reveal-delay': '0.2s' }}>
            <span className="countdown-number">{pad(hours)}</span>
            <span className="countdown-label">HOURS</span>
          </div>
          <div className="countdown-unit" data-reveal style={{ '--reveal-delay': '0.4s' }}>
            <span className="countdown-number">{pad(minutes)}</span>
            <span className="countdown-label">MINUTES</span>
          </div>
        </div>
        <p className="countdown-caption" data-reveal style={{ '--reveal-delay': '0.6s' }}>
          until we say I do
        </p>
      </section>

      {/* Section 6 — RSVP */}
      <section className="rsvp" id="rsvp">
        <DrawnSvg raw={armsRaw} className="rsvp-bg" stagger="4ms" />
        <div className="rsvp-inner" data-reveal>
          <h2 className="script-heading">Kindly Reply</h2>
          <p className="overline">BY JANUARY 12TH</p>
          <a className="ghost-button" href="#">RSVP</a>
        </div>
      </section>

      {/* Section 7 — Photo Gallery (edge-to-edge auto-scrolling carousel) */}
      <section className="gallery" id="gallery" data-reveal>
        <div className="gallery-track">
          {[...carouselPhotos, ...carouselPhotos].map((photo, i) => (
            <img
              key={`${photo}-${i}`}
              src={`${BASE}carossel/${photo}`}
              alt=""
              className="gallery-photo"
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <img src={`${BASE}flower.svg`} alt="" className="site-footer-flower" aria-hidden="true" />
        <p className="site-footer-script">with love,</p>
        <p className="site-footer-names">CARYS &amp; MARCO ANTÔNIO</p>
        <p className="site-footer-date">15 . 05 . 2027 · MIDLAND, MICHIGAN</p>
      </footer>
      </main>
    </>
  )
}
