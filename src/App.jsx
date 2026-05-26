import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Calculator,
  Check,
  ClipboardList,
  Droplets,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Sprout,
  SunMedium,
  Truck,
} from 'lucide-react'
import './App.css'

import heroImage from './assets/sod/farm-hero.jpg'
import fescueImage from './assets/sod/fescue.jpg'
import astroImage from './assets/sod/astro-bermuda.jpg'
import tahomaImage from './assets/sod/tahoma-31.jpg'
import palishadeImage from './assets/sod/palishade.jpg'
import sprigImage from './assets/sod/sprig-box.jpg'
import trafficImage from './assets/sod/traffic-tolerance.jpg'

const products = [
  {
    name: 'Tahoma 31 Bermuda',
    price: '$355-$455',
    image: tahomaImage,
    tag: 'Premium bermuda',
    bestFor: 'Sports fields, high-traffic homes, drought-aware lawns',
    matches: ['traffic', 'sun', 'water'],
    notes: ['Excellent traffic tolerance', 'Low water use', 'Early spring green-up'],
  },
  {
    name: '9 Iron Astro Bermuda',
    price: '$185-$285',
    image: astroImage,
    tag: 'Value bermuda',
    bestFor: 'Sunny Oklahoma lawns and larger budget-conscious installs',
    matches: ['sun', 'budget'],
    notes: ['Warm-season performer', 'Good full-sun coverage', 'Fast practical choice'],
  },
  {
    name: 'Black Beauty Fescue',
    price: '$325-$425',
    image: fescueImage,
    tag: 'Cool-season option',
    bestFor: 'Shaded yards, cooler-season color, mixed-light areas',
    matches: ['shade'],
    notes: ['Shade-friendly', 'Rich green texture', 'Helpful for north-facing yards'],
  },
  {
    name: 'Palishade Zoysia',
    price: '$465-$675',
    image: palishadeImage,
    tag: 'Dense zoysia',
    bestFor: 'Premium residential lawns with a refined finished look',
    matches: ['shade', 'premium'],
    notes: ['Dense growth habit', 'Soft visual finish', 'Great curb appeal'],
  },
  {
    name: 'Tahoma 31 Sprig Box',
    price: '$1,700',
    image: sprigImage,
    tag: 'Sprigging',
    bestFor: 'Large acreage, fairways, and specialty Tahoma 31 establishment',
    matches: ['acreage', 'traffic'],
    notes: ['Boxed sprigs', 'Project-scale option', 'Best with planning support'],
  },
]

const yardNeeds = [
  { id: 'traffic', label: 'Traffic', icon: Truck },
  { id: 'shade', label: 'Shade', icon: Sprout },
  { id: 'sun', label: 'Full sun', icon: SunMedium },
  { id: 'water', label: 'Low water', icon: Droplets },
  { id: 'budget', label: 'Budget', icon: Calculator },
]

const steps = [
  {
    icon: Search,
    title: 'Choose the right grass',
    copy: 'Start with light, traffic, budget, and how quickly the lawn needs to recover.',
  },
  {
    icon: Calculator,
    title: 'Measure once',
    copy: 'Use square footage to estimate pallets before calling or ordering online.',
  },
  {
    icon: Truck,
    title: 'Schedule fresh harvest',
    copy: 'Sod is cut to order, then staged for pickup, delivery, or installation timing.',
  },
]

const proofPoints = [
  '40 years growing turf in Oklahoma',
  'Kansas City Chiefs training facility supplier',
  'OU Owen Field sand-based Tahoma 31 supplier',
  'Woodson Park, Gaillardia, SNU, and KickingBird projects',
]

