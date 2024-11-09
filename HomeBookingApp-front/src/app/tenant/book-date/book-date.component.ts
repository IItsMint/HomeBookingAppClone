import {Component, effect, inject, input, OnDestroy, OnInit} from '@angular/core';
import { Listing } from '../../landlord/model/listing.model';
import {ToastService} from '../../layout/toast.service';
import {BookingService} from '../service/booking.service';
import {AuthService} from '../../core/auth/auth.service';
import {Router} from '@angular/router';
import dayjs from 'dayjs';
import {BookedDatesDTOFromClient, CreateBooking} from '../model/booking.model';
import {FormsModule} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {CalendarModule} from 'primeng/calendar';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-book-date',
  standalone: true,
  imports: [FormsModule,
  MessageModule,
  CalendarModule,
  CurrencyPipe,
  ],
  templateUrl: './book-date.component.html',
  styleUrl: './book-date.component.scss'
})
export class BookDateComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {
      this.bookingService.resetCreateBooking();
  }
  ngOnInit(): void {
      this.bookingService.checkAvailability(this.listingPublicId());
  }
  listing=input.required<Listing>();
  listingPublicId=input.required<string>();

  toastService =inject(ToastService);
  authService=inject(AuthService);
  bookingService=inject(BookingService);
  router=inject(Router);

  //let's initialize some values.
  bookingDate=new Array<Date>();
  totalPrice=0;
  minDate=new Date();//initialized as today's date. Hence, user can not make reservation for the past.
  bookedDate=new Array<Date>();

  constructor() {
    this.listenToCheckAvailableDate();
    this.listenToCreateBooking();
  }

  validateMakeBooking() {
    return this.authService.isAuthenticated() &&this.bookingDate.length === 2 &&this.bookingDate[0] !==null
      &&this.bookingDate[1] !==null &&this.bookingDate[0].getDate() !==this.bookingDate[1].getDate();
  }

  onDateChange(newBookingDate: Array<Date>) {
    this.bookingDate = newBookingDate;
    if (this.validateMakeBooking()) {
      const startBookingDateDayJS = dayjs(newBookingDate[0]);
      const endBookingDateDayJS = dayjs(newBookingDate[1]);
      this.totalPrice = endBookingDateDayJS.diff(startBookingDateDayJS, "days") * this.listing().price.value;
    } else {
      this.totalPrice = 0;
    }
  }


  //this is for when user presses the reservation button we will call this method.
  onNewBooking() {
    const newBooking: CreateBooking = {
      listingPublicId: this.listingPublicId(),
      startDate: this.bookingDate[0],
      endDate: this.bookingDate[1],
    }
    this.bookingService.create(newBooking);
  };


  private listenToCheckAvailableDate() {
    effect(() => {
      const checkAvailabilityState = this.bookingService.checkAvailabilitySignal();

      if (checkAvailabilityState.status === "OK") {
        this.bookedDate = this.mapBookedDatesToDate(checkAvailabilityState.value!);//we have to make some transformation hence we implemented map.
      }
      else if (checkAvailabilityState.status === "ERROR") {
        this.toastService.send({severity: "error", summary: "Error",detail: "Sorry, we're having trouble fetching the blocked dates. Please try again later."});
      }
    })
  };


  private mapBookedDatesToDate(bookedDatesDTOFromClients:Array<BookedDatesDTOFromClient>):Array<Date> {
    const bookedDates =new Array<Date>();

    for(let bookedDate of bookedDatesDTOFromClients){
      bookedDates.push(...this.getDatesInRange(bookedDate));
    }

    return bookedDates;
  };

  private getDatesInRange(bookedDate:BookedDatesDTOFromClient) {
    const date =new Array<Date>();
    let currentDate =bookedDate.startDate;

    while (currentDate <=bookedDate.endDate) {
      date.push(currentDate.toDate());
      currentDate =currentDate.add(1, "day");
    }

    return date;
  };

  private listenToCreateBooking() {
    effect(() => {
      const createBookingState = this.bookingService.createBookingSignal();

      if (createBookingState.status === "OK") {
        this.toastService.send({severity: "success", detail: "Awesome! Your booking has been successfully created. See you soon!"});
        this.router.navigate(['/booking']);
      }
      else if (createBookingState.status === "ERROR") {
        this.toastService.send({severity: "error", detail: "Oops! Something went wrong while creating your booking. Please try again..."});
      }

    })
  };


}
