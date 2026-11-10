declare module "d3-geo-projection" {
  import type { GeoProjection } from "d3-geo";
  export function geoInterruptedHomolosine(): GeoProjection;
  export function geoWinkel3(): GeoProjection;
  export function geoRobinson(): GeoProjection;
  export function geoMollweide(): GeoProjection;
  export function geoSinusoidal(): GeoProjection;

  export interface CylindricalEqualArea extends GeoProjection {
    parallel(): number;
    parallel(parallel: number): this;
  }
  export function geoCylindricalEqualArea(): CylindricalEqualArea;
}
