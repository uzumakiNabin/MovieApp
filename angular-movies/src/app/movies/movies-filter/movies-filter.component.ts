import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MoviesService } from '../movies.service';
import { GenresService } from 'src/app/genre/genres.service';
import { GenreDTO } from 'src/app/genre/genre.model';
import { MovieDTO } from '../movie.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-movies-filter',
  templateUrl: './movies-filter.component.html',
  styleUrls: ['./movies-filter.component.sass'],
})
export class MoviesFilterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private moviesService: MoviesService,
    private genresService: GenresService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  form: FormGroup;

  movies: MovieDTO[] = [
    // {
    //   name: 'Spider-man',
    //   releaseDate: new Date(),
    //   price: 199.99,
    //   poster:
    //     'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UY720_.jpg',
    // },
    // {
    //   name: 'Avengers',
    //   releaseDate: new Date(),
    //   price: 299.99,
    //   poster:
    //     'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX800_.jpg',
    // },
    // {
    //   name: 'The Marvels',
    //   releaseDate: new Date('2023-11-10'),
    //   price: 199.99,
    //   poster:
    //     'https://m.media-amazon.com/images/M/MV5BM2U2YWU5NWMtOGI2Ni00MGMwLWFkNjItMjgyZWMxNjllNTMzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UY720_.jpg 486w',
    // },
    // {
    //   name: 'Deadpool 3',
    //   releaseDate: new Date('2025-02-04'),
    //   price: 299.99,
    //   poster:
    //     'https://m.media-amazon.com/images/M/MV5BMGI0ZDg3Y2EtYzIyYi00MGYwLThlOGItNWQ5MjMxNDU2ODUzXkEyXkFqcGdeQXVyMTEwMTcxOTAx._V1_FMjpg_UX737_.jpg',
    // },
  ];
  genres: GenreDTO[] = [];
  currentPage = 1;
  recordsPerPage = 10;
  initialFormValues: any;
  totalAmountOfRecords: number;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      genreId: 0,
      upcomingRelease: false,
      inTheater: false,
    });

    this.initialFormValues = this.form.value;

    this.ReadParametersFromURL();

    this.genresService.getAll().subscribe((genres) => {
      this.genres = genres;
      this.form.valueChanges.subscribe((values) => {
        this.filterMovies(values);
        this.WriteParametersInURL();
      });
    });
  }

  filterMovies(values: any) {
    values.page = this.currentPage;
    values.recordsPerPage = this.recordsPerPage;
    this.moviesService.filter(values).subscribe((response) => {
      this.movies = response.body ?? [];
      this.totalAmountOfRecords = Number(
        response.headers.get('totalAmountOfRecords')
      );
    });
  }

  resetForm() {
    this.form.patchValue(this.initialFormValues);
  }

  private WriteParametersInURL() {
    const queryStrings = [];
    const formValues = this.form.value;
    if (formValues.title) {
      queryStrings.push(`title=${formValues.title}`);
    }

    if (formValues.genreId != '0') {
      queryStrings.push(`genreId=${formValues.genreId}`);
    }

    if (formValues.upcomingRelease) {
      queryStrings.push(`upcomingRelease=${formValues.upcomingRelease}`);
    }

    if (formValues.inTheater) {
      queryStrings.push(`inTheater=${formValues.inTheater}`);
    }

    queryStrings.push(`page=${this.currentPage}`);
    queryStrings.push(`recordsPerPage=${this.recordsPerPage}`);

    this.location.replaceState('movies/filter', queryStrings.join('&'));
  }

  private ReadParametersFromURL() {
    this.activatedRoute.queryParams.subscribe((params) => {
      let obj: any = {};

      if (params['title']) {
        obj.title = params['title'];
      }

      if (params['genreId']) {
        obj.genreId = Number(params['genreId']);
      }

      if (params['upcomingRelease']) {
        obj.upcomingRelease = params['upcomingRelease'];
      }

      if (params['inTheater']) {
        obj.inTheater = params['inTheater'];
      }

      if (params['page']) {
        this.currentPage = params['page'];
      }

      if (params['recordsPerPage']) {
        this.recordsPerPage = params['recordsPerPage'];
      }

      this.form.patchValue(obj);
    });
  }

  paginatorUpdate(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
    this.WriteParametersInURL();
    this.filterMovies(this.form.value);
  }

  handleDelete() {
    this.filterMovies(this.form.value);
  }
}
