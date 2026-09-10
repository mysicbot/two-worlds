export function Education() {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Cartography</p>
      <h2 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Why do maps look different?</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
        The Earth is a curved surface. A map is a plane. No projection can keep area, shape, distance,
        and direction all correct at once. Choosing a projection is choosing which property to protect
        — and which distortion to accept.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-md border border-border bg-elevated p-4">
          <h3 className="font-display text-xl text-fg">Mercator, 1569</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Gerardus Mercator designed this projection for navigation. It is conformal: local angles
            and compass bearings are preserved, so a rhumb line is a straight line. The price is area.
            Scale grows with the secant of latitude. Greenland, Canada, and Russia swell.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-subtle">Keeps</dt>
              <dd className="text-fg">Local shape, direction</dd>
            </div>
            <div>
              <dt className="text-subtle">Distorts</dt>
              <dd className="text-fg">Area, distance, scale</dd>
            </div>
          </dl>
        </article>
        <article className="rounded-md border border-border bg-elevated p-4">
          <h3 className="font-display text-xl text-fg">Equal Earth, 2018</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Šavrič, Patterson, and Jenny published Equal Earth as a visually comfortable equal-area
            world. Country sizes can be compared directly. The outline stays one piece — a continuous
            pseudocylindrical — so oceans are intact and shapes still flex.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-subtle">Keeps</dt>
              <dd className="text-fg">Area, one world</dd>
            </div>
            <div>
              <dt className="text-subtle">Distorts</dt>
              <dd className="text-fg">Shape, distance</dd>
            </div>
          </dl>
        </article>
        <article className="rounded-md border border-border bg-elevated p-4">
          <h3 className="font-display text-xl text-fg">Goode Homolosine, 1923</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            John Paul Goode interrupted an equal-area composite (sinusoidal in the tropics, Mollweide
            toward the poles) so continents keep more of their shape. The oceans take the tear. Same
            area rule as Equal Earth — a different decision about where the lie goes.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-subtle">Keeps</dt>
              <dd className="text-fg">Area, continents</dd>
            </div>
            <div>
              <dt className="text-subtle">Distorts</dt>
              <dd className="text-fg">Oceans, continuity</dd>
            </div>
          </dl>
        </article>
      </div>
      <article className="mt-4 rounded-md border border-border bg-elevated p-4">
        <h3 className="font-display text-xl text-fg">Tissot’s indicatrix</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Nicolas Auguste Tissot’s device (1859 / 1881) places a small circle of true geodesic radius
          on the globe, then draws whatever that circle becomes on the map. Circles that grow but stay
          round are conformal. Ellipses of constant area are equal-area. Circles that disappear on
          Homolosine sat on an interruption — the projection chose not to represent that ocean.
        </p>
      </article>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
        GIS work inherits this choice. Web maps default to Web Mercator (EPSG:3857) because it tiles
        well and looks familiar — not because it is the right projection for area statistics. Use an
        equal-area CRS when the question is “how big,” a conformal CRS when the question is “which
        way,” and never treat a screenshot as a measurement.
      </p>
    </section>
  );
}
