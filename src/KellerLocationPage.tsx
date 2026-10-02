import { kellerEquipment, kellerFaqs, kellerLocation as location } from "./kellerLocation";

function KellerActions() {
  return <div className="keller-actions">
    <a className="button" href={`tel:${location.phoneE164}`}>Call {location.phoneDisplay}</a>
    <a className="button secondary" href="/contact-us/?location=Keller%2C%20TX">Request a quote</a>
  </div>;
}

export function KellerLocationPage() {
  return <article className="keller-page">
    <section className="keller-hero">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span>
          <a href="/service-areas/">Service Areas</a><span>/</span>
          <a href={location.regionPath}>North Texas</a><span>/</span>
          <span aria-current="page">Keller</span>
        </nav>
        <span className="eyebrow">KELLER, TEXAS · NATIONWIDE DELIVERY</span>
        <h1>{location.headline}</h1>
        <p className="keller-lead" data-h1-intro>{location.intro}</p>
        <KellerActions />
        <div className="keller-business-grid">
          <section className="keller-business" aria-labelledby="keller-business-name">
            <span className="eyebrow">YOUR LOCAL RENTAL TEAM</span>
            <h2 id="keller-business-name">{location.name}</h2>
            <address>{location.address}</address>
            <a className="keller-phone" href={`tel:${location.phoneE164}`}>{location.phoneDisplay}</a>
            <p><strong>Hours:</strong> {location.hours}</p>
            <div className="keller-profile-links">
              <a href={location.mapUrl} target="_blank" rel="noopener noreferrer">View on Google Maps ↗</a>
              <a className="button secondary" href={location.reviewUrl} target="_blank" rel="noopener noreferrer">Review us on Google</a>
            </div>
          </section>
          <iframe className="keller-map" title="Mobile Shower Trailer Rental Google Business Profile map in Keller, TX" src={location.embedUrl} width="600" height="450" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </div>
    </section>
    <section className="wrap keller-section" aria-labelledby="keller-equipment-title">
      <span className="eyebrow">FIND YOUR CONFIGURATION</span>
      <h2 id="keller-equipment-title">Shower Trailers for Rent</h2>
      <p>Compare shower-only facilities, combination trailers and ADA options. Confirm the available layout, utility requirements and rental dates with our team.</p>
      <ul className="keller-equipment">{kellerEquipment.map(([label, href]) => <li key={href}><a href={href}>{label}<span aria-hidden="true">↗</span></a></li>)}</ul>
    </section>
    <section className="keller-logistics" aria-labelledby="keller-delivery-title">
      <div className="wrap keller-section">
        <span className="eyebrow">FROM KELLER TO YOUR SITE</span>
        <h2 id="keller-delivery-title">Nationwide Delivery &amp; Logistics</h2>
        <p>Dispatched from our Keller, TX yard to job sites in all 50 states. GPS-tracked delivery nationwide.</p>
        <h3>Delivery areas</h3>
        <dl className="keller-delivery-areas">
          <div><dt>Dallas–Fort Worth</dt><dd>{location.cities.join(", ")}. Call for delivery timing based on your site and available equipment.</dd></div>
          <div><dt>Statewide</dt><dd>Houston, San Antonio, Austin and the rest of Texas. Delivery timing is confirmed with your quote.</dd></div>
          <div><dt>Nationwide</dt><dd>All 50 states. Contact the rental team to confirm lead time and transport arrangements.</dd></div>
        </dl>
        <h3>What your site needs</h3>
        <p>Level ground, water, power and a drain. Tell us if your site needs holding tanks, and confirm connections, delivery access and placement before the trailer arrives.</p>
        <div className="keller-parent-links"><a href={location.regionPath}>North Texas service areas ↗</a><a href="/service-areas/">All service areas ↗</a></div>
      </div>
    </section>
    <section className="wrap keller-section" aria-labelledby="keller-faq-title">
      <span className="eyebrow">PLAN YOUR RENTAL</span>
      <h2 id="keller-faq-title">Frequently Asked Questions</h2>
      <div className="keller-faqs">{kellerFaqs.map(({question, answer}) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <section className="wrap keller-section" aria-labelledby="keller-photos-title">
      <span className="eyebrow">INSIDE OUR EQUIPMENT</span>
      <h2 id="keller-photos-title">Shower Trailer and Container Photos</h2>
      <h3>20 ft, 5-stall shower container</h3>
      <p>Photos show interiors of the 20 ft shower container, not a Keller job-site installation.</p>
      <div className="keller-photos">
        <figure><img src="/images/keller/20ft-5-stall-shower-container-private-stall.webp" alt="Private shower stall inside a 20 ft, 5-stall shower container" width="960" height="1280" loading="lazy"/><figcaption>Private shower stall in the 20 ft, 5-stall shower container.</figcaption></figure>
        <figure><img src="/images/keller/20ft-5-stall-shower-container-stall-row.webp" alt="Row of private shower stalls inside a 20 ft, 5-stall shower container" width="960" height="1280" loading="lazy"/><figcaption>Multiple shower stalls inside a 20 ft container.</figcaption></figure>
        <figure><img src="/images/keller/20ft-5-stall-shower-container-two-stalls.webp" alt="Two private shower stalls in a 20 ft, 5-stall shower container" width="960" height="1280" loading="lazy"/><figcaption>Two enclosed shower stalls with individual fixtures.</figcaption></figure>
        <figure><img src="/images/keller/20ft-5-stall-shower-container-three-stalls.webp" alt="Three shower stalls in a 20 ft, 5-stall shower container" width="960" height="1280" loading="lazy"/><figcaption>Three shower stalls inside the container.</figcaption></figure>
      </div>
      <h3>13 ft, 3-stall shower/restroom combination trailer</h3>
      <p>These separate photos show the 13 ft combination trailer collection, not the shower-only container above.</p>
      <div className="keller-photos">
        <figure><img src="/images/keller/shower-restroom-trailer-13ft-3-stall-interior.webp" alt="Interior of a 13 ft, 3-stall shower and restroom combination trailer" width="960" height="1280" loading="lazy"/><figcaption>13 ft, 3-stall combination trailer interior.</figcaption></figure>
        <figure><img src="/images/keller/shower-restroom-trailer-13ft-3-stall-bathroom.webp" alt="Restroom inside a 13 ft, 3-stall shower and restroom combination trailer" width="960" height="1273" loading="lazy"/><figcaption>Bathroom interior from the same combination trailer collection.</figcaption></figure>
      </div>
    </section>
    <section className="keller-closing">
      <div className="wrap keller-section"><span className="eyebrow">LET’S PLAN YOUR DELIVERY</span><h2>Ready for showers at your site?</h2><p>Share your site location, user count and rental dates. Our Keller team can help with sizing and delivery timing.</p><KellerActions /></div>
    </section>
  </article>;
}
