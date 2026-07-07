import { useEffect, useRef, useState } from 'react'
import './App.css'
import bowRaw from './assets/bow.svg?raw'
import armsRaw from './assets/arms.svg?raw'
import monogramRaw from './assets/cm-monogram.svg?raw'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { LanguageProvider, useLang } from './i18n.jsx'

// Prefix for files served from public/ so they resolve against the
// deployed base path. '/' on the custom domain; set by vite base.
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
const NAV_LINKS = {
  en: [
    { href: '#top', label: 'Home' },
    { href: '#details', label: 'Details' },
    { href: '#gifting', label: 'Gifting' },
    { href: '#countdown', label: 'Countdown' },
    { href: '#rsvp', label: 'RSVP' },
    { href: '#gallery', label: 'Gallery' },
    { href: '/faq/', label: 'FAQs' },
  ],
  pt: [
    { href: '#top', label: 'Início' },
    { href: '#details', label: 'Detalhes' },
    { href: '#gifting', label: 'Presentes' },
    { href: '#countdown', label: 'Contagem' },
    { href: '#rsvp', label: 'RSVP' },
    { href: '#gallery', label: 'Galeria' },
    { href: '/faq/', label: 'Dúvidas' },
  ],
}

// All translatable copy on this page.
const T = {
  en: {
    heroScript: 'the wedding of',
    heroDate: 'MAY 15, 2027 · MIDLAND, MICHIGAN',
    ceremonyScript: 'Ceremony',
    ceremonyHeading: 'TO BE WED',
    ceremonyDate: 'Saturday, May 15th 2027',
    timeTbd: 'Time TBD',
    receptionScript: 'Reception',
    receptionHeading: 'TO BE FED',
    receptionBody: 'Cocktail Hour and Dinner',
    giftingScript: 'Gifting',
    giftingOverline: 'OUR WEDDING REGISTRY',
    comingSoon: 'Coming Soon',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    countdownCaption: 'until we say I do',
    rsvpScript: 'Kindly Reply',
    rsvpButton: 'RSVP',
  },
  pt: {
    heroScript: 'o casamento de',
    heroDate: '15 DE MAIO DE 2027 · MIDLAND, MICHIGAN',
    ceremonyScript: 'Cerimônia',
    ceremonyHeading: 'PARA CASAR',
    ceremonyDate: 'Sábado, 15 de maio de 2027',
    timeTbd: 'Horário a definir',
    receptionScript: 'Recepção',
    receptionHeading: 'PARA FESTEJAR',
    receptionBody: 'Coquetel e Jantar',
    giftingScript: 'Presentes',
    giftingOverline: 'NOSSA LISTA DE PRESENTES',
    comingSoon: 'Em breve',
    days: 'DIAS',
    hours: 'HORAS',
    minutes: 'MINUTOS',
    countdownCaption: 'até dizermos sim',
    rsvpScript: 'Confirme sua presença',
    rsvpButton: 'RSVP',
  },
}

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

/* Edge-to-edge photo strip: a real scroll container (wheel, trackpad,
   touch, or mouse-drag all work) that also drifts on its own until it
   reaches the last photo. No looping. */
