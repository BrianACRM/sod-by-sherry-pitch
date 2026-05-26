import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
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
import { siteContent } from './data/siteContent'

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

const SQM_TO_SQFT = 10.7639104167

function formatSqft(value) {
  return `${Math.round(value).toLocaleString('en-US')} sq ft`
}

function LawnMeasureTool({ onMeasured }) {
  const mapRef = useRef(null)
  const drawnRef = useRef(null)
  const mapNodeRef = useRef(null)
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('Search an address, then draw the lawn with polygon or rectangle tools.')
  const [total, setTotal] = useState(0)
  const [areas, setAreas] = useState([])

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined

    const map = L.map(mapNodeRef.current, {
      center: [35.5433, -97.8077],
      zoom: 16,
      zoomControl: false,
    })
    mapRef.current = map

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20,
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    }).addTo(map)

    const drawnItems = new L.FeatureGroup()
    drawnRef.current = drawnItems
    map.addLayer(drawnItems)

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: {
          shapeOptions: {
            color: '#f0bd3a',
            weight: 3,
            fillColor: '#315f2d',
            fillOpacity: 0.28,
          },
        },
        polygon: {
          allowIntersection: false,
          showArea: true,
          metric: false,
          shapeOptions: {
            color: '#f0bd3a',
            weight: 3,
            fillColor: '#315f2d',
            fillOpacity: 0.28,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    })
    map.addControl(drawControl)

    const layerAreaSqft = (layer) => {
      const latLngs = layer.getLatLngs()
      const ring = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs
      if (!ring || ring.length < 3 || !L.GeometryUtil) return 0
      return Math.abs(L.GeometryUtil.geodesicArea(ring)) * SQM_TO_SQFT
    }

    const updateTotals = () => {
      let nextTotal = 0
      const nextAreas = []
      let index = 1
      drawnItems.eachLayer((layer) => {
        const sqft = layerAreaSqft(layer)
        nextTotal += sqft
        nextAreas.push({ label: `Area ${index}`, sqft })
        index += 1
      })
      setTotal(nextTotal)
      setAreas(nextAreas)
      if (nextTotal > 0) onMeasured(Math.round(nextTotal))
    }

    map.on(L.Draw.Event.CREATED, (event) => {
      drawnItems.addLayer(event.layer)
      updateTotals()
      setStatus('Area added. Adjust points with the edit tool, or draw another section.')
    })
    map.on(L.Draw.Event.EDITED, updateTotals)
    map.on(L.Draw.Event.DELETED, updateTotals)

    setTimeout(() => map.invalidateSize(), 80)

    return () => {
      map.remove()
      mapRef.current = null
      drawnRef.current = null
    }
  }, [onMeasured])

  const searchAddress = async (event) => {
    event.preventDefault()
    const query = address.trim()
    if (!query) {
      setStatus('Enter a full address first.')
      return
    }
    setStatus('Searching address...')
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        countrycodes: 'us',
        addressdetails: '0',
      })
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Address search failed.')
      const data = await response.json()
      const result = data[0]
      if (!result) throw new Error('No address found. Try street, city, state, and ZIP.')
      mapRef.current?.setView([Number(result.lat), Number(result.lon)], 19)
      setStatus('Found it. Zoom or pan if needed, then draw the lawn edge.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Current-location lookup is not supported in this browser.')
      return
    }
    setStatus('Finding your location...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.setView([position.coords.latitude, position.coords.longitude], 19)
        setStatus('Location loaded. Draw the lawn edge.')
      },
      () => setStatus('Location access was denied. Search by address instead.'),
      { timeout: 10000, enableHighAccuracy: true },
    )
  }

  const copyTotal = async () => {
    const text = `Measured lawn area: ${formatSqft(total)}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus(`Copied: ${text}`)
    } catch {
      setStatus('Copy failed. Highlight the total and copy it manually.')
    }
  }

  const clearAreas = () => {
    drawnRef.current?.clearLayers()
    setTotal(0)
    setAreas([])
    setStatus('Cleared. Draw a new area when ready.')
  }

  return (
    <section className="measure-section" id="measure">
      <div className="measure-heading">
        <p className="kicker">Yard measuring tool</p>
        <h2>Draw the lawn on satellite imagery. Send the square footage straight into the sod estimate.</h2>
      </div>
      <form className="measure-search" onSubmit={searchAddress}>
        <label htmlFor="measure-address">Address</label>
        <div>
          <input
            id="measure-address"
            type="search"
            autoComplete="street-address"
            placeholder="123 Main St, Yukon, OK"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <button type="submit">Search</button>
        </div>
        <button type="button" onClick={useCurrentLocation}>
          Use my location
        </button>
        <p>{status}</p>
      </form>
      <div className="measure-tool">
        <aside className="measure-panel">
          <span>Measured total</span>
          <strong>{formatSqft(total)}</strong>
          <p>{areas.length} {areas.length === 1 ? 'area' : 'areas'}</p>
          <div className="measure-actions">
            <button type="button" disabled={total <= 0} onClick={copyTotal}>
              Copy total
            </button>
            <button type="button" disabled={!areas.length} onClick={clearAreas}>
              Clear
            </button>
          </div>
          <ol>
            {areas.length ? (
              areas.map((area) => (
                <li key={area.label}>
                  <span>{area.label}</span>
                  <b>{formatSqft(area.sqft)}</b>
                </li>
              ))
            ) : (
              <li>Draw around the lawn to start measuring.</li>
            )}
          </ol>
          <small>Use polygon for curved lawn edges or rectangle for quick rough measurements.</small>
        </aside>
        <div ref={mapNodeRef} className="measure-map" role="application" aria-label="Satellite map for drawing lawn square footage" />
      </div>
    </section>
  )
}

function App() {
  const [squareFeet, setSquareFeet] = useState(2400)
  const [activeNeed, setActiveNeed] = useState('traffic')
  const [selectedId, setSelectedId] = useState('tahoma')

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0]
  const preservedPages = siteContent.pages
  const preservedStats = preservedPages.reduce(
    (totals, page) => {
      totals.prices += page.prices?.length || 0
      totals.statistics += page.statistics?.length || 0
      totals.images += page.imageCount || 0
      return totals
    },
    { prices: 0, statistics: 0, images: 0 },
  )
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
            <a href="#measure">Measure</a>
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
            <h1>Fresh sod. Yukon grown.</h1>
            <p>
              Bermuda, fescue, zoysia, and Tahoma 31 sprigs grown in Yukon. Compare varieties, estimate pallets, then
              call the farm with a useful number.
            </p>
            <div className="action-row">
              <a className="action primary" href="#measure">
                <Calculator size={18} />
                Measure yard
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
              <h2>Current sod varieties and price ranges.</h2>
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

        <LawnMeasureTool onMeasured={setSquareFeet} />

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

        <section className="preserve-section">
          <div>
            <p className="kicker">Do not lose the current site</p>
            <h2>Keep every useful page, make the paths cleaner.</h2>
            <p>
              The redesign should preserve the business information already on Sod By Sherry. The pitch is about better
              routing, better hierarchy, and better tools, not deleting content.
            </p>
          </div>
          <dl>
            <div>
              <dt>{preservedPages.length} URLs</dt>
              <dd>All sitemap pages, product pages, product tags, category archives, and system routes are inventoried.</dd>
            </div>
            <div>
              <dt>{preservedStats.statistics} statistics</dt>
              <dd>Numbers, percentages, square-foot references, years, days, pounds, pallets, and similar facts are captured.</dd>
            </div>
            <div>
              <dt>{preservedStats.prices} prices</dt>
              <dd>Visible product and order pricing from the crawl is preserved for migration review.</dd>
            </div>
            <div>
              <dt>{preservedStats.images} images</dt>
              <dd>Gallery, product, history, sprigging, and care-page imagery is cataloged for reuse.</dd>
            </div>
          </dl>
          <div className="content-vault">
            {preservedPages.map((page) => (
              <details key={page.url}>
                <summary>
                  <span>{page.type}</span>
                  <strong>{page.title}</strong>
                </summary>
                <a href={page.url}>{page.url}</a>
                {page.metaDescription && <p>{page.metaDescription}</p>}
                {!!page.headings?.length && (
                  <div>
                    <b>Headings</b>
                    <ul>{page.headings.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {!!page.prices?.length && (
                  <div>
                    <b>Prices</b>
                    <ul>{page.prices.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {!!page.statistics?.length && (
                  <div>
                    <b>Stats and measurements</b>
                    <ul>{page.statistics.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {!!page.keyText?.length && (
                  <div>
                    <b>Extracted content</b>
                    <ul>{page.keyText.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
              </details>
            ))}
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
