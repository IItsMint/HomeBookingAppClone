import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {State} from '../../core/model/state.model';
import {CardListing, CreatedListing, Listing} from '../../landlord/model/listing.model';
import {createPaginationOption, Page, Pagination} from '../../core/model/request.model';
import {CategoryName} from '../../layout/navbar/category/category.model';
import {CardListingComponent} from '../../shared/card-listing/card-listing.component';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {Search} from '../search/search.model';
import {Card} from 'primeng/card';


@Injectable({
  providedIn: 'root'
})
export class TenantListingService {

  http=inject(HttpClient);
  constructor() {

  }

  private getOneByPublicId$: WritableSignal<State<Listing>> =signal(State.Builder<Listing>().forInit())
  getOneByPublicIdSignal =computed(() => this.getOneByPublicId$());

  private getAllByCategory$: WritableSignal<State<Page<CardListing>>> =signal(State.Builder<Page<CardListing>>().forInit());
  getAllByCategorySignal=computed(()=> this.getAllByCategory$());

  //instead of writable signal,we need to implement subject, hence we don't want the signal emits value everytime.
  private search$: Subject<State<Page<CardListing>>> =new Subject<State<Page<CardListing>>>();
  searchSignal = this.search$.asObservable();
  //we have a public observable, we can search but we cant modify by just calling the service.


  getAllByCategory(pageRequest: Pagination, category:CategoryName){
    let params =createPaginationOption(pageRequest);
    params = params.set("category",category);
    this.http.get<Page<CardListing>>(`${environment.API_URL}/tenant-listing/get-all-by-category`,{params}).subscribe({
      //In order to notify the signal we need to use set.
      next:displayListingCard => this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forSuccess(displayListingCard)),
      //In order to notify the signal we need to use set again.
      error: err =>this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forError(err))
    })
  };

  resetGetAllCategory(){
    this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forInit())
  };

  getOneByPublicId(publicId: string): void {
    const params =new HttpParams().set("publicId", publicId);
    this.http.get<Listing>(`${environment.API_URL}/tenant-listing/get-one`, {params}).subscribe({
        next: listing => this.getOneByPublicId$.set(State.Builder<Listing>().forSuccess(listing)),
        error: err => this.getOneByPublicId$.set(State.Builder<Listing>().forError(err)),
      });
  };

  resetGetOneByPublicId(){
    this.getOneByPublicId$.set(State.Builder<Listing>().forInit());
  };


  searchListing(searchParams: Search, pageRequest: Pagination){
    const params =createPaginationOption(pageRequest);
    this.http.post<Page<CardListing>>(`${environment.API_URL}/tenant-listing/search`,searchParams, {params}).subscribe({
      next:displayListingCards => this.search$.next(State.Builder<Page<CardListing>>().forSuccess(displayListingCards)),
      error: err =>this.search$.next(State.Builder<Page<CardListing>>().forError(err)),
    })
  }


}
