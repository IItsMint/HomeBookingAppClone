import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CardListing, CreatedListing, NewListing} from "./model/listing.model";
import {State} from "../core/model/state.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LandlordListingService {

  http = inject(HttpClient);

  constructor() { }

  private create$: WritableSignal<State<CreatedListing>> = signal(State.Builder<CreatedListing>().forInit())
  createSig = computed(() => this.create$());

  private delete$: WritableSignal<State<string>> = signal(State.Builder<string>().forInit())
  deleteSig = computed(() => this.delete$());

  private getAll$: WritableSignal<State<Array<CardListing>>> = signal(State.Builder<Array<CardListing>>().forInit())
  getAllSig = computed(() => this.getAll$());


  create(newListing: NewListing): void {
    const formData = new FormData();
    for(let x = 0; x < newListing.pictures.length; ++x) {
      formData.append("picture-" + x, newListing.pictures[x].file);
    }
    const clone = structuredClone(newListing);
    clone.pictures = [];
    formData.append("dto", JSON.stringify(clone));
    this.http.post<CreatedListing>(`${environment.API_URL}/landlord-listing/create`, formData).subscribe({

      next: listing => this.create$.set(State.Builder<CreatedListing>().forSuccess(listing)),
      error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)),
    });
  }

  resetListingCreation(): void {
    this.create$.set(State.Builder<CreatedListing>().forInit())
  }

  delete(publicId: string): void {
    const params = new HttpParams().set("publicId", publicId);
    this.http.delete<string>(`${environment.API_URL}/landlord-listing/delete`, {params}).subscribe({
        next: publicId => this.delete$.set(State.Builder<string>().forSuccess(publicId)),
        error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)),
      });
  }

  resetDelete() {
    this.delete$.set(State.Builder<string>().forInit());
  }

  getAll(): void {
    this.http.get<Array<CardListing>>(`${environment.API_URL}/landlord-listing/get-all`).subscribe({

        next: listings => this.getAll$.set(State.Builder<Array<CardListing>>().forSuccess(listings)),
        error: err => this.create$.set(State.Builder<CreatedListing>().forError(err)),
      });
  }

}
