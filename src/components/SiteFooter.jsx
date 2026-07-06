const BASE = import.meta.env.BASE_URL

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <img src={`${BASE}flower.svg`} alt="" className="site-footer-flower" aria-hidden="true" />
      <p className="site-footer-script">with love,</p>
      <p className="site-footer-names">CARYS &amp; MARCO ANTÔNIO</p>
      <p className="site-footer-date">15 . 05 . 2027 · MIDLAND, MICHIGAN</p>
    </footer>
  )
}
