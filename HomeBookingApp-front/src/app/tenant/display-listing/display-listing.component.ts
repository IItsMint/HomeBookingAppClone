import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from '../../layout/toast.service';
import {CategoryService} from '../../layout/navbar/category/category.service';
import {TenantListingService} from '../model/tenant-listing.service';
import {CountryService} from '../../landlord/properties-create/step/location-step/country.service';
import {ActivatedRoute} from '@angular/router';
import {DisplayPicture, Listing} from '../../landlord/model/listing.model';
import {Category} from '../../layout/navbar/category/category.model';
import {map} from 'rxjs';
import {NgClass} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AvatarComponent} from '../../layout/navbar/avatar/avatar.component';
import {BookDateComponent} from '../book-date/book-date.component';

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    AvatarComponent,
    BookDateComponent,
  ],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss'
})
export class DisplayListingComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {
      this.tenantListingService.resetGetOneByPublicId();
  }
  ngOnInit(): void {
    //first we need to extract the parameter hence, the public id is pulled from url.
    // even user refresh the browser, house is selected.
      this.extractIdParamFromRouter();
  }

  toastService=inject(ToastService);
  categoryService=inject(CategoryService);
  tenantListingService=inject(TenantListingService);
  countryService=inject(CountryService);
  activatedRoute=inject(ActivatedRoute);

  listing: Listing|undefined;
  category: Category|undefined;

  loading=true;
  currentPublicId="";


  constructor() {
    this.listenToFetchListing();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(map(params => params['id'])).subscribe({
      next: publicId => this.fetchListing(publicId),

    })
  }

  private fetchListing(publicId: string) {
    this.loading =true;
    this.currentPublicId =publicId;
    this.tenantListingService.getOneByPublicId(publicId);

  }

  private listenToFetchListing() {
    effect(() => {
     const listingByPublicIdState =this.tenantListingService.getOneByPublicIdSignal();

     if(listingByPublicIdState.status === "OK"){
       this.loading =false;
       this.listing =listingByPublicIdState.value;

       if(this.listing){
         this.listing.pictures =this.putCOverPictureFirst(this.listing.pictures);
         this.category =this.categoryService.getCategoryByTechnicalName(this.listing.category);//to fetch
         this.countryService.getCountryByCode(this.listing.location).subscribe({
           next: country =>{

             if(this.listing){
               this.listing.location =country.region +", " +country.name.common;
             }
           }
         });
       }
     }
     else if(listingByPublicIdState.status === "ERROR"){
       this.loading = false;
       this.toastService.send({ severity: "error", detail:"OPS! Something went wrong unable to fetch the listing..."});
     }
    });
  }

  private putCOverPictureFirst(pictures: Array<DisplayPicture>) {
    const coverIndex =pictures.findIndex(picture => picture.isCover);

    if(coverIndex){
       const cover =pictures[coverIndex];
       pictures.splice(coverIndex, 1);//to put it first
       pictures.unshift(cover);//to put it beginning of the array.
    }

    return pictures;
  }




}
