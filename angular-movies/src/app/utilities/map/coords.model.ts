export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapCoordinatesWithMessage extends MapCoordinates {
  message?: string;
}