function Gallery() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // timestamp until which auto-drift is paused; Infinity while hovered/dragged
    let pausedUntil = reduceMotion ? Infinity : 0
    let hovering = false
    let dragging = false
    let dragStartX = 0
    let dragStartScroll = 0
    let pos = el.scrollLeft
    let last = performance.now()
    let raf

    const step = (now) => {
      const dt = Math.min(now - last, 100)
      last = now
      const maxScroll = el.scrollWidth - el.clientWidth

      // a scroll we didn't cause (keyboard, momentum, scrollbar…):
      // adopt the new position and hold the drift for a moment
      if (Math.abs(el.scrollLeft - pos) > 1) {
        pos = el.scrollLeft
        pausedUntil = Math.max(pausedUntil, now + 3000)
      }

      if (now > pausedUntil && !hovering && !dragging && pos < maxScroll) {
        pos = Math.min(pos + dt * 0.025, maxScroll) // ~25px per second
        el.scrollLeft = pos
      } else {
        pos = el.scrollLeft
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const pause = () => {
      pausedUntil = Math.max(pausedUntil, performance.now() + 3000)
    }

    const onPointerEnter = (e) => {
      if (e.pointerType === 'mouse') hovering = true
    }
    const onPointerLeave = () => {
      hovering = false
      pause()
    }
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse') return pause()
      dragging = true
      dragStartX = e.clientX
      dragStartScroll = el.scrollLeft
      el.classList.add('is-dragging')
      el.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
      if (!dragging) return
      el.scrollLeft = dragStartScroll - (e.clientX - dragStartX)
    }
    const onPointerUp = () => {
      dragging = false
      el.classList.remove('is-dragging')
      pause()
    }

    el.addEventListener('wheel', pause, { passive: true })
    el.addEventListener('touchend', pause, { passive: true })
    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', pause)
      el.removeEventListener('touchend', pause)
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  return (
    <section className="gallery" id="gallery" data-reveal ref={ref}>
      <div className="gallery-track">
        {carouselPhotos.map((photo) => (
          <img
            key={photo}
            src={`${BASE}carossel/${photo}`}
            alt=""
            className="gallery-photo"
            draggable={false}
          />
        ))}
      </div>
    </section>
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

function AppContent() {
  const { days, hours, minutes } = useCountdown(WEDDING_DATE)
  const { lang } = useLang()
  const t = T[lang]
  useScrollReveal()

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <>
      <SiteHeader links={NAV_LINKS[lang]} />
      <main>
      {/* Section 1 — Hero */}
      <section
        className="hero"
        id="top"
        style={{ backgroundImage: `url(${BASE}monet-painting.jpg)` }}
      >
        <div className="hero-inner">
          <p className="hero-script">{t.heroScript}</p>
          <Rule flip />
          <h1 className="hero-name">
            <img
              src={`${BASE}candm.svg`}
              alt="Carys &amp; Marco Antônio"
              className="hero-name-svg"
            />
          </h1>
          <Rule />
          <p className="hero-date">{t.heroDate}</p>
        </div>
      </section>

      {/* Section 2 — Ceremony & Reception */}
      <section className="details" id="details">
        <div className="details-col" data-reveal="left">
          <p className="details-script">{t.ceremonyScript}</p>
          <h2 className="details-heading">{t.ceremonyHeading}</h2>
          <div className="details-body">
            <p>{t.ceremonyDate}</p>
            <p>{t.timeTbd}</p>
            <p className="details-venue">Our Redeemer Church</p>
          </div>
        </div>
        <div className="details-divider" aria-hidden="true">
          <span className="details-divider-line" />
          <img src={`${BASE}flower.svg`} alt="" className="details-divider-flower" />
          <span className="details-divider-line" />
        </div>
        <div className="details-col" data-reveal="right">
          <p className="details-script">{t.receptionScript}</p>
          <h2 className="details-heading">{t.receptionHeading}</h2>
          <div className="details-body">
            <p>{t.receptionBody}</p>
            <p>{t.timeTbd}</p>
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
          <h2 className="script-heading">{t.giftingScript}</h2>
          <p className="overline">{t.giftingOverline}</p>
          <a className="ghost-button" href="#">{t.comingSoon}</a>
        </div>
      </section>

      {/* Section 5 — Countdown */}
      <section className="countdown" id="countdown">
        <div className="countdown-inner">
          <div className="countdown-unit" data-reveal>
            <span className="countdown-number">{days}</span>
            <span className="countdown-label">{t.days}</span>
          </div>
          <div className="countdown-unit" data-reveal style={{ '--reveal-delay': '0.2s' }}>
            <span className="countdown-number">{pad(hours)}</span>
            <span className="countdown-label">{t.hours}</span>
          </div>
          <div className="countdown-unit" data-reveal style={{ '--reveal-delay': '0.4s' }}>
            <span className="countdown-number">{pad(minutes)}</span>
            <span className="countdown-label">{t.minutes}</span>
          </div>
        </div>
        <p className="countdown-caption" data-reveal style={{ '--reveal-delay': '0.6s' }}>
          {t.countdownCaption}
        </p>
      </section>

      {/* Section 6 — RSVP */}
      <section className="rsvp" id="rsvp">
        <DrawnSvg raw={armsRaw} className="rsvp-bg" stagger="4ms" />
        <div className="rsvp-inner" data-reveal>
          <h2 className="script-heading">{t.rsvpScript}</h2>
          <p className="overline">{t.comingSoon}</p>
          <a className="ghost-button" href="#">{t.rsvpButton}</a>
        </div>
      </section>

      {/* Section 7 — Photo Gallery (scrollable, auto-drifting carousel) */}
      <Gallery />

      {/* Footer */}
      <SiteFooter />
      </main>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
