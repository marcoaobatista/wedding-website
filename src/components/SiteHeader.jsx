import { useEffect, useState } from 'react'
import logoRaw from '../assets/cm-logo.svg?raw'

// Prefix for files served from public/ so they resolve against the
// deployed base path. '/' on the custom domain; set by vite base.
const BASE = import.meta.env.BASE_URL

/* Fixed header that sits transparent over the hero and turns into a
   frosted bar once the page scrolls. The hamburger opens a full-screen
   menu styled to match the invitation aesthetic.

   `solid` keeps the frosted style from the start — for pages without
   a dark hero behind the header (e.g. the FAQ page). */
export default function SiteHeader({ links, homeHref = '#top', solid = false }) {
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
    (scrolled || solid) && 'is-scrolled',
    open && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={headerClass}>
        <a
          className="site-header-mark"
          href={homeHref}
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
          {links.map((link) => (
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
          {links.map((link, i) => (
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
