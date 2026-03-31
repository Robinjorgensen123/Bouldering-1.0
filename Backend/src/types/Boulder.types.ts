export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface ILinePoint {
  x: number;
  y: number;
}

export interface IBoulder {
  _id?: string;
  name: string;
  grade: string;
  description?: string;
  location: string;
  coordinates: ICoordinates;
  imagesUrl?: string;
  topoData?: {
    linePoints: ILinePoint[];
  };
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
}
