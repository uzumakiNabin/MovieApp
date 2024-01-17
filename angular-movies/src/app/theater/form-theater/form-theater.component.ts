import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstLetterUppercase } from 'src/app/validators/firstLetterUppercase';
import { TheaterCreationDTO } from '../theater.model';
import {
  MapCoordinates,
  MapCoordinatesWithMessage,
} from 'src/app/utilities/map/coords.model';

@Component({
  selector: 'app-form-theater',
  templateUrl: './form-theater.component.html',
  styleUrls: ['./form-theater.component.sass'],
})
export class FormTheaterComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  @Input()
  model: TheaterCreationDTO;

  form: FormGroup;

  @Output()
  onSaveTheater: EventEmitter<TheaterCreationDTO> =
    new EventEmitter<TheaterCreationDTO>();

  initialCoordinates: MapCoordinatesWithMessage[] = [];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            firstLetterUppercase(),
          ],
        },
      ],
      latitude: ['', { validators: [Validators.required] }],
      longitude: ['', { validators: [Validators.required] }],
    });

    if (this.model) {
      this.form.patchValue(this.model);
      this.initialCoordinates.push({
        latitude: this.model.latitude,
        longitude: this.model.longitude,
      });
    }
  }

  saveTheater() {
    this.onSaveTheater.emit(this.form.value);
  }

  getErrorMessageFieldName() {
    const field = this.form.get('name');
    if (field?.hasError('required')) {
      return 'The name field is required';
    }

    if (field?.hasError('minlength')) {
      return 'The name must be atleast 3 characters long';
    }

    if (field?.hasError('firstLetterUppercase')) {
      return field.getError('firstLetterUppercase').message;
    }

    return '';
  }

  setMapCoords(coords: MapCoordinates) {
    this.form.get('latitude')?.setValue(coords.latitude);
    this.form.get('longitude')?.setValue(coords.longitude);
  }
}
