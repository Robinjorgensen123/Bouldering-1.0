export interface Point {
  x: number;
  y: number;
}

export interface Boulder {
  _id: string;
  name: string;
  grade: string;
  description: string;
  imageUrl?: string;
  coordinates: {
    lat: string;
    lng: string;
  };
  topoData: {
    points: Point[];
  };
}
