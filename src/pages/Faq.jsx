import { useState } from 'react'
import '../App.css'
import './Faq.css'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { LanguageProvider, useLang } from '../i18n.jsx'

// Same nav as the homepage, with hrefs resolving back to it.
const NAV_LINKS = {
  en: [
    { href: '/', label: 'Home' },
    { href: '/#details', label: 'Details' },
    { href: '/#gifting', label: 'Gifting' },
    { href: '/#countdown', label: 'Countdown' },
    { href: '/#rsvp', label: 'RSVP' },
    { href: '/faq/', label: 'FAQs' },
  ],
  pt: [
    { href: '/', label: 'Início' },
    { href: '/#details', label: 'Detalhes' },
    { href: '/#gifting', label: 'Presentes' },
    { href: '/#countdown', label: 'Contagem' },
    { href: '/#rsvp', label: 'RSVP' },
    { href: '/faq/', label: 'Dúvidas' },
  ],
}

const T = {
  en: { heading: 'Questions & Answers', overline: 'EVERYTHING YOU NEED TO KNOW' },
  pt: { heading: 'Perguntas e Respostas', overline: 'TUDO O QUE VOCÊ PRECISA SABER' },
}

// Questions without an answer yet are commented out below —
// uncomment each one as its answer is ready (fill in both languages).
const FAQ_SECTIONS = [
  {
    category: { en: 'RSVP & Attendance', pt: 'RSVP e Presença' },
    items: [
      // {
      //   q: { en: 'When is the RSVP deadline?', pt: 'Qual é o prazo para confirmar presença?' },
      //   a: { en: '', pt: '' },
      // },
      // {
      //   q: { en: 'How do I RSVP?', pt: 'Como confirmo minha presença?' },
      //   a: { en: '', pt: '' },
      // },
      {
        q: { en: 'Can I bring a plus one?', pt: 'Posso levar um acompanhante?' },
        a: {
          en: 'Due to capacity constraints, we are only able to accommodate those formally invited. If you received a plus one, it will be addressed on your invitation and the RSVP section of the website.',
          pt: 'Devido à capacidade limitada, só poderemos receber quem foi formalmente convidado. Se você tem direito a um acompanhante, isso estará indicado no seu convite e na seção de RSVP do site.',
        },
      },
      // {
      //   q: { en: 'Are children invited?', pt: 'Crianças estão convidadas?' },
      //   a: { en: '', pt: '' },
      // },
      // {
      //   q: { en: 'What should I do if my plans change?', pt: 'O que devo fazer se meus planos mudarem?' },
      //   a: { en: '', pt: '' },
      // },
    ],
  },
  {
    category: { en: 'Venue & Logistics', pt: 'Local e Logística' },
    items: [
      {
        q: {
          en: 'What is the address of the ceremony and reception?',
          pt: 'Qual é o endereço da cerimônia e da recepção?',
        },
        a: {
          en: 'The ceremony will be held at Our Redeemer Evangelical Free Church in Midland, MI (889 Poseyville Dr., Midland, MI 48642). The reception will be held at The H Hotel in Midland, MI (111 W Main St., Midland, MI 48640).',
          pt: 'A cerimônia será realizada na Our Redeemer Evangelical Free Church, em Midland, MI (889 Poseyville Dr., Midland, MI 48642). A recepção será no The H Hotel, em Midland, MI (111 W Main St., Midland, MI 48640).',
        },
      },
      {
        q: {
          en: 'Is the ceremony indoors or outdoors?',
          pt: 'A cerimônia será em ambiente fechado ou ao ar livre?',
        },
        a: {
          en: 'The ceremony will be indoors, but Michigan can still be cold in May, so make sure to bring a jacket or shawl for when you are outside.',
          pt: 'A cerimônia será em ambiente fechado, mas o Michigan ainda pode ser frio em maio, então leve um casaco ou xale para os momentos ao ar livre.',
        },
      },
      {
        q: { en: 'Is there parking available?', pt: 'Há estacionamento disponível?' },
        a: {
          en: 'There is parking available at both the ceremony and reception locations. The church parking lot is smaller, so meeting at the hotel and organizing carpools to the ceremony would be best!',
          pt: 'Há estacionamento nos dois locais. O estacionamento da igreja é menor, então o ideal é se encontrar no hotel e organizar caronas até a cerimônia!',
        },
      },
      {
        q: {
          en: 'Is the venue wheelchair / rollator accessible?',
          pt: 'Os locais são acessíveis para cadeira de rodas / andador?',
        },
        a: {
          en: 'Both locations are accessible for those with physical disabilities.',
          pt: 'Os dois locais são acessíveis para pessoas com deficiência física.',
        },
      },
    ],
  },
  {
    category: { en: 'Dress Code', pt: 'Traje' },
    items: [
      {
        q: { en: 'What is the dress code?', pt: 'Qual é o traje?' },
        a: {
          en: "We invite guests to embrace the romance of the occasion with formal attire. For women, midi or floor-length dresses are encouraged — we would love to see you bring on the color with spring and summer hues. For men, a suit and tie are requested. If you're unsure, it's always better to be overdressed than underdressed!",
          pt: 'Convidamos todos a abraçar o romantismo da ocasião com traje formal. Para as mulheres, sugerimos vestidos midi ou longos — adoraríamos ver vocês de cores em tons de primavera e verão. Para os homens, pedimos terno e gravata. Na dúvida, é sempre melhor estar arrumado demais do que de menos!',
        },
      },
    ],
  },
  {
    category: { en: 'Travel & Accommodations', pt: 'Viagem e Hospedagem' },
    items: [
      {
        q: { en: 'What airport should I fly into?', pt: 'Para qual aeroporto devo voar?' },
        a: {
          en: 'For the most convenient option, MBS Airport is a little over a 15-minute drive from Midland; however, flights are less frequent and more expensive. DTW Airport in Detroit is another good option — it is more of a drive, around 2 hours to Midland, but offers more flight flexibility. FNT Airport in Flint may offer lower prices than MBS and DTW depending on your location, and it is an hour drive from Midland.',
          pt: 'A opção mais conveniente é o aeroporto MBS, a pouco mais de 15 minutos de carro de Midland; porém, os voos são menos frequentes e mais caros. O aeroporto DTW, em Detroit, é outra boa opção — a viagem é mais longa, cerca de 2 horas de carro até Midland, mas há mais flexibilidade de voos. O aeroporto FNT, em Flint, pode ter preços mais baixos que MBS e DTW dependendo da sua origem, e fica a uma hora de carro de Midland.',
        },
      },
      {
        q: { en: 'Where should I stay?', pt: 'Onde devo me hospedar?' },
        a: {
          en: 'There are many good hotels around Midland that you can stay at, including the reception site, the H Hotel!',
          pt: 'Há muitos bons hotéis em Midland, incluindo o local da recepção, o H Hotel!',
        },
      },
      {
        q: {
          en: 'Do you have hotel blocks or discount codes?',
          pt: 'Vocês têm bloco de quartos ou código de desconto?',
        },
        a: {
          en: 'Yes! We’ve reserved rooms at the reception site, the H Hotel. You can book with our special rate using a link provided by the bride or groom. Contact Carys or Marco for more information. If there are no rooms left on the site, please get in contact with the bride or groom, as we have the ability to add additional rooms to our block contingent upon availability.',
          pt: 'Sim! Reservamos quartos no local da recepção, o H Hotel. Você pode reservar com a nossa tarifa especial usando um link fornecido pelos noivos. Fale com Carys ou Marco para mais informações. Se não houver mais quartos disponíveis no site, entre em contato com os noivos — podemos adicionar quartos ao nosso bloco conforme a disponibilidade.',
        },
      },
      {
        q: { en: "What's the best way to get around?", pt: 'Qual é a melhor forma de se locomover?' },
        a: {
          en: 'A car is recommended. The ceremony and reception venues are a short drive apart.',
          pt: 'Recomendamos carro. Os locais da cerimônia e da recepção ficam a poucos minutos de carro um do outro.',
        },
      },
    ],
  },
  // — Categories below have no answered questions yet; uncomment as ready —
  // {
  //   category: { en: 'Schedule & Activities', pt: 'Programação e Atividades' },
  //   items: [
  //     { q: { en: 'What time should I arrive for the ceremony?', pt: 'A que horas devo chegar para a cerimônia?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'What is the timeline for the day?', pt: 'Qual é a programação do dia?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'When should I expect the day to end?', pt: 'Que horas o evento deve terminar?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'Are there any pre- or post-wedding events guests are invited to?', pt: 'Haverá eventos antes ou depois do casamento para os convidados?' }, a: { en: '', pt: '' } },
  //   ],
  // },
  // {
  //   category: { en: 'Social Media Etiquette', pt: 'Redes Sociais' },
  //   items: [
  //     { q: { en: 'Can I take photos during the ceremony?', pt: 'Posso tirar fotos durante a cerimônia?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'Should I post on social media?', pt: 'Posso postar nas redes sociais?' }, a: { en: '', pt: '' } },
  //   ],
  // },
  // {
  //   category: { en: 'Gifts & Registry', pt: 'Presentes e Lista' },
  //   items: [
  //     { q: { en: 'Where are you registered?', pt: 'Onde está a lista de presentes?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'Can I bring the gift to the wedding?', pt: 'Posso levar o presente no dia do casamento?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'Is it okay to send a gift later?', pt: 'Tudo bem enviar o presente depois?' }, a: { en: '', pt: '' } },
  //   ],
  // },
  // {
  //   category: { en: 'Other Questions', pt: 'Outras Dúvidas' },
  //   items: [
  //     { q: { en: 'What kind of food will there be?', pt: 'Que tipo de comida será servida?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'What if I have dietary restrictions?', pt: 'E se eu tiver restrições alimentares?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'Who can I contact with other questions?', pt: 'Com quem posso falar sobre outras dúvidas?' }, a: { en: '', pt: '' } },
  //     { q: { en: 'What is the weather like this time of year?', pt: 'Como é o clima nessa época do ano?' }, a: { en: '', pt: '' } },
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

function FaqContent() {
  const { lang } = useLang()
  const t = T[lang]

  return (
    <>
      <SiteHeader links={NAV_LINKS[lang]} homeHref="/" solid />

      <main className="faq-main">
        {/* Intro styled after the homepage section headings */}
        <section className="faq-hero">
          <h1 className="faq-heading">{t.heading}</h1>
          <p className="faq-overline">{t.overline}</p>
        </section>

        <section className="faq" id="faq">
          {FAQ_SECTIONS.map((section) => (
            <div className="faq-group" key={section.category.en}>
              <h2 className="faq-category">{section.category[lang]}</h2>
              <div className="faq-list">
                {section.items.map((item) => (
                  <FaqItem key={item.q.en} q={item.q[lang]} a={item.a[lang]} />
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

export default function Faq() {
  return (
    <LanguageProvider>
      <FaqContent />
    </LanguageProvider>
  )
}
