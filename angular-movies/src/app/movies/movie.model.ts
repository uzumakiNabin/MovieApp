import { GenreDTO } from '../genre/genre.model';
import { TheaterDTO } from '../theater/theater.model';
import { ActorMovieDTO } from '../actor/actor.model';

export interface MovieCreationDTO {
  title: string;
  summary: string;
  inTheaters: boolean;
  trailer: string;
  releaseDate: Date;
  poster: File;
  genreIds: string[];
  theaterIds: string[];
  actors: ActorMovieDTO[];
}

export interface MovieDTO {
  id: number;
  title: string;
  summary: string;
  inTheaters: boolean;
  trailer: string;
  releaseDate: Date;
  poster: string;
  genres: GenreDTO[];
  theaters: TheaterDTO[];
  actors: ActorMovieDTO[];
  averageVote: number;
  userVote: number;
}

export interface GenresAndTheatersDTO {
  genres: GenreDTO[];
  theaters: TheaterDTO[];
}

export interface HomeDTO {
  inTheaters: MovieDTO[];
  upcomingReleases: MovieDTO[];
}
