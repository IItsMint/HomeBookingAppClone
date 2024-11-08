import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TenantListingService} from '../tenant/model/tenant-listing.service';
import {ToastService} from '../layout/toast.service';
import {CategoryService} from '../layout/navbar/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardListing} from '../landlord/model/listing.model';
import {Pagination} from '../core/model/request.model';
import {Subscription} from 'rxjs';
import {Category} from '../layout/navbar/category/category.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {CardListingComponent} from '../shared/card-listing/card-listing.component';

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

    ngOnDestroy(): void {
        this.tenantListingService.resetGetAllCategory();

        if(this.categoryServiceSubscription){
          this.categoryServiceSubscription.unsubscribe();
        }
    }
    ngOnInit(): void {
        this.listenToChangeCategory();
    }

  constructor() {
      this.listenToGetAllCategory();
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
}
