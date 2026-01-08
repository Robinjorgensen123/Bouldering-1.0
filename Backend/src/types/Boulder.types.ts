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
  location: string; // name of location/block of boulders (Group boulders in the same location)
  coordinates: ICoordinates; // Coordinates to the specifik boulder location
  imagesUrl?: string;
  topoData?: ITopoData;
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
}
