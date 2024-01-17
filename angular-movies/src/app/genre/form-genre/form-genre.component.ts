import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstLetterUppercase } from 'src/app/validators/firstLetterUppercase';
import { GenreCreationDTO, GenreDTO } from '../genre.model';

@Component({
  selector: 'app-form-genre',
  templateUrl: './form-genre.component.html',
  styleUrls: ['./form-genre.component.sass'],
})
export class FormGenreComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  form: FormGroup;

  @Input()
  genreToEdit: GenreDTO;

  @Output()
  onSaveGenre: EventEmitter<GenreCreationDTO> =
    new EventEmitter<GenreCreationDTO>();

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
    });

    if (this.genreToEdit) {
      this.form.patchValue(this.genreToEdit);
    }
  }

  saveGenre() {
    this.onSaveGenre.emit(this.form.value);
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
}
