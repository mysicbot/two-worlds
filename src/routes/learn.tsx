import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FlattenLab } from "@/components/learn/FlattenLab";
import { GridGlobe } from "@/components/learn/GridGlobe";
import { SeeingNow } from "@/components/learn/SeeingNow";
import { ShapeLab } from "@/components/learn/ShapeLab";
import { loadCountries, type CountryCollection } from "@/lib/geojson";

export const Route = createFileRoute("/learn")({ component: Learn });

const CHAPTERS = [
  ["shape", "The shape"],
  ["grid", "The grid"],
  ["name", "Name, then picture"],
  ["lie", "Why a flat map lies"],
  ["now", "How we see it now"],
] as const;

function Learn() {
  const [collection, setCollection] = useState<CountryCollection | null>(null);

  useEffect(() => {
    loadCountries().then(setCollection).catch(() => setCollection(null));
  }, []);

  return (
    <main className="min-h-svh bg-bg text-fg">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="border-b border-border pb-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">Two Worlds</p>
            <Link to="/" className="text-sm text-accent underline-offset-4 hover:underline">
              Back to the maps
            </Link>
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-none text-fg sm:text-5xl">
            From a round planet to a flat page
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            The maps next door are the argument. This page is the setup: what shape the Earth is, how
            we name a place on it, and why any flat picture has to give something up.
          </p>
        </header>

        <div className="mt-6 lg:grid lg:grid-cols-[11rem_1fr] lg:gap-10">
          <nav className="mb-6 flex gap-2 overflow-x-auto lg:sticky lg:top-4 lg:mb-0 lg:block lg:self-start">
            {CHAPTERS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="shrink-0 rounded-sm border border-border px-2.5 py-1.5 text-xs text-muted hover:text-fg lg:mb-1.5 lg:block lg:border-0 lg:px-0 lg:py-1"
              >
                {label}
              </a>
            ))}
          </nav>

          <article className="flex max-w-2xl flex-col gap-14">
            <section id="shape" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">1</p>
              <h2 className="mt-1 font-display text-3xl text-fg">The Earth is almost a ball</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  If you only need a picture in your head, a ball is the right one. Oceans, continents,
                  and the air all sit on something that is round the way an orange is round. The next
                  sentence is the one that matters for maps: it is not a perfect ball, and the small
                  disagreements are exactly where coordinates come from.
                </p>
                <p>
                  The planet spins. The equator is moving fastest, and the Earth bulges there, the way
                  pizza dough creeps outward on a turntable. Centre to equator is about 6,378 km. Centre
                  to the pole is about 6,357 km. A ball pressed in at the poles is called an{" "}
                  <em className="text-fg">oblate spheroid</em>. Oblate means flattened, not stretched.
                  A rugby ball standing on its end would be the other mistake.
                </p>
                <p>
                  Surveyors and satellites do not calculate on a dented potato. They calculate on a
                  smooth mathematical egg, an <em className="text-fg">ellipsoid</em>: one clean formula,
                  a little wider than it is tall. The egg your phone uses is called{" "}
                  <em className="text-fg">WGS84</em>. It is not the rocks. It is the agreed stand-in for
                  the rocks, so that two people measuring the same hill get the same numbers.
                </p>
                <p>
                  Gravity is uneven, because the Earth is denser in some places than others. If you
                  could let the sea flow through tunnels under the continents, the water would not sit
                  on the smooth egg. It would hump up where the pull is stronger and sag where it is
                  weaker, by about a hundred metres. That invisible sea-level surface is the{" "}
                  <em className="text-fg">geoid</em>. “Height above sea level” is a height above this
                  skin, not above the egg. The two zeros can disagree by tens of metres. A building can
                  be 30 m above the egg and 5 m above the sea, or the other way around.
                </p>
                <p>
                  Then there is the ground: Everest, the Andes, a trench in the Pacific. That is the
                  surface you stand on. Three different things, often mixed up in one sentence.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <span className="text-fg">The egg.</span> A formula. Good for latitude and longitude.
                </li>
                <li>
                  <span className="text-fg">The sea-level skin.</span> Where water would rest. Good for
                  “how high”.
                </li>
                <li>
                  <span className="text-fg">The ground.</span> Mountains and trenches. What a photograph sees.
                </li>
              </ul>
              <div className="mt-5">
                <ShapeLab />
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                Remember: a globe is a fair model. A coordinate is a name on the egg. A height is a
                distance from the sea-level skin. Neither of those is the mountain.
              </p>
            </section>

            <section id="grid" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">2</p>
              <h2 className="mt-1 font-display text-3xl text-fg">A grid wrapped around a ball</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  Once you have agreed on the egg, you still need a way to say where you are on it.
                  The system we inherited is two numbers.
                </p>
                <p>
                  <em className="text-fg">Latitude</em> is how far north or south of the equator you are.
                  The equator is the belt halfway between the poles. It is 0°. The poles are 90°. The
                  lines of equal latitude are parallels. They never meet. Think of them as the stripes
                  on a beach ball: the middle stripe is the longest, and they shrink to a point at each end.
                </p>
                <p>
                  <em className="text-fg">Longitude</em> is how far east or west you are of one chosen
                  line. Those lines are meridians. They all meet at the poles, like the segments of an
                  orange. The chosen line, the <em className="text-fg">prime meridian</em>, is 0°. It
                  runs through the old observatory at Greenwich, in London. That is not a law of nature.
                  In 1884 a conference in Washington voted for it. France wanted the line through Paris,
                  and kept using its own for years. If the vote had gone the other way, Toronto would
                  still be in the same place. Only the number after the comma would change.
                </p>
                <p>
                  A degree of latitude is almost the same walk everywhere: about 111 km. A degree of
                  longitude is 111 km only on the equator. It shrinks as you go north or south, because
                  the stripes of the beach ball are shorter, and at the pole it is zero. All the orange
                  segments have already met.
                </p>
                <p>
                  Opposite Greenwich, near 180°, the calendar flips. That date line is also an agreement.
                  It bends around islands so a country does not have Tuesday on one street and Wednesday
                  on the next. The planet did not draw it.
                </p>
              </div>
              <div className="mt-5">
                <GridGlobe collection={collection} />
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                Remember: latitude is a belt. Longitude is a segment. Zero longitude is a decision made
                by people, in a room, in 1884.
              </p>
            </section>

            <section id="name" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">3</p>
              <h2 className="mt-1 font-display text-3xl text-fg">A name is not a picture</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  This is the split the rest of the app depends on. Naming a place and drawing a place
                  are two different jobs, and they fail in different ways.
                </p>
                <p>
                  A coordinate system answers: where is this point on the model? Toronto is about 43.7°
                  north and 79.4° west, on the WGS84 egg. Change the egg slightly, the way older national
                  surveys did, and the same curb gets a slightly different pair of numbers. Nothing
                  moved. The ruler changed. That is why a careful map names its{" "}
                  <em className="text-fg">coordinate reference system</em>, not just “lat long”.
                </p>
                <p>
                  A projection answers a second question: where do I put that point on a flat page, or
                  on a screen? The coordinate does not know. Latitude and longitude are not centimetres.
                  You cannot plot them as x and y and call the result honest, though many files do
                  exactly that. That cheat has a name, plate carrée, and it is in the library next door.
                  It is the spreadsheet version of the Earth.
                </p>
                <p>
                  Height is a third number, and it does not even use the same zero. Latitude and
                  longitude sit on the egg. Elevation sits on the sea-level skin. A map that forgets
                  which zero it used will be off by the height of a house, quietly.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                Remember: coordinates name a point on a chosen model. A projection draws that name on
                paper. Mixing them up is how a screenshot gets treated as a measurement.
              </p>
            </section>

            <section id="lie" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">4</p>
              <h2 className="mt-1 font-display text-3xl text-fg">Why every flat map lies</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  You can keep a ball in your hands. You cannot peel it and press the peel onto the
                  table without a tear or a stretch. That is not a gap in the software. A curved surface
                  and a flat one do not match. Gauss proved a version of this in the 1820s. You can
                  prove a smaller version with an orange and five minutes.
                </p>
                <p>
                  So a projection is a choice about which lie you will accept. Four properties keep
                  coming up, and no map keeps them all.
                </p>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Area</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is Greenland drawn as big as it is? Equal-area maps say yes. Shape bends to pay for it.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Angles</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Does a right-angled corner stay right-angled? Conformal maps say yes, in a small
                    neighbourhood. Area swells to pay for it. Mercator is the famous one.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Distance</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is a centimetre on the page the same number of kilometres everywhere? Only from
                    special lines or from one chosen point. Never everywhere.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Direction</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is north actually up, and is a straight line on the map a straight course on the
                    sea? Mercator was built so a compass course is a straight line. The shortest path,
                    a great circle, is usually a curve.
                  </dd>
                </div>
              </dl>
              <div className="mt-5">
                <FlattenLab />
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  The little circles on the maps in this project are Tissot’s idea. Draw a true circle
                  on the globe, a few hundred kilometres across, and see what the projection does to
                  it. If it stays a circle and grows toward the pole, angles were protected. If it
                  becomes an ellipse but keeps its area, size was protected. If it does a bit of both,
                  you are looking at a compromise, which is what most classroom atlases quietly are.
                </p>
                <p>
                  “Looks right” is not one of the four properties. Winkel Tripel and Robinson became
                  famous because the damage is spread thinly. They are good pictures. They are not
                  measurements.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                Remember: a projection chooses a lie. Area, angles, distance, direction. Ask which
                question the map was allowed to answer before you trust a size or a course.
              </p>
            </section>

            <section id="now" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">5</p>
              <h2 className="mt-1 font-display text-3xl text-fg">How we see the Earth now</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  A photograph from space is the most honest picture of a face of the planet, and it
                  is still not a world map. You see one hemisphere. The edge hides the rest. That view
                  has a name in the library: orthographic. It is a picture from far away, not a
                  projection that tried to show everything.
                </p>
                <p>
                  Satellites did something the orange peel never could. By watching how they speed up
                  and slow down, and by timing radar off the sea, we measured the lumpy gravity field.
                  That measurement is why the sea-level skin is no longer a guess. The egg, the skin,
                  and the ground are three data sets, kept on purpose, and combined when a job needs
                  all three.
                </p>
                <p>Your phone runs the whole chain every time the blue dot moves. Three steps, three different tools.</p>
              </div>
              <div className="mt-5">
                <SeeingNow />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  Web Mercator goes one step further from the egg: it pretends the Earth is a perfect
                  ball, because that makes the tiles simpler. GPS did not pretend that. The map app
                  did, later, for the picture. The blue dot can be right while Greenland is drawn wrong.
                  Both statements are true at the same time.
                </p>
                <p>
                  Someone doing GIS for a living picks the tool for the question. “How big is this
                  watershed?” wants an equal-area map, or no map at all, just the calculation on the
                  egg. “Which way is the runway?” wants angles kept. “Where is this lot in the city?”
                  wants a local projection, a cone or a narrow transverse Mercator zone, not a portrait
                  of the whole world. The world map on the wall is for orientation. It is a poor instrument.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                Remember: a satellite photo, a GPS coordinate, and a web map are three different
                descriptions. Only one of them is allowed to tell you an area.
              </p>
              <p className="mt-8">
                <Link
                  to="/"
                  className="inline-flex min-h-11 items-center rounded-sm border border-accent px-4 text-sm text-fg"
                >
                  Now look at the same countries, drawn three ways
                </Link>
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
