import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { ActivatedRoute } from '@angular/router';
import { MovieDTO } from '../movie.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapCoordinatesWithMessage } from 'src/app/utilities/map/coords.model';
import { RatingService } from 'src/app/utilities/rating.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.sass'],
})
export class MovieDetailsComponent implements OnInit {
  constructor(
    private moviesService: MoviesService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private ratingService: RatingService
  ) {}

  movie: MovieDTO;
  releaseDate: Date;
  trailerURL: SafeResourceUrl;
  coordinates: MapCoordinatesWithMessage[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.moviesService.getById(params['id']).subscribe((movie) => {
        this.movie = movie;
        this.releaseDate = new Date(movie.releaseDate);
        this.trailerURL = this.generateYoutubeURLForEmbed(movie.trailer);
        this.coordinates = movie.theaters.map(
          (theater) =>
            <MapCoordinatesWithMessage>{
              latitude: theater.latitude,
              longitude: theater.longitude,
              message: theater.name,
            }
        );
      })
    );
  }

  generateYoutubeURLForEmbed(url: string): SafeResourceUrl {
    if (!url || url === 'N/A') {
      return '';
    }
    let videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  rateMovie(rate: number) {
    this.ratingService.rate(this.movie.id, rate).subscribe(() => {
      Swal.fire('Success', 'Vote successfully submitted', 'success');
    });
  }
}
