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
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-border bg-elevated p-4">
          <h3 className="font-display text-xl text-fg">Mercator, 1569</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Gerardus Mercator designed this projection for navigation. It is conformal: local angles
            and compass bearings are preserved, so a rhumb line is a straight line. The price is area.
            Scale grows with the secant of latitude and becomes infinite at the poles. Greenland,
            Canada, and Russia swell; tropical continents look modest.
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
            Bojan Šavrič, Tom Patterson, and Bernhard Jenny published Equal Earth as a visually
            comfortable equal-area world projection. Areas of countries and continents can be compared
            directly. Shapes and distances are not conformal, and the world outline is a rounded
            pseudocylindrical — a deliberate aesthetic choice, not a defect.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-subtle">Keeps</dt>
              <dd className="text-fg">Area</dd>
            </div>
            <div>
              <dt className="text-subtle">Distorts</dt>
              <dd className="text-fg">Shape, distance, direction</dd>
            </div>
          </dl>
        </article>
      </div>
      <article className="mt-4 rounded-md border border-border bg-elevated p-4">
        <h3 className="font-display text-xl text-fg">Tissot’s indicatrix</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Nicolas Auguste Tissot’s device (1859 / 1881) places a small circle of true geodesic radius
          on the globe, then draws whatever that circle becomes on the map. If the result stays a
          circle but grows, the projection is conformal — angles held, scale drifting. If it becomes
          an ellipse whose area matches the original circle, the projection is equal-area — size held,
          shape negotiated. The ellipses on these two maps are the same circles, in two languages.
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
