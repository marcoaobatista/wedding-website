import { useState } from 'react'
import '../App.css'
import './Faq.css'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

// Same nav as the homepage, with hrefs resolving back to it.
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#details', label: 'Details' },
  { href: '/#gifting', label: 'Gifting' },
  { href: '/#countdown', label: 'Countdown' },
  { href: '/#rsvp', label: 'RSVP' },
  { href: '/faq/', label: 'FAQs' },
]

// Questions without an answer yet are commented out below —
// uncomment each one as its answer is ready.
const FAQ_SECTIONS = [
  {
    category: 'RSVP & Attendance',
    items: [
      // { q: 'When is the RSVP deadline?', a: '' },
      // { q: 'How do I RSVP?', a: '' },
      {
        q: 'Can I bring a plus one?',
        a: 'Due to capacity constraints, we are only able to accommodate those formally invited. If you received a plus one, it will be addressed on your invitation and the RSVP section of the website.',
      },
      // { q: 'Are children invited?', a: '' },
      // { q: 'What should I do if my plans change?', a: '' },
    ],
  },
  {
    category: 'Venue & Logistics',
    items: [
      {
        q: 'What is the address of the ceremony and reception?',
        a: 'The ceremony will be held at Our Redeemer Evangelical Free Church in Midland, MI (889 Poseyville Dr., Midland, MI 48642). The reception will be held at The H Hotel in Midland, MI (111 W Main St., Midland, MI 48640).',
      },
      {
        q: 'Is the ceremony indoors or outdoors?',
        a: 'The ceremony will be indoors, but Michigan can still be cold in May, so make sure to bring a jacket or shawl for when you are outside.',
      },
      {
        q: 'Is there parking available?',
        a: 'There is parking available at both the ceremony and reception locations. The church parking lot is smaller, so meeting at the hotel and organizing carpools to the ceremony would be best!',
      },
      {
        q: 'Is the venue wheelchair / rollator accessible?',
        a: 'Both locations are accessible for those with physical disabilities.',
      },
    ],
  },
  {
    category: 'Dress Code',
    items: [
      {
        q: 'What is the dress code?',
        a: "We invite guests to embrace the romance of the occasion with formal attire. For women, midi or floor-length dresses are encouraged — we would love to see you bring on the color with spring and summer hues. For men, a suit and tie are requested. If you're unsure, it's always better to be overdressed than underdressed!",
      },
    ],
  },
  {
    category: 'Travel & Accommodations',
    items: [
      {
        q: 'What airport should I fly into?',
        a: 'For the most convenient option, MBS Airport is a little over a 15-minute drive from Midland; however, flights are less frequent and more expensive. DTW Airport in Detroit is another good option — it is more of a drive, around 2 hours to Midland, but offers more flight flexibility. FNT Airport in Flint may offer lower prices than MBS and DTW depending on your location, and it is an hour drive from Midland.',
      },
      {
        q: 'Where should I stay?',
        a: 'There are many good hotels around Midland that you can stay at, including the reception site, the H Hotel!',
      },
      {
        q: 'Do you have hotel blocks or discount codes?',
        a: 'Yes! We’ve reserved rooms at the reception site, the H Hotel. You can book with our special rate using the link we’ll share here. If there are no rooms left on the site, please get in contact with the bride or groom, as we have the ability to add additional rooms to our block contingent upon availability.',
      },
      {
        q: "What's the best way to get around?",
        a: 'A car is recommended. The ceremony and reception venues are a short drive apart.',
      },
    ],
  },
  // — Categories below have no answered questions yet; uncomment as ready —
  // {
  //   category: 'Schedule & Activities',
  //   items: [
  //     { q: 'What time should I arrive for the ceremony?', a: '' },
  //     { q: 'What is the timeline for the day?', a: '' },
  //     { q: 'When should I expect the day to end?', a: '' },
  //     { q: 'Are there any pre- or post-wedding events guests are invited to?', a: '' },
  //   ],
  // },
  // {
  //   category: 'Social Media Etiquette',
  //   items: [
  //     { q: 'Can I take photos during the ceremony?', a: '' },
  //     { q: 'Should I post on social media?', a: '' },
  //   ],
  // },
  // {
  //   category: 'Gifts & Registry',
  //   items: [
  //     { q: 'Where are you registered?', a: '' },
  //     { q: 'Can I bring the gift to the wedding?', a: '' },
  //     { q: 'Is it okay to send a gift later?', a: '' },
  //   ],
  // },
  // {
  //   category: 'Other Questions',
  //   items: [
  //     { q: 'What kind of food will there be?', a: '' },
  //     { q: 'What if I have dietary restrictions?', a: '' },
  //     { q: 'Who can I contact with other questions?', a: '' },
  //     { q: 'What is the weather like this time of year?', a: '' },
  //   ],
  // },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-icon" aria-hidden="true" />
      </button>
      <div className="faq-answer">
        <div className="faq-answer-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <>
      <SiteHeader links={NAV_LINKS} homeHref="/" solid />

      <main className="faq-main">
        {/* Intro styled after the homepage section headings */}
        <section className="faq-hero">
          <h1 className="faq-heading">Questions &amp; Answers</h1>
          <p className="faq-overline">EVERYTHING YOU NEED TO KNOW</p>
        </section>

        <section className="faq" id="faq">
          {FAQ_SECTIONS.map((section) => (
            <div className="faq-group" key={section.category}>
              <h2 className="faq-category">{section.category}</h2>
              <div className="faq-list">
                {section.items.map((item) => (
                  <FaqItem key={item.q} {...item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
