import { useLang } from '../i18n.jsx'

const BASE = import.meta.env.BASE_URL

const SCRIPT = { en: 'with love,', pt: 'com amor,' }

// numeric date: month-first in English, day-first in Portuguese
const DATE = {
  en: '05 . 15 . 2027 · MIDLAND, MICHIGAN',
  pt: '15 . 05 . 2027 · MIDLAND, MICHIGAN',
}

const CREDIT = { en: 'photos by', pt: 'fotos por' }

export default function SiteFooter() {
  const { lang } = useLang()

  return (
    <footer className="site-footer">
      <img src={`${BASE}flower.svg`} alt="" className="site-footer-flower" aria-hidden="true" />
      <p className="site-footer-script">{SCRIPT[lang]}</p>
      <p className="site-footer-names">CARYS &amp; MARCO ANTÔNIO</p>
      <p className="site-footer-date">{DATE[lang]}</p>
      <p className="site-footer-credit">
        {CREDIT[lang]}{' '}
        <a
          href="https://www.instagram.com/addisonraynephoto/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Addison Rayne Photography
        </a>
      </p>
    </footer>
  )
}
