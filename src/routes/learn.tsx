import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DegreeWalk } from "@/components/learn/DegreeWalk";
import { FlattenLab } from "@/components/learn/FlattenLab";
import { GridGlobe } from "@/components/learn/GridGlobe";
import { PhotoHalf } from "@/components/learn/PhotoHalf";
import { SeeingNow } from "@/components/learn/SeeingNow";
import { ShapeLab } from "@/components/learn/ShapeLab";
import { SizeLie } from "@/components/learn/SizeLie";
import { SpinLab } from "@/components/learn/SpinLab";
import { SpreadsheetMap } from "@/components/learn/SpreadsheetMap";
import { loadCountries, type CountryCollection } from "@/lib/geojson";

export const Route = createFileRoute("/learn")({ component: Learn });

const CHAPTERS = [
  ["shape", "The shape"],
  ["grid", "Two numbers"],
  ["name", "Name, then picture"],
  ["lie", "The flat cheat"],
  ["now", "Your phone"],
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
            Start with a ball. End with the map on your phone. The maps next door are the lab. This page is
            why they disagree.
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
                <p>If you only need a picture in your head, use a ball. A classroom globe is that picture. It is a good start.</p>
                <p>It is not the last word.</p>
                <p>
                  The Earth spins. Anything that spins wants to bulge at the middle. Pizza dough does this on a spinning
                  tray. The middle creeps out. The top and bottom stay a little closer to the centre.
                </p>
                <p>The Earth does the same thing. Very gently.</p>
              </div>
              <div className="mt-5">
                <SpinLab />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>Here are the two distances that matter.</p>
                <p>
                  From the centre of the Earth out to the equator: about 6,378 km. From the centre up to the north pole:
                  about 6,357 km. The pole is 21 km closer.
                </p>
                <p>
                  21 km is a long drive. On a planet this big, it is a small dent. You would not see it from space.
                </p>
                <p>
                  The name for this shape is <em className="text-fg">oblate spheroid</em>. Oblate just means flat at the
                  poles, not pointy. A rugby ball standing on its end is the wrong picture. That shape is pointy at the
                  ends. The Earth is the opposite. It is a little wide around the middle.
                </p>
                <p>
                  Rocks are bumpy. Map math needs a smooth shape, or two people measuring the same hill get different
                  answers. So we agree on a smooth egg. The math word is <em className="text-fg">ellipsoid</em>. It means
                  a ball that has been gently squashed. One clean formula. A little wider than it is tall.
                </p>
                <p>
                  The egg your phone uses is called <em className="text-fg">WGS84</em>. You do not need to memorize the
                  letters. You need the idea. The phone is not tracing every rock. It is measuring against an egg we
                  agreed on.
                </p>
                <p>
                  Gravity is not the same everywhere. Some parts of the Earth pull a little harder. Imagine the sea
                  could flow through tunnels under the land. The water would not sit on the smooth egg. It would bulge
                  where the pull is strong, and sag where the pull is weak. The bulge is about 100 metres. That is a
                  tall building, not a mountain.
                </p>
                <p>
                  That wavy water surface is the <em className="text-fg">geoid</em>. Think of a skin of sea level, wrapped
                  around the whole planet, even under the continents. “Height above sea level” means height above this
                  skin. Not above the egg.
                </p>
                <p>
                  The egg and the skin are not the same zero. They can disagree by tens of metres. A spot can be 30
                  metres above the egg and only 5 metres above the sea. Nothing moved. We changed which surface we
                  called zero.
                </p>
                <p>Then there is the ground you stand on. Mountains. Valleys. The deep parts of the ocean.</p>
                <p>Three things. People mix them up in one sentence. They are not the same.</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <span className="text-fg">The egg.</span> A smooth shape for the math. Latitude and longitude live here.
                </li>
                <li>
                  <span className="text-fg">The sea-level skin.</span> Where “how high” is measured from.
                </li>
                <li>
                  <span className="text-fg">The ground.</span> What a photo sees. Everest is under 9 km. The dent in the
                  egg is about 21 km. The skin only wanders by about 100 metres.
                </li>
              </ul>
              <div className="mt-5">
                <ShapeLab />
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                In short: a globe is a fair toy. A coordinate is a name on the egg. A height is a distance from the
                sea-level skin. A mountain is neither of those.
              </p>
            </section>

            <section id="grid" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">2</p>
              <h2 className="mt-1 font-display text-3xl text-fg">Two numbers say where you are</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>The egg is smooth. We still need a way to point at one spot on it. We use two numbers.</p>
                <p>
                  <em className="text-fg">Latitude</em> says how far north or south you are from the equator. The equator
                  is the belt around the middle, halfway between the poles.
                </p>
                <p>On that belt, latitude is 0°. At the north pole it is 90° north. At the south pole it is 90° south.</p>
                <p>
                  Lines that share a latitude are called <em className="text-fg">parallels</em>. They run east–west. They
                  never meet. Picture stripes on a beach ball. The middle stripe is the longest. They shrink until they
                  are a dot at each pole.
                </p>
                <p>
                  <em className="text-fg">Longitude</em> says how far east or west you are. These lines are called{" "}
                  <em className="text-fg">meridians</em>. They run from pole to pole, like the segments of an orange. They
                  all meet at the poles.
                </p>
                <p>
                  One of those lines is the starting line. It is the <em className="text-fg">prime meridian</em>. Prime
                  just means first. Its number is 0°.
                </p>
                <p>
                  That line goes through Greenwich, in London. It is not a crack in the planet. In 1884, people at a
                  meeting in Washington voted for it. France wanted the line to go through Paris, and kept its own line
                  for years.
                </p>
                <p>If the vote had gone the other way, Toronto would not move. Only the second number would change.</p>
                <p>
                  Walk one degree of latitude, north or south. That walk is about 111 km, almost everywhere.
                </p>
                <p>
                  Walk one degree of longitude, east or west. On the equator, that is also about 111 km. As you go
                  toward a pole, the orange segments squeeze together. The walk gets shorter. At the pole it is zero.
                  You are already standing on every longitude at once.
                </p>
              </div>
              <div className="mt-5">
                <DegreeWalk />
              </div>
              <div className="mt-5">
                <GridGlobe collection={collection} />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  On the far side of the Earth from Greenwich, near 180°, the day changes. Cross that line and the
                  calendar jumps. It is called the date line.
                </p>
                <p>
                  People drew it. It bends around islands, so one country does not have Tuesday on one street and
                  Wednesday on the next. The Earth did not draw this line.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                In short: latitude is the stripe. Longitude is the orange segment. Zero longitude was a vote, in a
                room, in 1884.
              </p>
            </section>

            <section id="name" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">3</p>
              <h2 className="mt-1 font-display text-3xl text-fg">A name is not a drawing</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>This is the idea the whole project is built on.</p>
                <p>Naming a place and drawing a place are two different jobs. They can go wrong in different ways.</p>
                <p>
                  A coordinate answers one question. Where is this spot on the egg? Toronto is about 43.7° north and
                  79.4° west, on the WGS84 egg.
                </p>
                <p>
                  Change the egg a little, the way older countries used to, and the same street corner gets a slightly
                  different pair of numbers. The corner did not move. The ruler changed.
                </p>
                <p>
                  Careful maps say which ruler they used. The long name is{" "}
                  <em className="text-fg">coordinate reference system</em>. It means: which egg, and which starting line.
                </p>
                <p>
                  A <em className="text-fg">projection</em> answers a second question. Where do I put that spot on a flat
                  page, or on a screen?
                </p>
                <p>
                  Latitude and longitude are not centimetres. They are angles on a ball. You cannot drop them into a
                  spreadsheet as x and y and call the picture honest. A lot of files do exactly that.
                </p>
              </div>
              <div className="mt-5">
                <SpreadsheetMap />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  Height is a third number. It does not even use the same zero. Latitude and longitude sit on the egg.
                  Height sits on the sea-level skin. Mix those zeros up and you can be off by the height of a house.
                  You will not see the mistake in the picture.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                In short: the numbers name a spot. The map draws the name. A drawing can get the size wrong and still
                have the right numbers.
              </p>
            </section>

            <section id="lie" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">4</p>
              <h2 className="mt-1 font-display text-3xl text-fg">A flat map has to cheat</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>Hold a ball. Now try to peel it and press the peel flat on a table.</p>
                <p>It will rip. Or it will stretch. You cannot have both “no rip” and “no stretch.”</p>
                <p>
                  A map has the same problem. A ball and a flat page do not match. This is not a bug in the app. An
                  orange shows it in five minutes. A mathematician wrote the proof about 200 years ago.
                </p>
                <p>So every flat map chooses what to get wrong. Four questions come up again and again. No map can answer all four.</p>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Size</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is Greenland drawn as big as it really is? Some maps say yes. To do that, they bend the shapes.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Corners</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Does a square corner stay square? Some maps say yes, for a small shape. Mercator is the famous one.
                    It keeps the corners and gives up the size.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Distance</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is one centimetre on the page the same number of kilometres everywhere? Only along special lines, or
                    only from one chosen point. Never everywhere at once.
                  </dd>
                </div>
                <div className="rounded-md border border-border p-3">
                  <dt className="text-sm text-fg">Direction</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    Is a straight line on the map a straight course for a ship? Mercator was built so a compass course is
                    straight. The shortest path on the Earth is usually a curve on that map.
                  </dd>
                </div>
              </dl>
              <div className="mt-5">
                <SizeLie collection={collection} />
              </div>
              <div className="mt-5">
                <FlattenLab />
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  The small circles on the maps in this project are a test. Someone named Tissot drew it up. Put a real
                  circle on the globe, a few hundred kilometres across. Then see what the map does to it.
                </p>
                <p>If it stays a circle and grows toward the pole, the map kept the corners and gave up the size.</p>
                <p>If it turns into an oval but keeps the same area, the map kept the size and gave up the shape.</p>
                <p>
                  If it does a bit of both, the map is splitting the difference. Most school atlases do this. They look
                  familiar. They are a bad ruler.
                </p>
                <p>
                  “It looks about right” is not one of the four. Some maps are popular because the damage is spread
                  out. Winkel Tripel and Robinson are good pictures. Do not measure a country off them.
                </p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                In short: a flat map picks a cheat. Size, corners, distance, or direction. Ask which question it was
                built to answer before you trust a size or a course.
              </p>
            </section>

            <section id="now" className="scroll-mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">5</p>
              <h2 className="mt-1 font-display text-3xl text-fg">How we see the Earth now</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  A photo from space is the most honest picture of one face of the Earth. It is still not a world map.
                  You see the front. The back is hidden. The edge is squeezed.
                </p>
              </div>
              <div className="mt-5">
                <PhotoHalf />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  Satellites did a job an orange peel cannot do. They feel the gravity. They time how long a radar ping
                  takes to bounce off the sea. That is how we measured the wavy sea-level skin, instead of guessing it.
                </p>
                <p>Your phone does three jobs every time the blue dot moves. They are easy to mix up.</p>
              </div>
              <div className="mt-5">
                <SeeingNow />
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  The tile picture goes one step further. It even pretends the Earth is a perfect ball, because the
                  tiles are easier that way. The name is Web Mercator. The satellites did not pretend that. The map app
                  did, later, only for the picture.
                </p>
                <p>The blue dot can be in the right place while Greenland is the wrong size. Both things are true.</p>
                <p>People who make maps for a living pick the tool to match the question. The job is often called GIS.</p>
                <p>“How big is this lake?” needs a map that keeps size. Or no map at all. Just the math on the egg.</p>
                <p>“Which way does the runway point?” needs a map that keeps corners.</p>
                <p>
                  “Where is this house on this street?” needs a local map. A small piece of the Earth. Not a poster of
                  the whole world.
                </p>
                <p>A world map on the wall helps you see how the continents sit. It is a bad ruler.</p>
              </div>
              <p className="mt-4 border-l border-accent pl-3 text-sm text-muted">
                In short: a space photo, a GPS number, and a web map are three different things. Only one of them is
                allowed to tell you how big a country is.
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
