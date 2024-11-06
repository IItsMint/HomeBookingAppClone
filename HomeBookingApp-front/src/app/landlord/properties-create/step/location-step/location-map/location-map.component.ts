import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ToastService } from '../../../../../layout/toast.service';
import { CountryService } from '../country.service';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Country } from '../country.model';
import L, { circle, latLng, polygon, tileLayer } from 'leaflet';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    FormsModule,
    LeafletModule,
    AutoCompleteModule,
  ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.scss'
})
export class LocationMapComponent {

  toastService = inject(ToastService);
  countryService = inject(CountryService);
  private map: L.Map | undefined;
  private provider: OpenStreetMapProvider | undefined;
  currentLocation: Country | undefined;

  location = input.required<string>();
  placeholder = input<string>("Primary location of your property");

  @Output()
  locationChange = new EventEmitter<string>();

  formatLabel = (country: Country) => country.flag + " " + country.name;
  options = {
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "..." })
    ],
    zoom: 5,  // Set zoom to 5 to zoom in slightly
    center: latLng(42, 18),  // Centered to focus on the Balkans region
  }

  layersControl = {
    baseLayers: {
      "Open Street Map": tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "...",
      }),
    },

    overlays: {
      "Big Circle": circle([54.5, 15.3], { radius: 5000 }),
      "Big Square": polygon([
        [54.6, 15.1],
        [54.6, 15.4],
        [54.4, 15.4],
        [54.4, 15.1],
      ])
    }
  }

  countries: Array<Country> = [];
  filteredCountries: Array<Country> = [];

  constructor() {
    this.listenToLocation();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.configSearchControl();
  }

  private configSearchControl() {
    this.provider = new OpenStreetMapProvider();
  }

  onLocationChange(newEvent: AutoCompleteSelectEvent) {
    const newCountry = newEvent.value as Country;
    this.locationChange.emit(newCountry.cca3);
  }

  private listenToLocation() {
    effect(() => {
      const countriesState = this.countryService.countries();
      if (countriesState.status === "OK" && countriesState.value) {
        this.countries = countriesState.value;
        this.filteredCountries = countriesState.value;
        this.changeMapLocation(this.location())
      }
      else if (countriesState.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error",
          detail: "Oops... An error occurred while loading the countries during location change."
        });
      }
    });
  }

  private changeMapLocation(term: string) {
    this.currentLocation = this.countries.find(country => country.cca3 === term);

    if (this.currentLocation) {
      this.provider!.search({ query: this.currentLocation.name.common })
        .then((results) => {
          if (results && results.length > 0) {
            const firstResult = results[0];

            this.map!.setView(new L.LatLng(firstResult.y, firstResult.x), 13);
            L.marker([firstResult.y, firstResult.x])
              .addTo(this.map!)
              .bindPopup(firstResult.label)
              .openPopup();
          }
        });
    }
  };

  search(newCompleteEvent: AutoCompleteCompleteEvent): void {
    this.filteredCountries = this.countries.filter(country => country.name.common.toLowerCase().startsWith(newCompleteEvent.query));
  }

}
