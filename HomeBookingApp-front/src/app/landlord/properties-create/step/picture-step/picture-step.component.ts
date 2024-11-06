import {Component, EventEmitter, input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {InputTextModule} from 'primeng/inputtext';
import {NewListingPicture} from '../../../model/picture.model';
import {retry} from 'rxjs';

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [FormsModule,
    ButtonModule,
    FontAwesomeModule,
    InputTextModule,
  ],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent {

  pictures = input.required<Array<NewListingPicture>>();

  //if we don't make the output annotation, we cant use these in html or other files.
  @Output()
  picturesChange = new EventEmitter<Array<NewListingPicture>>();
  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget|null){
    const picturesFileList = this.extractFileFromTarget(target);

    if(picturesFileList !== null){
      for(let x = 0; x<picturesFileList.length;x++){
       const picture = picturesFileList.item(x);
        if (picture !== null) {
          const displayPicture: NewListingPicture={
            file: picture,
            urlDisplay: URL.createObjectURL(picture),
          }
          //we need to push the created object above, into signal.
          this.pictures().push(displayPicture);
        }
      }
      //after that we need to notify the parent component for change.
      this.picturesChange.emit(this.pictures());
      this.validatePictures();
    }

  }

  private validatePictures() {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true);
    }
    else{
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewListingPicture) {

    //to delete specific image, first we need to find its index.
    const indexToDelete = this.pictures().findIndex(picture =>
      picture.file.name === pictureToDelete.file.name);

    this.pictures().splice(indexToDelete, 1);
    this.validatePictures();
  }


}
