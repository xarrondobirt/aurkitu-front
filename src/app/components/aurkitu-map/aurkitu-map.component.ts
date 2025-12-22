import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locate, resizeOutline } from 'ionicons/icons';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

export interface MapLocationEvent {
  lat: number;
  lng: number;
  radius: number;
}

@Component({
  selector: 'aurkitu-map',
  templateUrl: './aurkitu-map.component.html',
  styleUrls: ['./aurkitu-map.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AurkituMapComponent implements OnInit, OnDestroy {

  @Input() useCase: 'REGISTER' | 'SEARCH' = 'SEARCH';
  @Input() initialRadius: number = 0;

  @Output() locationChange = new EventEmitter<MapLocationEvent>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private circle: L.Circle | undefined;

  public currentRadius: number = 500;

  private defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  constructor() {
    // <--- CAMBIO 3: Registrar los iconos aquí
    addIcons({ locate, resizeOutline });
  }

  async ngOnInit() {
    // Ajuste de radio
    if (this.initialRadius > 0) {
      this.currentRadius = this.initialRadius;
    } else {
      this.currentRadius = (this.useCase === 'SEARCH') ? 500 : 0;
    }

    this.initMap();

    // Pequeño retardo para dar tiempo a que el HTML exista antes de pedir GPS
    setTimeout(() => {
      this.locateUser();
    }, 1000);
  }

  private initMap() {
    const EUSKADI_CENTER = { lat: 43.0, lng: -2.6 };
    const ZOOM_LEVEL = 9;

    this.map = L.map('map', {
      zoomControl: false //Quita los botones +/- si estorban
    }).setView([EUSKADI_CENTER.lat, EUSKADI_CENTER.lng], ZOOM_LEVEL);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'AurkiTU © OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 400);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  async locateUser() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.map?.setView([lat, lng], 16);
      this.updateMarker(lat, lng);

    } catch (error) {
      console.log('GPS no disponible o denegado');
    }
  }

  private updateMarker(lat: number, lng: number) {
    if (!this.map) return;

    if (!this.marker) {
      this.marker = L.marker([lat, lng], {
        draggable: true,
        icon: this.defaultIcon
      }).addTo(this.map);

      this.marker.on('dragstart', () => {
        if (this.circle) this.map?.removeLayer(this.circle);
      });

      this.marker.on('dragend', () => {
        const { lat, lng } = this.marker!.getLatLng();
        this.drawCircle(lat, lng);
        this.emitState(lat, lng);
      });

    } else {
      this.marker.setLatLng([lat, lng]);
    }

    this.drawCircle(lat, lng);
    this.emitState(lat, lng);
  }

  private drawCircle(lat: number, lng: number) {
    if (this.currentRadius <= 0) {
      if (this.circle) this.map?.removeLayer(this.circle);
      return;
    }

    if (!this.map) return;

    // Configuración de color del círculo radio
    const AURKITU_COLOR = this.getBrandColor();

    if (this.circle) {
      this.circle.setLatLng([lat, lng]);
      this.circle.setRadius(this.currentRadius);
      this.circle.setStyle({
        color: AURKITU_COLOR,
        fillColor: AURKITU_COLOR
      });

      if (!this.map.hasLayer(this.circle)) {
        this.circle.addTo(this.map);
      }
    } else {
      this.circle = L.circle([lat, lng], {
        color: AURKITU_COLOR,
        fillColor: AURKITU_COLOR,
        fillOpacity: 0.2,
        radius: this.currentRadius
      }).addTo(this.map);
    }
  }

  private getBrandColor(): string {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--aurkitu-naranja');
    return color.trim() || '#EC7445';
  }

  onRadiusChange(ev: any) {
    // Forzamos a 'as number' para evitar errores de tipo si Ionic devuelve un objeto complejo
    this.currentRadius = ev.detail.value as number;

    if (this.marker) {
      const { lat, lng } = this.marker.getLatLng();
      this.drawCircle(lat, lng);
      this.emitState(lat, lng);
    }
  }

  private emitState(lat: number, lng: number) {
    this.locationChange.emit({
      lat: lat,
      lng: lng,
      radius: this.currentRadius
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
