import { Component, Input } from '@angular/core';
import { GenreCreationDTO } from '../genre.model';
import { Router } from '@angular/router';
import { GenresService } from '../genres.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-create-genre',
  templateUrl: './create-genre.component.html',
  styleUrls: ['./create-genre.component.sass'],
})
export class CreateGenreComponent {
  constructor(private router: Router, private genreService: GenresService) {}

  errors: string[] = [];

  saveGenre(genre: GenreCreationDTO) {
    this.genreService.create(genre).subscribe(
      () => {
        this.router.navigate(['/genres']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
