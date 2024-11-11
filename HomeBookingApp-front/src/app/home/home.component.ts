import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TenantListingService} from '../tenant/model/tenant-listing.service';
import {ToastService} from '../layout/toast.service';
import {CategoryService} from '../layout/navbar/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardListing} from '../landlord/model/listing.model';
import {Pagination} from '../core/model/request.model';
import {filter, Subscription} from 'rxjs';
import {Category} from '../layout/navbar/category/category.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {CardListingComponent} from '../shared/card-listing/card-listing.component';
import {Search} from '../tenant/search/search.model';
import dayjs from 'dayjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
  toastService=inject(ToastService);
  categoryService=inject(CategoryService);
  activatedRouteService=inject(ActivatedRoute);
  tenantListingService=inject(TenantListingService);

  router=inject(Router);
  private searchLoadingStatus =false;
  initialSearch =false;
  private searchSubscription: Subscription|undefined;

    ngOnDestroy(): void {
        this.tenantListingService.resetGetAllCategory();

        if(this.categoryServiceSubscription){
          this.categoryServiceSubscription.unsubscribe();
        }

        if(this.searchSubscription){
          this.searchSubscription.unsubscribe();
        }
    }
    ngOnInit(): void {
      this.startNewSearch();
        this.listenToChangeCategory();
    }

  constructor() {
      this.listenToGetAllCategory();
      this.listenToSearch();
  }

  loading=false;
    listings: Array<CardListing>|undefined;
    pageRequest:Pagination={size:10, page:0, sort:[]};
    categoryServiceSubscription: Subscription|undefined;

  private listenToChangeCategory() {
    this.categoryServiceSubscription = this.categoryService.changeCategoryObs.subscribe({
      next: (category: Category) => {
        this.loading = true;
        this.tenantListingService.getAllByCategory(this.pageRequest, category.technicalName);
      }
    });
  }


  private listenToGetAllCategory() {
    effect(() => {
     const categoryListingState =this.tenantListingService.getAllByCategorySignal();

     if(categoryListingState.status === "OK"){
       this.listings = categoryListingState.value?.content;
       this.loading = false;
     }
     else if(categoryListingState.status === "ERROR"){
       this.toastService.send({severity:"error", summary:"Error", detail:"Oops! Something went wrong while fetching the listings."})
     }
     //for solving permanent loading icon
       this.loading = false;
    });
  }

  //let's apply filtering to the home page from the search bar params.
  private startNewSearch(){
    this.initialSearch=false;//we need this line so that we can use filtering with already filtered value.
    this.activatedRouteService.queryParams.pipe(filter(params =>params['location'])).subscribe({
      next: params =>{
        this.searchLoadingStatus =true;
        this.loading =true;

        const newSearchParams: Search ={
          dates:{
            startDate: dayjs(params["startDate"]).toDate(),
            endDate: dayjs(params["endDate"]).toDate()
          },

          infos:{
            bedrooms:{value:params['bedrooms']},
            beds:{value:params['beds']},
            baths:{value:params['baths']},
            guests:{value:params['guests']}
          },

          location: params['location']

        };

        this.tenantListingService.searchListing(newSearchParams, this.pageRequest);
      }
    })
  }

  //we need to listen to changes in search hence,
  private listenToSearch():void{
   this.searchSubscription =this.tenantListingService.searchSignal.subscribe({
      next: searchState =>{

        if(searchState.status ==="OK"){
          this.loading =false;
          this.searchLoadingStatus =false;
          this.listings =searchState.value?.content;
          this.initialSearch =this.listings?.length === 0;
        }
        else if(searchState.status ==="ERROR"){
          this.loading =false;
          this.searchLoadingStatus =false;
          this.toastService.send({severity:"error", detail:"Error", summary:"We're experiencing difficulties loading listings. Please check back shortly."})
        }
      }
    })
  }

  onResetSearchFilter():void {
    this.router.navigate(["/"], {queryParams: {"category": this.categoryService.getCategoryByDefault().technicalName}});
    this.loading =true;
    this.initialSearch =false;
  }
}
