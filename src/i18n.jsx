import { createContext, useContext, useEffect, useState } from 'react'

/* Tiny two-language (en / pt-BR) setup shared by all pages.
   The choice is kept in localStorage so it follows guests across
   the homepage, FAQ, and save-the-date pages. */

const STORAGE_KEY = 'lang'

const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

function initialLang() {
  // a ?lang= in a shared link wins over everything
  // (e.g. carysandmarco.com/?lang=pt or /save-the-date/?lang=en)
  const param = new URLSearchParams(window.location.search).get('lang')?.toLowerCase()
  if (param) {
    if (param.startsWith('pt') || param === 'br') return 'pt'
    if (param.startsWith('en')) return 'en'
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'pt') return saved
  } catch {
    /* storage unavailable (private mode etc.) — fall through */
  }
  // first visit: follow the browser language
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* non-fatal */
    }
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

export function LangToggle({ className }) {
  const { lang, setLang } = useLang()

  return (
    <button
      type="button"
      className={`lang-toggle${className ? ` ${className}` : ''}`}
      onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
      aria-label={lang === 'en' ? 'Mudar para português' : 'Switch to English'}
    >
      <span className={lang === 'en' ? 'is-active' : ''}>EN</span>
      <span aria-hidden="true">·</span>
      <span className={lang === 'pt' ? 'is-active' : ''}>PT</span>
    </button>
  )
}
