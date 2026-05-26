import { useMemo, useState } from 'react'
import {
  Calculator,
  Check,
  ChevronRight,
  ClipboardList,
  Droplets,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShoppingCart,
  Sprout,
  SunMedium,
  Truck,
} from 'lucide-react'
import './App.css'

import farmImage from './assets/sod/farm-hero.jpg'
import fescueImage from './assets/sod/fescue.jpg'
import astroImage from './assets/sod/astro-bermuda.jpg'
import tahomaImage from './assets/sod/tahoma-31.jpg'
import palishadeImage from './assets/sod/palishade.jpg'
import sprigImage from './assets/sod/sprig-box.jpg'
import trafficImage from './assets/sod/traffic-tolerance.jpg'

const products = [
  {
    id: 'astro',
    name: '9 Iron Astro Bermuda',
    price: '$185-$285',
    image: astroImage,
    type: 'Bermuda',
    bestFor: 'Sunny lawns, budget-minded full-yard installs',
    details: ['Warm-season turf', 'Best in full sun', 'Good starter choice for Oklahoma yards'],
    matches: ['sun', 'budget'],
  },
  {
    id: 'tahoma',
    name: 'Tahoma 31 Bermuda',
    price: '$355-$455',
    image: tahomaImage,
    type: 'Bermuda',
    bestFor: 'Traffic, sports turf, lower water use',
    details: ['Strong traffic tolerance', 'Drought-aware choice', 'Used on high-profile field projects'],
    matches: ['traffic', 'sun', 'water'],
  },
  {
    id: 'fescue',
    name: 'Black Beauty Fescue',
    price: '$325-$425',
    image: fescueImage,
    type: 'Fescue',
    bestFor: 'Shade and cooler-season green color',
    details: ['Handles lower light better', 'Rich green texture', 'Useful for north-facing yards'],
    matches: ['shade'],
  },
  {
    id: 'zoysia',
    name: 'Palishade Zoysia',
    price: '$465-$675',
    image: palishadeImage,
    type: 'Zoysia',
    bestFor: 'Premium residential finish',
    details: ['Dense lawn feel', 'Refined curb appeal', 'Higher-end project fit'],
    matches: ['premium', 'shade'],
  },
  {
    id: 'sprigs',
    name: 'Tahoma 31 Sprig Box',
    price: '$1,700',
    image: sprigImage,
    type: 'Sprigs',
    bestFor: 'Large acreage and specialty establishment',
    details: ['Boxed sprigs', 'Project-scale option', 'Best discussed with the farm'],
    matches: ['acreage', 'traffic'],
  },
]

const needs = [
  { id: 'traffic', label: 'Traffic' },
  { id: 'shade', label: 'Shade' },
  { id: 'sun', label: 'Full sun' },
  { id: 'water', label: 'Less water' },
  { id: 'budget', label: 'Lower cost' },
]

const proof = [
  '40 years growing Oklahoma turf',
  'Kansas City Chiefs training facility supplier',
  'OU Owen Field sand-based Tahoma 31 supplier',
  'Woodson Park, Gaillardia, SNU, and KickingBird projects',
]

