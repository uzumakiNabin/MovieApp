import { Component, OnInit } from '@angular/core';
import { MovieCreationDTO, MovieDTO } from '../movie.model';
import { MoviesService } from '../movies.service';
import { ActivatedRoute } from '@angular/router';
import { ActorMovieDTO } from 'src/app/actor/actor.model';
import { MultipleSelectorModel } from 'src/app/utilities/multiple-selector/multiple-selector.model';
import { GenresService } from 'src/app/genre/genres.service';
import { TheatersService } from 'src/app/theater/theaters.service';
import { Router } from '@angular/router';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.sass'],
})
export class EditMovieComponent implements OnInit {
  constructor(
    private moviesService: MoviesService,
    private activatedRoute: ActivatedRoute,
    private genresService: GenresService,
    private theatersService: TheatersService,
    private router: Router
  ) {}

  model: MovieDTO;

  errors: string[] = [];

  selectedGenres: MultipleSelectorModel[];
  allGenres: MultipleSelectorModel[];
  selectedTheaters: MultipleSelectorModel[];
  allTheaters: MultipleSelectorModel[];
  selectedActors: ActorMovieDTO[];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.moviesService.getById(params['id']).subscribe((movie) => {
        this.model = movie;

        //prepare selected genres for multiple selection
        this.selectedGenres = movie.genres.map(
          (genre) => <MultipleSelectorModel>{ key: genre.id, value: genre.name }
        );

        //prepare selected theaters for multiple selection
        this.selectedTheaters = movie.theaters.map(
          (theater) =>
            <MultipleSelectorModel>{ key: theater.id, value: theater.name }
        );
        this.selectedActors = movie.actors;

        //prepare all genres that are not selected
        this.genresService.getAll().subscribe((genres) => {
          this.allGenres = genres
            .filter(
              (genre) =>
                this.selectedGenres.findIndex(
                  (selGenre) => selGenre.key === genre.id
                ) === -1
            )
            .map(
              (genre) =>
                <MultipleSelectorModel>{ key: genre.id, value: genre.name }
            );
        });

        //prepare all theaters that are not selected
        this.theatersService.getAll().subscribe((theaters) => {
          this.allTheaters = theaters
            .filter(
              (theater) =>
                this.selectedTheaters.findIndex(
                  (selTheater) => selTheater.key === theater.id
                ) === -1
            )
            .map(
              (theater) =>
                <MultipleSelectorModel>{ key: theater.id, value: theater.name }
            );
        });
      })
    );
  }

  editMovie(movie: MovieCreationDTO) {
    this.moviesService.edit(this.model.id, movie).subscribe(
      () => {
        this.router.navigate(['/movies/' + this.model.id]);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
