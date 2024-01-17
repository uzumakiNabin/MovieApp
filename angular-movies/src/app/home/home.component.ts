import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies/movies.service';
import { HomeDTO } from '../movies/movie.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  constructor(private moviesService: MoviesService) {}

  homeMovies: HomeDTO = { upcomingReleases: [], inTheaters: [] };

  ngOnInit(): void {
    this.loadData();
    // setTimeout(() => {
    //   this.moviesInTheatre = [
    //     {
    //       name: 'Spider-man',
    //       releaseDate: new Date(),
    //       price: 199.99,
    //       poster:
    //         'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UY720_.jpg',
    //     },
    //     {
    //       name: 'Avengers',
    //       releaseDate: new Date(),
    //       price: 299.99,
    //       poster:
    //         'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX800_.jpg',
    //     },
    //   ];
    // }, 2000);
    // setTimeout(() => {
    //   this.upcomingMovies = [
    //     {
    //       name: 'The Marvels',
    //       releaseDate: new Date('2023-11-10'),
    //       price: 199.99,
    //       poster:
    //         'https://m.media-amazon.com/images/M/MV5BM2U2YWU5NWMtOGI2Ni00MGMwLWFkNjItMjgyZWMxNjllNTMzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UY720_.jpg 486w',
    //     },
    //     {
    //       name: 'Deadpool 3',
    //       releaseDate: new Date('2025-02-04'),
    //       price: 299.99,
    //       poster:
    //         'https://m.media-amazon.com/images/M/MV5BMGI0ZDg3Y2EtYzIyYi00MGYwLThlOGItNWQ5MjMxNDU2ODUzXkEyXkFqcGdeQXVyMTEwMTcxOTAx._V1_FMjpg_UX737_.jpg',
    //     },
    //   ];
    // }, 2000);
  }

  handleRating(rate: number) {
    alert(`The user selected ${rate}`);
  }

  loadData() {
    this.moviesService
      .getHomePageMovies()
      .subscribe((data) => (this.homeMovies = data));
  }

  handleDelete() {
    this.loadData();
  }
}