function App() {
  const [squareFeet, setSquareFeet] = useState(2400)
  const [activeNeed, setActiveNeed] = useState('traffic')
  const pallets = useMemo(() => Math.max(1, Math.ceil(squareFeet / 450)), [squareFeet])
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => Number(b.matches.includes(activeNeed)) - Number(a.matches.includes(activeNeed))),
    [activeNeed],
  )

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Sod By Sherry home">
          <span className="brand-mark">S</span>
          <span>
            <strong>Sod By Sherry</strong>
            <small>Yukon, Oklahoma</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#products">Sod varieties</a>
          <a href="#calculator">Calculator</a>
          <a href="#service">Service area</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="icon-button" href="tel:+14053547926" aria-label="Call Sod By Sherry">
          <Phone size={19} />
        </a>
        <button className="menu-button" type="button" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <img className="hero-image" src={heroImage} alt="Fresh rolls of sod in an Oklahoma field" />
          <div className="hero-copy">
            <p className="eyebrow">Fresh-cut Oklahoma sod, ordered without guesswork</p>
            <h1>Pick the right grass. Know the pallet count. Get on the harvest schedule.</h1>
            <p className="hero-lede">
              A rebuilt buying experience for Sod By Sherry that turns scattered product pages into a simple path from
              yard measurement to order.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#calculator">
                Estimate pallets <Calculator size={18} />
              </a>
              <a className="secondary-action" href="tel:+14053547926">
                Call (405) 354-7926
              </a>
            </div>
          </div>
          <aside className="availability-panel" aria-label="Ordering snapshot">
            <div>
              <span>Harvest model</span>
              <strong>Fresh to order</strong>
            </div>
            <div>
              <span>Pickup</span>
              <strong>Yukon farm</strong>
            </div>
            <div>
              <span>Order status</span>
              <strong>Email order number</strong>
            </div>
          </aside>
        </section>

        <section className="decision-strip" aria-label="Primary customer actions">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article key={step.title}>
                <Icon size={22} />
                <h2>{step.title}</h2>
                <p>{step.copy}</p>
              </article>
            )
          })}
        </section>

        <section className="section-block products-section" id="products">
          <div className="section-heading">
            <p className="eyebrow">Shop by yard condition</p>
            <h2>Make grass selection feel obvious</h2>
            <p>
              The current site lists products and prices. This pitch adds context so homeowners can compare options
              before they call.
            </p>
          </div>
          <div className="need-selector" aria-label="Choose yard condition">
            {yardNeeds.map((need) => {
              const Icon = need.icon
              return (
                <button
                  className={activeNeed === need.id ? 'active' : ''}
                  key={need.id}
                  type="button"
                  onClick={() => setActiveNeed(need.id)}
                >
                  <Icon size={17} />
                  {need.label}
                </button>
              )
            })}
          </div>
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <article className={product.matches.includes(activeNeed) ? 'product-card recommended' : 'product-card'} key={product.name}>
                <img src={product.image} alt={`${product.name} sod sample`} />
                <div className="product-card-body">
                  <div className="product-meta">
                    <span>{product.tag}</span>
                    <strong>{product.price}</strong>
                  </div>
                  {product.matches.includes(activeNeed) && <span className="match-pill">Recommended match</span>}
                  <h3>{product.name}</h3>
                  <p>{product.bestFor}</p>
                  <ul>
                    {product.notes.map((note) => (
                      <li key={note}>
                        <Check size={16} />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" id="calculator">
          <div className="quote-panel">
            <p className="eyebrow">Fast pallet estimate</p>
            <h2>Help buyers call with the right number</h2>
            <p>
              Most customers do not know how much sod they need. This embedded calculator turns square footage into an
              estimated pallet count using 450 square feet per pallet.
            </p>
            <label htmlFor="squareFeet">Lawn square footage</label>
            <div className="input-row">
              <input
                id="squareFeet"
                min="100"
                step="50"
                type="number"
                value={squareFeet}
                onChange={(event) => setSquareFeet(Number(event.target.value) || 0)}
              />
              <span>sq ft</span>
            </div>
          </div>
          <div className="estimate-card" aria-live="polite">
            <ClipboardList size={30} />
            <span>Estimated order</span>
            <strong>{pallets} pallets</strong>
            <p>{pallets * 450} square feet of coverage before waste or irregular cuts.</p>
            <a href="mailto:SodBySherry@gmail.com?subject=Sod%20estimate%20request">
              Send estimate request <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="section-block proof-section">
          <div className="proof-copy">
            <p className="eyebrow">Why trust the farm</p>
            <h2>Put the strongest credibility above the fold, then back it up.</h2>
            <p>
              Their project history is strong, but it is buried in long paragraphs today. This pitch makes that proof
              scannable.
            </p>
          </div>
          <div className="proof-layout">
            <img src={trafficImage} alt="Tahoma 31 traffic tolerance chart" />
            <ul>
              {proofPoints.map((point) => (
                <li key={point}>
                  <Sprout size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="service-section" id="service">
          <div>
            <p className="eyebrow">Serving central and western Oklahoma</p>
            <h2>Clear service area, clear next step</h2>
          </div>
          <div className="service-grid">
            <article>
              <MapPin size={23} />
              <h3>Farm location</h3>
              <p>17000 West Foreman Road, Yukon, Oklahoma 73099</p>
            </article>
            <article>
              <SunMedium size={23} />
              <h3>Common cities</h3>
              <p>OKC, Edmond, Norman, Mustang, Piedmont, Tuttle, Blanchard, Choctaw, Enid, Weatherford, Woodward.</p>
            </article>
            <article>
              <Droplets size={23} />
              <h3>Care support</h3>
              <p>Route buyers into installation, watering, sod care, Tahoma 31 care, and sprigging content after order.</p>
            </article>
          </div>
        </section>

        <section className="contact-band" id="contact">
          <div>
            <p className="eyebrow">Ready to order</p>
            <h2>Make the final action impossible to miss</h2>
            <p>For weather delays or order status, email the order number to the farm.</p>
          </div>
          <div className="contact-actions">
            <a className="primary-action" href="https://www.sodbysherry.com/shop/">
              Order online <ShoppingCart size={18} />
            </a>
            <a className="secondary-action" href="mailto:SodBySherry@gmail.com">
              SodBySherry@gmail.com
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
