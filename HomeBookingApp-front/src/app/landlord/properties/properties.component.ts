import {Component, effect, inject, OnInit} from '@angular/core';
import {LandlordListingService} from '../landlord-listing.service';
import {ToastService} from '../../layout/toast.service';
import {Card} from 'primeng/card';
import {CardListing} from '../model/listing.model';
import {CardListingComponent} from '../../shared/card-listing/card-listing.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit{
  ngOnInit(): void {
      this.fetchListings();
  }

  ngOnDestroy():void{

  }
  onDeleteListing(listing:CardListing):void{
    //first we need to out the loading state while deleting,
    listing.loading=true;
    this.landlordListingService.delete(listing.publicId);
  }

  toastService=inject(ToastService);
  landlordListingService=inject(LandlordListingService);

  listings: Array<CardListing> |undefined =[];
  loadingDeletion = false;
  loadingFetchAll = false;


  constructor() {
    this.listenFetchAll();
    this.listenDeleteByPublicId();
  }

  private fetchListings() {
    this.loadingFetchAll=true;
    this.landlordListingService.getAll();
  }

  private listenFetchAll() {
    effect(() => {
      const allListingState = this.landlordListingService.getAllSig();

      if (allListingState.status === "OK" && allListingState.value) {
        this.loadingFetchAll = false;
        this.listings =allListingState.value;
      }
      else if (allListingState.status === "ERROR") {
        this.toastService.send({severity: "error", summary: "Error", detail: "An error occurred while retrieving the listing...",});
      }
    });
  }

  private listenDeleteByPublicId(){
    effect(() => {
      const deleteState=this.landlordListingService.deleteSig();

      if(deleteState.status==="OK" && deleteState.value){
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings?.splice(listingToDeleteIndex!, 1);
        this.toastService.send({severity:"success", summary:"Successfully Deleted", detail:"The listing has been successfully removed."})
      }
      else if(deleteState.status==="ERROR"){
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);

        this.listings![listingToDeleteIndex!].loading= false;
        this.toastService.send({severity: "error", summary: "Error", detail: "Oops, something went wrong while deleting the listing...",});
      }
      //we ened do again change the loading state false.
      this.loadingDeletion=false;
    });
  }



}
