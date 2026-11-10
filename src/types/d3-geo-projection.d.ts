declare module "d3-geo-projection" {
  import type { GeoProjection } from "d3-geo";

  export interface ParallelProjection extends GeoProjection {
    parallel(): number;
    parallel(parallel: number): this;
  }

  export function geoCylindricalEqualArea(): ParallelProjection;
  export function geoCylindricalStereographic(): ParallelProjection;
  export function geoAitoff(): GeoProjection;
  export function geoBoggs(): GeoProjection;
  export function geoBonne(): GeoProjection;
  export function geoCollignon(): GeoProjection;
  export function geoCraster(): GeoProjection;
  export function geoEckert4(): GeoProjection;
  export function geoEckert6(): GeoProjection;
  export function geoFahey(): GeoProjection;
  export function geoHammer(): GeoProjection;
  export function geoHealpix(): GeoProjection;
  export function geoHomolosine(): GeoProjection;
  export function geoInterruptedBoggs(): GeoProjection;
  export function geoInterruptedHomolosine(): GeoProjection;
  export function geoInterruptedMollweide(): GeoProjection;
  export function geoInterruptedSinusoidal(): GeoProjection;
  export function geoKavrayskiy7(): GeoProjection;
  export function geoLaskowski(): GeoProjection;
  export function geoLoximuthal(): GeoProjection;
  export function geoMiller(): GeoProjection;
  export function geoMollweide(): GeoProjection;
  export function geoMtFlatPolarQuartic(): GeoProjection;
  export function geoNaturalEarth2(): GeoProjection;
  export function geoPatterson(): GeoProjection;
  export function geoPeirceQuincuncial(): GeoProjection;
  export function geoPolyconic(): GeoProjection;
  export function geoRobinson(): GeoProjection;
  export function geoSinusoidal(): GeoProjection;
  export function geoTimes(): GeoProjection;
  export function geoVanDerGrinten(): GeoProjection;
  export function geoWagner4(): GeoProjection;
  export function geoWagner6(): GeoProjection;
  export function geoWagner7(): GeoProjection;
  export function geoWinkel3(): GeoProjection;
}
