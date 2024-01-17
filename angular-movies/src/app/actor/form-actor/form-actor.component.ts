import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActorCreationDTO, ActorDTO } from '../actor.model';

@Component({
  selector: 'app-form-actor',
  templateUrl: './form-actor.component.html',
  styleUrls: ['./form-actor.component.sass'],
})
export class FormActorComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}
  form: FormGroup;

  @Input()
  actorToEdit: ActorDTO | undefined;

  @Output()
  onSaveActor = new EventEmitter<ActorCreationDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      biography: '',
      dateOfBirth: '',
      photo: '',
    });

    if (this.actorToEdit) {
      this.form.patchValue(this.actorToEdit);
    }
  }

  saveActor() {
    this.onSaveActor.emit(this.form.value);
  }

  onImageSelected(file: File) {
    this.form.get('photo')?.setValue(file);
  }

  setBiography(content: string) {
    this.form.get('biography')?.setValue(content);
  }
}