function App() {
  const [squareFeet, setSquareFeet] = useState(2400)
  const [activeNeed, setActiveNeed] = useState('traffic')
  const [selectedId, setSelectedId] = useState('tahoma')

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0]
  const pallets = useMemo(() => Math.max(1, Math.ceil(squareFeet / 450)), [squareFeet])
  const rankedProducts = useMemo(
    () =>
      [...products].sort((first, second) => {
        return Number(second.matches.includes(activeNeed)) - Number(first.matches.includes(activeNeed))
      }),
    [activeNeed],
  )

  return (
    <div className="page">
      <header className="site-header">
        <div className="utility-row">
          <span>17000 West Foreman Road, Yukon, OK</span>
          <a href="mailto:SodBySherry@gmail.com">SodBySherry@gmail.com</a>
          <a href="tel:+14053547926">(405) 354-7926</a>
        </div>
        <div className="nav-row">
          <a className="brand" href="#top" aria-label="Sod By Sherry pitch home">
            <span className="brand-stamp">SBS</span>
            <span>
              <strong>Sod By Sherry</strong>
              <small>Oklahoma grown sod</small>
            </span>
          </a>
          <nav aria-label="Page navigation">
            <a href="#selector">Sod</a>
            <a href="#calculator">Estimate</a>
            <a href="#proof">Tahoma 31</a>
            <a href="#contact">Order</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="ordering-board">
          <div className="intro-copy">
            <p className="kicker">Oklahoma sod farm</p>
            <h1>Bermuda, fescue, and zoysia sod grown in Yukon.</h1>
            <p>
              Fresh cut to order for pickup, delivery, or installation timing. Compare varieties, estimate pallets, then
              call the farm with a real number.
            </p>
            <div className="action-row">
              <a className="action primary" href="#calculator">
                <Calculator size={18} />
                Estimate pallets
              </a>
              <a className="action secondary" href="https://www.sodbysherry.com/shop/">
                <ShoppingCart size={18} />
                Current shop
              </a>
            </div>
          </div>

          <div className="farm-photo">
            <img src={farmImage} alt="Sod rolls staged in a farm field" />
            <div className="photo-note">
              <span>Fresh cut to order</span>
              <strong>Pickup, delivery, and installation timing belong up front.</strong>
            </div>
          </div>

          <aside className="status-list" aria-label="Key ordering details">
            <div>
              <Truck size={18} />
              <span>Pickup</span>
              <strong>Yukon farm</strong>
            </div>
            <div>
              <ClipboardList size={18} />
              <span>Status</span>
              <strong>Email order number</strong>
            </div>
            <div>
              <MapPin size={18} />
              <span>Service</span>
              <strong>Central and western Oklahoma</strong>
            </div>
          </aside>
        </section>

        <section className="workbench" id="selector">
          <div className="workbench-header">
            <div>
              <p className="kicker">Sod varieties</p>
              <h2>Choose by yard condition.</h2>
            </div>
            <div className="need-tabs" aria-label="Filter products by yard need">
              {needs.map((need) => (
                <button
                  className={activeNeed === need.id ? 'active' : ''}
                  key={need.id}
                  type="button"
                  onClick={() => setActiveNeed(need.id)}
                >
                  {need.label}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-layout">
            <div className="product-list">
              {rankedProducts.map((product) => (
                <button
                  className={selectedId === product.id ? 'selected' : ''}
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                >
                  <img src={product.image} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.bestFor}</small>
                  </span>
                  <b>{product.price}</b>
                </button>
              ))}
            </div>

            <article className="product-detail">
              <img src={selectedProduct.image} alt={`${selectedProduct.name} sod`} />
              <div>
                <span className="product-type">{selectedProduct.type}</span>
                <h3>{selectedProduct.name}</h3>
                <p>{selectedProduct.bestFor}</p>
                <ul>
                  {selectedProduct.details.map((detail) => (
                    <li key={detail}>
                      <Check size={16} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className="estimate-section" id="calculator">
          <div className="calculator-panel">
            <p className="kicker">Pallet calculator</p>
            <h2>Measure the lawn before calling.</h2>
            <p>One pallet covers about 450 square feet. Final quantity may change for waste, curves, or slopes.</p>
            <label htmlFor="squareFeet">Square feet</label>
            <div className="number-field">
              <Ruler size={18} />
              <input
                id="squareFeet"
                min="100"
                step="50"
                type="number"
                value={squareFeet}
                onChange={(event) => setSquareFeet(Number(event.target.value) || 0)}
              />
            </div>
          </div>
          <div className="estimate-ticket">
            <span>Estimated pallet count</span>
            <strong>{pallets}</strong>
            <p>{pallets * 450} sq ft before waste, slopes, or irregular cuts.</p>
            <a href="mailto:SodBySherry@gmail.com?subject=Sod%20estimate%20request">
              Send to the farm <ChevronRight size={17} />
            </a>
          </div>
        </section>

        <section className="proof-section" id="proof">
          <div className="proof-text">
            <p className="kicker">Tahoma 31 performance</p>
            <h2>Field-tested turf with real project history.</h2>
            <p>
              Sod By Sherry already has the facts buyers care about: years in turf, recognizable fields, and performance
              graphics for premium varieties.
            </p>
            <ul>
              {proof.map((item) => (
                <li key={item}>
                  <Sprout size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <figure className="proof-graphic">
            <img src={trafficImage} alt="Tahoma 31 traffic tolerance comparison chart" />
            <figcaption>Tahoma 31 performance graphic retained from the current site.</figcaption>
          </figure>
        </section>

        <section className="service-strip">
          <article>
            <SunMedium size={21} />
            <h3>Product pages</h3>
            <p>Give each sod variety plain-English fit, price range, care notes, and pickup expectations.</p>
          </article>
          <article>
            <Droplets size={21} />
            <h3>Care after order</h3>
            <p>Move watering, installation, Tahoma 31 care, and sprigging content into post-purchase paths.</p>
          </article>
          <article>
            <MapPin size={21} />
            <h3>Service area</h3>
            <p>OKC, Edmond, Norman, Mustang, Piedmont, Tuttle, Blanchard, Choctaw, Enid, Weatherford, Woodward.</p>
          </article>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <p className="kicker">Order or check status</p>
            <h2>Call the farm or email your order number.</h2>
            <p>Keep the last step simple: phone, email, and the current online shop all stay easy to reach.</p>
          </div>
          <div className="contact-buttons">
            <a className="action primary" href="tel:+14053547926">
              <Phone size={18} />
              Call the farm
            </a>
            <a className="action secondary" href="mailto:SodBySherry@gmail.com">
              <Mail size={18} />
              Email order status
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
