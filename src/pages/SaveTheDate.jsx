import './SaveTheDate.css'
import logoRaw from '../assets/cm-logo.svg?raw'

const BASE = import.meta.env.BASE_URL

export default function SaveTheDate() {
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
      </header>

      <main className="std-main">
        <section className="std-hero">
          <img
            src={`${BASE}save-the-date.png`}
            alt="Save the date — Carys &amp; Marco, 15 May 2027"
            className="std-image"
          />
          <p className="std-note">formal invitation to follow</p>
          <a className="std-faq-link" href="/faq/">
            Questions? Read our FAQs
          </a>
        </section>
      </main>
    </>
  )
}
