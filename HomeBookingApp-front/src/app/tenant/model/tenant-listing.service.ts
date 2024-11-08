import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {State} from '../../core/model/state.model';
import {CardListing, CreatedListing} from '../../landlord/model/listing.model';
import {createPaginationOption, Page, Pagination} from '../../core/model/request.model';
import {CategoryName} from '../../layout/navbar/category/category.model';
import {CardListingComponent} from '../../shared/card-listing/card-listing.component';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TenantListingService {

  http=inject(HttpClient);
  private getAllByCategory$: WritableSignal<State<Page<CardListing>>> =signal(State.Builder<Page<CardListing>>().forInit());

  constructor() {
  }

  getAllByCategorySignal=computed(()=> this.getAllByCategory$());
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


}
