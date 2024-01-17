import { Component, OnInit } from '@angular/core';
import { MovieCreationDTO } from '../movie.model';
import { MoviesService } from '../movies.service';
import { MultipleSelectorModel } from 'src/app/utilities/multiple-selector/multiple-selector.model';
import { Router } from '@angular/router';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.sass'],
})
export class CreateMovieComponent implements OnInit {
  constructor(private moviesService: MoviesService, private router: Router) {}

  allGenres: MultipleSelectorModel[] = [];
  allTheaters: MultipleSelectorModel[] = [];
  loadingData: boolean = false;
  errors: string[] = [];

  ngOnInit(): void {
    this.loadingData = true;
    this.moviesService.getAllGenresAndTheaters().subscribe((data) => {
      this.loadingData = false;
      this.allGenres = data.genres.map(
        (item) =>
          <MultipleSelectorModel>{
            key: item.id,
            value: item.name,
          }
      );
      this.allTheaters = data.theaters.map(
        (item) =>
          <MultipleSelectorModel>{
            key: item.id,
            value: item.name,
          }
      );
    });
  }
  saveMovie(movie: MovieCreationDTO) {
    this.moviesService.create(movie).subscribe(
      (newMovie) => {
        this.router.navigate(['/movies/' + newMovie.id]);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
