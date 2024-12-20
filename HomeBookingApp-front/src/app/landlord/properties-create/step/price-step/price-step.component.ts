import {Component, EventEmitter, input, Output, ViewChild, viewChild} from '@angular/core';
import {Form, FormsModule, NgForm} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {InputTextModule} from 'primeng/inputtext';
import {PriceVo} from '../../../model/listing-vo.model';

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [FormsModule,
  FontAwesomeModule,
  InputTextModule],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent {

  price=input.required<PriceVo>();

  @Output()
  priceChange=new EventEmitter<PriceVo>();

  @Output()
  stepValidityChange=new EventEmitter<boolean>();

  @ViewChild("formPrice")
  formPrice:NgForm|undefined;

  onPriceChange(newPrice: number) {
    this.priceChange.emit({value: newPrice});
    this.stepValidityChange.emit(this.validateForm());
  }


  private validateForm() {
    if(this.formPrice){
      return this.formPrice?.valid!;
    }
    else{
      return false;
    }
  }

}
