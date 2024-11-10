import {Component, inject} from '@angular/core';
import {Step} from '../../landlord/properties-create/step.model';
import {Search} from './search.model';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';
import {BookedDatesDTOFromServer} from '../model/booking.model';
import {NewListingInfo} from '../../landlord/model/listing.model';
import dayjs from 'dayjs';
import {
  LocationMapComponent
} from '../../landlord/properties-create/step/location-step/location-map/location-map.component';
import {FooterStepComponent} from '../../shared/footer-step/footer-step.component';
import {SearchDateComponent} from './search-date/search-date.component';
import {InfoStepComponent} from '../../landlord/properties-create/step/info-step/info-step.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    LocationMapComponent,
    FooterStepComponent,
    SearchDateComponent,
    InfoStepComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  //let's define elements that will be used in the hierarchy
  LOCATION = "location";
  DATES = "dates";
  GUESTS = "guests";

  //let's define hierarchy
  steps: Step[] = [
    {
      id: this.LOCATION,
      idNext: this.DATES,
      idPrevious: null,
      isValid: false,
    },

    {
      id: this.DATES,
      idNext: this.GUESTS,
      idPrevious: this.LOCATION,
      isValid: false,
    },

    {
      id: this.GUESTS,
      idNext: null,
      idPrevious: this.DATES,
      isValid: false,
    },
  ];

  currentStep = this.steps[0];
  searchParams: Search = {
    dates: {
      startDate: new Date(),
      endDate: new Date(),
    },

    infos: {
      guests: {value: 0},
      bedrooms: {value: 0},
      beds: {value: 0},
      baths: {value: 0}
    },

    location: ""

  };


  loadingSearch = false;
  router = inject(Router);
  dialogDynamicRef = inject(DynamicDialogRef);

  previousStep() {

    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  nextStep() {

    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  //don't forget to control them if they are valid or not.
  isAllStepsValid() {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onValidityChange(validity: boolean): void {
    this.currentStep.isValid = validity;
  }

  //since the first element is location, we need to react when it changes, and validity.
  onNewLocation(newLocation: string): void {
    this.currentStep.isValid = true;
    this.searchParams.location = newLocation; // we are updating search parameter with a new location.
  }

  onNewDate(newDates: BookedDatesDTOFromServer) {
    this.searchParams.dates = newDates;
  }

  onInfoChange(newInfo: NewListingInfo): void {
    this.searchParams.infos = newInfo;
  }

  search() {
    this.loadingSearch = false;

    //we need to route home, and pass all the parameters.
    this.router.navigate(["/"],
      {
        queryParams: {
          location: this.searchParams.location,
          bedrooms: this.searchParams.infos.bedrooms.value,
          beds: this.searchParams.infos.beds.value,
          baths: this.searchParams.infos.baths.value,
          guests: this.searchParams.infos.guests.value,
          startDate: dayjs(this.searchParams.dates.startDate).format("DD-MMMM-YYYY"),
          endDate: dayjs(this.searchParams.dates.endDate).format("DD-MMMM-YYYY"),
        }
      });

    this.dialogDynamicRef.close();
  }





}
