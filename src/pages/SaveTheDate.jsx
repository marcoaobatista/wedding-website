import './SaveTheDate.css'
import logoRaw from '../assets/cm-logo.svg?raw'
import { LanguageProvider, LangToggle, useLang } from '../i18n.jsx'

const BASE = import.meta.env.BASE_URL

const T = {
  en: {
    image: 'save-the-date.png',
    alt: 'Save the date — Carys & Marco, May 15, 2027',
    note: 'formal invitation to follow',
    noteSub: "can't make it? please let us know",
    faqLink: 'Questions? Read our FAQs',
  },
  pt: {
    image: 'save-the-date-br.png',
    alt: 'Reserve a data — Carys & Marco, 15 de maio de 2027',
    note: 'convite formal em breve',
    noteSub: 'não poderá comparecer? nos avise',
    faqLink: 'Dúvidas? Veja nosso FAQ',
  },
}

function SaveTheDateContent() {
  const { lang } = useLang()
  const t = T[lang]

  return (
    <>
      <header className="std-header">
        <a
          className="std-header-mark"
          href="/"
          aria-label="Carys &amp; Marco Antônio — home"
        >
          <span dangerouslySetInnerHTML={{ __html: logoRaw }} />
        </a>
        <LangToggle className="std-lang" />
      </header>

      <main className="std-main">
        <section className="std-hero">
          <img
            src={`${BASE}${t.image}`}
            alt={t.alt}
            className="std-image"
          />
          <div className="std-notes">
            <p className="std-note">{t.note}</p>
            <p className="std-note std-note--sub">{t.noteSub}</p>
          </div>
          <a className="std-faq-link" href="/faq/">
            {t.faqLink}
          </a>
        </section>
      </main>
    </>
  )
}

export default function SaveTheDate() {
  return (
    <LanguageProvider>
      <SaveTheDateContent />
    </LanguageProvider>
  )
}
