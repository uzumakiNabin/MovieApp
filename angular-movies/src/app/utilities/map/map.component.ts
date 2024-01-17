import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  latLng,
  tileLayer,
  LeafletMouseEvent,
  Marker,
  marker,
  icon,
  Icon,
} from 'leaflet';
import { MapCoordinates, MapCoordinatesWithMessage } from './coords.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements OnInit {
  constructor() {}

  @Input()
  initialCoords: MapCoordinatesWithMessage[] = [];

  @Input()
  editMode: boolean = true;

  options: any;
  layers: Marker<any>[] = [];

  @Output()
  onLeafletClick = new EventEmitter<MapCoordinates>();

  ngOnInit(): void {
    this.layers = this.initialCoords.map((value) => {
      const m = marker([value.latitude, value.longitude], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
        }),
      });

      if (value.message) {
        m.bindPopup(value.message, { autoClose: false, autoPan: false });
      }
      return m;
    });
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '...',
        }),
      ],
      zoom: 14,
      center:
        this.initialCoords.length > 0
          ? latLng(
              this.initialCoords[0].latitude,
              this.initialCoords[0].longitude
            )
          : latLng(27.73445201871446, 85.31149327754976),
    };
  }

  handleLeafletClick(event: LeafletMouseEvent) {
    if (this.editMode) {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;
      this.layers = [];
      this.layers.push(
        marker([latitude, longitude], {
          icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png',
          }),
        })
      );
      this.onLeafletClick.emit({ latitude, longitude });
    }
  }
}
