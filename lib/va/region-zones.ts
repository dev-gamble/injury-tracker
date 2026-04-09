import type { BodySide } from './types'

type Rect = { xMin: number; xMax: number; yMin: number; yMax: number }
type ZoneEntry = { regionId: string; rects: Rect[] }

// Zones ordered by specificity — first match wins.
// Coordinates are 0-100% of the body image container (x: left→right, y: top→bottom).

const FRONT_ZONES: ZoneEntry[] = [
  { regionId: 'headFace',   rects: [{ xMin: 30, xMax: 70, yMin:  0, yMax:  8 }] },
  { regionId: 'neck',       rects: [{ xMin: 38, xMax: 62, yMin:  7, yMax: 15 }] },
  { regionId: 'shoulder',   rects: [
    { xMin:  8, xMax: 37, yMin: 11, yMax: 25 },
    { xMin: 63, xMax: 92, yMin: 11, yMax: 25 },
  ]},
  { regionId: 'elbow',      rects: [
    { xMin:  4, xMax: 29, yMin: 24, yMax: 48 },
    { xMin: 71, xMax: 96, yMin: 24, yMax: 48 },
  ]},
  { regionId: 'wrist_hand', rects: [
    { xMin:  4, xMax: 29, yMin: 47, yMax: 67 },
    { xMin: 71, xMax: 96, yMin: 47, yMax: 67 },
  ]},
  { regionId: 'chest',      rects: [{ xMin: 28, xMax: 72, yMin: 14, yMax: 33 }] },
  { regionId: 'abdomen',    rects: [{ xMin: 28, xMax: 72, yMin: 32, yMax: 48 }] },
  { regionId: 'hip',        rects: [{ xMin: 24, xMax: 76, yMin: 47, yMax: 57 }] },
  { regionId: 'knee',       rects: [
    { xMin: 27, xMax: 50, yMin: 56, yMax: 68 },
    { xMin: 50, xMax: 73, yMin: 56, yMax: 68 },
  ]},
  { regionId: 'leg',        rects: [
    { xMin: 27, xMax: 50, yMin: 67, yMax: 80 },
    { xMin: 50, xMax: 73, yMin: 67, yMax: 80 },
  ]},
  { regionId: 'ankle_foot', rects: [
    { xMin: 25, xMax: 51, yMin: 78, yMax: 92 },
    { xMin: 49, xMax: 75, yMin: 78, yMax: 92 },
  ]},
]

const BACK_ZONES: ZoneEntry[] = [
  { regionId: 'headFace',   rects: [{ xMin: 30, xMax: 70, yMin:  0, yMax:  8 }] },
  { regionId: 'neck',       rects: [{ xMin: 38, xMax: 62, yMin:  7, yMax: 15 }] },
  { regionId: 'shoulder',   rects: [
    { xMin:  8, xMax: 37, yMin: 11, yMax: 25 },
    { xMin: 63, xMax: 92, yMin: 11, yMax: 25 },
  ]},
  { regionId: 'elbow',      rects: [
    { xMin:  4, xMax: 29, yMin: 24, yMax: 48 },
    { xMin: 71, xMax: 96, yMin: 24, yMax: 48 },
  ]},
  { regionId: 'wrist_hand', rects: [
    { xMin:  4, xMax: 29, yMin: 47, yMax: 67 },
    { xMin: 71, xMax: 96, yMin: 47, yMax: 67 },
  ]},
  { regionId: 'back',       rects: [{ xMin: 28, xMax: 72, yMin: 14, yMax: 50 }] },
  { regionId: 'hip',        rects: [{ xMin: 24, xMax: 76, yMin: 47, yMax: 58 }] },
  { regionId: 'knee',       rects: [
    { xMin: 27, xMax: 50, yMin: 56, yMax: 68 },
    { xMin: 50, xMax: 73, yMin: 56, yMax: 68 },
  ]},
  { regionId: 'leg',        rects: [
    { xMin: 27, xMax: 50, yMin: 67, yMax: 80 },
    { xMin: 50, xMax: 73, yMin: 67, yMax: 80 },
  ]},
  { regionId: 'ankle_foot', rects: [
    { xMin: 25, xMax: 51, yMin: 78, yMax: 92 },
    { xMin: 49, xMax: 75, yMin: 78, yMax: 92 },
  ]},
]

export function getRegionAtPoint(x: number, y: number, side: BodySide): string | null {
  const zones = side === 'front' ? FRONT_ZONES : BACK_ZONES
  for (const { regionId, rects } of zones) {
    if (rects.some(r => x >= r.xMin && x <= r.xMax && y >= r.yMin && y <= r.yMax)) {
      return regionId
    }
  }
  return null
}
