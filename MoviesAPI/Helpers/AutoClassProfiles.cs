using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Migrations;
using NetTopologySuite.Geometries;
using System.Collections.Generic;

namespace MoviesAPI.Helpers
{
    public class AutoClassProfiles : Profile
    {
        public AutoClassProfiles()
        {
            CreateMap<GenreDTO, Genre>().ReverseMap();
            CreateMap<GenreCreationDTO, Genre>();

            CreateMap<ActorDTO, Actor>().ReverseMap();
            CreateMap<ActorCreationDTO, Actor>().ForMember(x => x.Photo, options => options.Ignore());

            CreateMap<Theater, TheaterDTO>()
                .ForMember(x => x.Latitude, dto => dto.MapFrom(prop => prop.Location.Y))
                .ForMember(x => x.Longitude, dto => dto.MapFrom(prop => prop.Location.X))
                .ReverseMap();

            CreateMap<MovieCreationDTO, Movie>()
                .ForMember(x => x.Poster, options => options.Ignore())
                .ForMember(x => x.MovieGenres, options => options.MapFrom(MapMoviesGenres))
                .ForMember(x => x.MovieTheaters, options => options.MapFrom(MapMoviesTheaters))
                .ForMember(x => x.MovieActors, options => options.MapFrom(MapMoviesActors));
            CreateMap<Movie, MovieDTO>()
                .ForMember(x => x.Genres, options => options.MapFrom(MapMoviesGenres))
                .ForMember(x => x.Theaters, options => options.MapFrom(MapMoviesTheaters))
                .ForMember(x => x.Actors, options => options.MapFrom(MapMoviesActors));

            CreateMap<UserDTO, IdentityUser>().ReverseMap();
        }

        public AutoClassProfiles(GeometryFactory geometryFactory)
        {
            CreateMap<TheaterCreationDTO, Theater>()
                .ForMember(dto =>
                    dto.Location, x =>
                        x.MapFrom(prop =>
                            geometryFactory.CreatePoint(new Coordinate(prop.Longitude, prop.Latitude))
                        )
                 );
        }

        private List<MovieGenre> MapMoviesGenres(MovieCreationDTO movieCreation, Movie movie)
        {
            List<MovieGenre> result = new();
            if (movieCreation != null && movieCreation.GenreIds != null)
            {
                foreach (var id in movieCreation.GenreIds)
                {
                    result.Add(new MovieGenre { GenreId = id });
                }
            }

            return result;
        }
        private List<GenreDTO> MapMoviesGenres(Movie movie, MovieDTO dto)
        {
            List<GenreDTO> result = new();
            if (movie != null && movie.MovieGenres != null)
            {
                foreach (MovieGenre movieGenre in movie.MovieGenres)
                {
                    result.Add(new GenreDTO { Id = movieGenre.GenreId, Name = movieGenre.Genre?.Name });
                }
            }

            return result;
        }

        private List<MovieTheater> MapMoviesTheaters(MovieCreationDTO movieCreation, Movie movie)
        {
            List<MovieTheater> result = new();
            if (movieCreation != null && movieCreation.TheaterIds != null)
            {
                foreach (var id in movieCreation.TheaterIds)
                {
                    result.Add(new MovieTheater { TheaterId = id });
                }
            }

            return result;
        }
        private List<TheaterDTO> MapMoviesTheaters(Movie movie, MovieDTO dto)
        {
            List<TheaterDTO> result = new();
            if (movie != null && movie.MovieTheaters != null)
            {
                foreach (MovieTheater movieTheater in movie.MovieTheaters)
                {
                    result.Add(new TheaterDTO
                    {
                        Id = movieTheater.TheaterId,
                        Name = movieTheater.Theater.Name,
                        Latitude = movieTheater.Theater.Location.Y,
                        Longitude = movieTheater.Theater.Location.X
                    });
                }
            }

            return result;
        }

        private List<MovieActor> MapMoviesActors(MovieCreationDTO movieCreation, Movie movie)
        {
            List<MovieActor> result = new();
            if (movieCreation != null && movieCreation.Actors != null)
            {
                foreach (MovieActorCreationDTO cActor in movieCreation.Actors)
                {
                    result.Add(new MovieActor { ActorId = cActor.Id, Character = cActor.Character });
                }
            }

            return result;
        }
        private List<MovieActorDTO> MapMoviesActors(Movie movie, MovieDTO dto)
        {
            List<MovieActorDTO> result = new();
            if (movie != null && movie.MovieActors != null)
            {
                foreach (MovieActor movieActor in movie.MovieActors)
                {
                    result.Add(new MovieActorDTO
                    {
                        Id = movieActor.ActorId,
                        Character = movieActor.Character,
                        Order = movieActor.Order,
                        Name = movieActor.Actor.Name,
                        Photo = movieActor.Actor.Photo
                    });
                }
            }

            return result;
        }
    }
}
