// Gemensam util för att konvertera punkter till/från procent
import type { ILinePoint } from "../../boulders/types/boulder.types";

export function toRelativePoints(
  points: ILinePoint[],
  width: number,
  height: number,
): ILinePoint[] {
  return points.map((pt) => ({
    x: pt.x / width,
    y: pt.y / height,
  }));
}

export function toAbsolutePoints(
  points: ILinePoint[],
  width: number,
  height: number,
): ILinePoint[] {
  return points.map((pt) => ({
    x: pt.x * width,
    y: pt.y * height,
  }));
}
