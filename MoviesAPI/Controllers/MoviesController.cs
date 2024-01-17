using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public class MoviesController : Controller
    {
        private readonly ILogger<GenresController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IStorageServices _storageServices;
        private readonly UserManager<IdentityUser> _userManager;

        private readonly string ContainerName = "movies";

        public MoviesController(ILogger<GenresController> logger, 
            ApplicationDbContext context, 
            IMapper mapper, 
            IStorageServices storageServices, 
            UserManager<IdentityUser> userManager)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
            _storageServices = storageServices;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<ActorDTO>>> GetAll([FromQuery] PaginationDTO pagination)
        {

            var queryable = _context.Actors.AsQueryable();
            await HttpContext.InsertPaginationParameterInHeader(queryable);
            List<Actor> actors = await queryable.OrderBy(x => x.Name).Paginate(pagination).ToListAsync();
            if (actors == null || actors.Count == 0)
            {
                return NoContent();
            }
            return _mapper.Map<List<ActorDTO>>(actors);
        }

        [HttpPost]
        public async Task<ActionResult<MovieDTO>> SaveMovie([FromForm] MovieCreationDTO movieCreation)
        {
            try
            {
                Movie movie = _mapper.Map<Movie>(movieCreation);
                movie.ReleaseDate = DateTime.SpecifyKind(movie.ReleaseDate, DateTimeKind.Utc);
                if (movieCreation.Poster != null)
                {
                    movie.Poster = await _storageServices.SaveFile(ContainerName, movieCreation.Poster);
                }
                AnnotateActorsOrder(movie);
                _context.Add(movie);
                await _context.SaveChangesAsync();
                return Created("", _mapper.Map<MovieDTO>(movie));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("genresntheaters")]
        public async Task<ActionResult<GenresAndTheatersDTO>> GetGenresAndTheaters()
        {
            _logger.LogInformation("Getting all genres and theaters list");
            return new GenresAndTheatersDTO()
            {
                Genres = _mapper.Map<List<GenreDTO>>(await _context.Genres.OrderBy(x => x.Name).ToListAsync()),
                Theaters = _mapper.Map<List<TheaterDTO>>(await _context.Theaters.OrderBy(x => x.Name).ToListAsync()),
            };
        }

        [HttpGet("{Id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<MovieDTO>> GetMovieById(int Id)
        {
            _logger.LogInformation($"getting movie with id {Id}");
            Movie? movie = await _context.Movies
                .Include(x => x.MovieGenres).ThenInclude(x => x.Genre)
                .Include(x => x.MovieTheaters).ThenInclude(x => x.Theater)
                .Include(x => x.MovieActors).ThenInclude(x => x.Actor)
                .FirstOrDefaultAsync(x => x.Id == Id);

            if (movie == null)
            {
                return NotFound();
            }

            MovieDTO dto = _mapper.Map<MovieDTO>(movie);

            if(await _context.Ratings.AnyAsync(x => x.MovieId == Id)) {
                dto.AverageVote = await _context.Ratings.Where(x => x.MovieId == Id).AverageAsync(x => x.Rate);

                if (HttpContext.User.Identity != null && HttpContext.User.Identity.IsAuthenticated)
                {
                    var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                    IdentityUser? user = await _userManager.FindByEmailAsync(email);
                    string? userId = user?.Id;

                    Rating? userCurrentRate = await _context.Ratings.FirstOrDefaultAsync(x => x.MovieId == Id && x.UserId == userId);
                    if (userCurrentRate != null)
                    {
                        dto.UserVote = userCurrentRate.Rate;
                    }
                }
            }

            dto.Actors = dto.Actors.OrderBy(x => x.Order).ToList();
            return dto;
        }

        [HttpGet("home")]
        [AllowAnonymous]
        public async Task<ActionResult<HomeDTO>> GetHome()
        {
            int top = 6;
            DateTime today = DateTime.Today;
            today = DateTime.SpecifyKind(today, DateTimeKind.Utc);

            return new HomeDTO()
            {
                UpcomingReleases = _mapper.Map<List<MovieDTO>>(
                                        await _context.Movies
                                        .Where(x => x.ReleaseDate > today)
                                        .OrderBy(x => x.ReleaseDate)
                                        .Take(top)
                                        .ToListAsync()),
                InTheaters = _mapper.Map<List<MovieDTO>>(
                                await _context.Movies
                                .Where(x => x.InTheaters)
                                .OrderBy(x => x.ReleaseDate)
                                .Take(top)
                                .ToListAsync()),
            };
        }

        [HttpPut("{Id:int}")]
        public async Task<ActionResult<ActorDTO>> EditMovie(int Id, [FromForm] MovieCreationDTO movieCreation)
        {
            try
            {
                Movie? movie = _context.Movies
                    .Include(x => x.MovieGenres)
                    .Include(x => x.MovieTheaters)
                    .Include(x => x.MovieActors)
                    .FirstOrDefault(x => x.Id == Id);
                if (movie == null)
                {
                    return NotFound();
                }
                movie = _mapper.Map(movieCreation, movie);
                movie.Id = Id;

                if (movieCreation.Poster != null)
                {
                    movie.Poster = await _storageServices.EditFile(ContainerName, movieCreation.Poster, movie.Poster);
                }

                AnnotateActorsOrder(movie);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{Id:int}")]
        public async Task<ActionResult> DeleteMovie(int Id)
        {
            try
            {
                Movie? movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == Id);
                if (movie == null)
                {
                    return NotFound();
                }
                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();
                await _storageServices.DeleteFile(ContainerName, movie.Poster);
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MovieDTO>>> Filter([FromQuery] FilterMoviesDTO filterMovies)
        {
            var moviesQueryable = _context.Movies.AsQueryable();
            if (!string.IsNullOrEmpty(filterMovies.Title))
            {
                moviesQueryable = moviesQueryable.Where(x => x.Title.Contains(filterMovies.Title));
            }

            if (filterMovies.InTheater)
            {
                moviesQueryable = moviesQueryable.Where(x => x.InTheaters);
            }

            if (filterMovies.UpcomingRelease)
            {
                DateTime today = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Utc);
                moviesQueryable = moviesQueryable.Where(x => x.ReleaseDate > today);
            }

            if (filterMovies.GenreId != 0)
            {
                moviesQueryable = moviesQueryable
                    .Where(x => x.MovieGenres.Select(y => y.GenreId)
                                            .Contains(filterMovies.GenreId)
                     );
            }

            await HttpContext.InsertPaginationParameterInHeader(moviesQueryable);
            return _mapper.Map<List<MovieDTO>>(moviesQueryable.OrderBy(x => x.Title).Paginate(filterMovies.Pagination));
        }

        private void AnnotateActorsOrder(Movie movie)
        {
            if (movie.MovieActors != null)
            {
                int i = 0;
                foreach (MovieActor actor in movie.MovieActors)
                {
                    actor.Order = i++;
                }
            }
        }
    }
}
