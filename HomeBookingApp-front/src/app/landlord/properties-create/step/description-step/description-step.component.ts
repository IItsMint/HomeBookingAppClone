import {Component, EventEmitter, input, Output, ViewChild, viewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import { Description } from '../../../model/listing.model';
import {InputTextareaModule} from 'primeng/inputtextarea';

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [FormsModule,
    InputTextModule, InputTextareaModule,
  ],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss'
})
export class DescriptionStepComponent {

  description = input.required<Description>();
  @Output()
  descriptionChange=new EventEmitter<Description>();
  @Output()
  stepValidityChange=new EventEmitter<boolean>();

  //We used View Child to control of the form’s state and validation within the component.
  @ViewChild("formDescription")
  formDescription: NgForm|undefined;

  onTitleChange(newTitle:string){
    this.description().title={value:newTitle};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newDescription:string){
    this.description().description={value:newDescription};
    this.descriptionChange.emit(this.description());
    this.stepValidityChange.emit(this.validateForm());
  }


  private validateForm():boolean {
    if(this.formDescription){
      return this.formDescription?.valid!;
    }
    else{
      return false;
    }
  }
}