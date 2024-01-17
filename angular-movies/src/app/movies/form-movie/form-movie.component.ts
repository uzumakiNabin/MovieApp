import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieCreationDTO, MovieDTO } from '../movie.model';
import { MultipleSelectorModel } from 'src/app/utilities/multiple-selector/multiple-selector.model';
import { GenreDTO } from 'src/app/genre/genre.model';
import { TheaterDTO } from 'src/app/theater/theater.model';
import { ActorMovieDTO } from 'src/app/actor/actor.model';

@Component({
  selector: 'app-form-movie',
  templateUrl: './form-movie.component.html',
  styleUrls: ['./form-movie.component.sass'],
})
export class FormMovieComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  form: FormGroup;

  @Output()
  onSaveMovie = new EventEmitter<MovieCreationDTO>();

  @Input()
  movieToEdit: MovieDTO | undefined;

  @Input()
  allGenres: MultipleSelectorModel[] = [];

  @Input()
  selectedGenres: MultipleSelectorModel[] = [];

  @Input()
  allTheaters: MultipleSelectorModel[] = [];

  @Input()
  selectedTheaters: MultipleSelectorModel[] = [];

  @Input()
  selectedActors: ActorMovieDTO[] = [];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      summary: '',
      inTheaters: false,
      trailer: '',
      releaseDate: '',
      poster: '',
      genreIds: [],
      theaterIds: [],
      actors: [],
    });

    if (this.movieToEdit) {
      this.form.patchValue(this.movieToEdit);
    }
  }

  saveMovie() {
    this.form
      .get('genreIds')
      ?.setValue(this.selectedGenres.map((item) => item.key));

    this.form
      .get('theaterIds')
      ?.setValue(this.selectedTheaters.map((item) => item.key));

    this.form.get('actors')?.setValue(
      this.selectedActors.map((item) => ({
        id: item.id,
        character: item.character,
      }))
    );

    this.onSaveMovie.emit(this.form.value);
  }

  imageSelected(file: File) {
    this.form.get('poster')?.setValue(file);
  }

  setSummary(text: string) {
    this.form.get('summary')?.setValue(text);
  }
}
