import { Component, OnInit } from '@angular/core';
import { GenreCreationDTO, GenreDTO } from '../genre.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GenresService } from '../genres.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-edit-genre',
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.sass'],
})
export class EditGenreComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private genreService: GenresService
  ) {}

  errors: string[] = [];
  model: GenreDTO;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) =>
      this.genreService
        .getById(param['id'])
        .subscribe((genre) => (this.model = genre))
    );
  }

  editGenre(genre: GenreCreationDTO) {
    this.genreService.edit(this.model.id, genre).subscribe(
      () => {
        this.router.navigate(['/genres']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
