export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IHold {
  type: "start" | "finish" | "hand" | "foot";
  position: { x: number; y: number };
}

export interface ILinePoint {
  x: number;
  y: number;
}

export interface ITopoData {
  linePoints: ILinePoint[];
  holds: IHold[];
}

export interface IBoulder {
  _id?: string;
  name: string;
  grade: string;
  description?: string;
  location: string;
  coordinates: ICoordinates;
  imagesUrl?: string;
  topoData?: ITopoData;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoulderListResponse {
  success: boolean;
  data: IBoulder[];
}

export interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}
