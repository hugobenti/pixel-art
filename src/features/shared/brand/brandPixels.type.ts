import type { TBrandGrid } from "./brandArt.type";

/** Consecutive pixels of one color in one grid row. */
export interface IBrandRun {
  x: number;
  y: number;
  length: number;
  key: string;
}

/** A grid placed in a lockup, at a position in logo pixels. */
export interface IBrandLockupPart {
  grid: TBrandGrid;
  x: number;
  y: number;
}

export interface IBrandLockup {
  width: number;
  height: number;
  runs: IBrandRun[];
}
