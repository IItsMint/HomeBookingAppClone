import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from '../../layout/toast.service';
import {BookingService} from '../../tenant/service/booking.service';
import {BookedListing} from '../../tenant/model/booking.model';
import {CardListingComponent} from '../../shared/card-listing/card-listing.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit, OnDestroy{
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
        this.fetchReservation();
    }

    toastService =inject(ToastService);
    bookingService =inject(BookingService);

    reservationListing =new Array<BookedListing>();
    loading =false;

    constructor() {
      this.listenToFetchReservation();
      this.listenToCancelReservation();
    }

  private fetchReservation():void {
    this.loading=true;
    this.bookingService.getBookedListingForLandlord();
  }

  //we need to look out for the changes, hence let's implement listen method.
  private listenToFetchReservation():void{
    effect(() => {
     const bookedListingState =this.bookingService.getBookedListingForLandlordSignal();

      if (bookedListingState.status ==="OK") {
        this.loading =false;
        this.reservationListing =bookedListingState.value!;
      }
      else if(bookedListingState.status ==="ERROR"){
        this.loading =false;
        this.toastService.send({severity: "error", detail:"Error", summary:"Unable to Fetch the reservations"});
      }
    });
  };

  private listenToCancelReservation(){
    effect(() => {
      const cancelState =this.bookingService.cancelSig();

      if (cancelState.status === "OK") {
        const listingToDeleteIndex =this.reservationListing.findIndex(listing =>listing.bookingPublicId === cancelState.value);
        this.reservationListing.splice(listingToDeleteIndex,1);
        this.toastService.send({severity:"success", detail:"Success", summary:"Your reservation was successfully canceled."})
      }
      else if(cancelState.status ==="ERROR"){
        const listingToDeleteIndex =this.reservationListing.findIndex(listing =>listing.bookingPublicId === cancelState.value);
        this.reservationListing[listingToDeleteIndex].loading =false;
        this.toastService.send({severity:"error", detail:"Error", summary:"Unable to process your cancellation. Contact support if the issue persists."});
      }
    });
  }

  //this is for the user when he/she clicks the button.
  onCancelReservation(reservation :BookedListing){
    reservation.loading =true;
    this.bookingService.cancel(reservation.bookingPublicId, reservation.listingPublicId, true);
  }



}
