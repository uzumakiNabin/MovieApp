using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MoviesAPI.Entities;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using MoviesAPI.DTOs;
using AutoMapper;
using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace MoviesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public class GenresController : Controller
    {
        private readonly ILogger<GenresController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GenresController(ILogger<GenresController> logger, ApplicationDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]                   //api/
        /*
        [HttpGet("all")]            //api/genres/all
        [HttpGet("/allgenres")]     //allgenres
        [ResponseCache(Duration = 60)]
        [ServiceFilter(typeof(MyActionFilter))]
        */
        [AllowAnonymous]
        public async Task<ActionResult<List<GenreDTO>>> GetAllGenres()
        {
            _logger.LogInformation("Getting all the Genres");
            List<Genre> genres = await _context.Genres.OrderBy(x => x.Name).ToListAsync();
            if (genres == null || genres.Count == 0)
            {
                return NoContent();
            }
            return _mapper.Map<List<GenreDTO>>(genres);
        }

        [HttpPost]
        public async Task<ActionResult<Genre>> SaveGenre(GenreCreationDTO genreCreation)
        {
            try
            {
                Genre genre = _mapper.Map<Genre>(genreCreation);
                _context.Add(genre);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("{Id:int}")]
        public async Task<ActionResult<GenreDTO>> GetGenreById(int Id)
        {
            _logger.LogInformation($"Getting genre with id {Id}");
            Genre genre = await _context.Genres.FirstOrDefaultAsync(x => x.Id == Id);
            if (genre == null)
            {
                return NotFound();
            }
            return _mapper.Map<GenreDTO>(genre);
        }

        [HttpPut("{Id:int}")]
        public async Task<ActionResult<GenreDTO>> EditGenre(int Id, [FromBody] GenreCreationDTO genreCreation)
        {
            try
            {
                Genre genre = _mapper.Map<Genre>(genreCreation);
                genre.Id = Id;
                _context.Entry(genre).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{Id:int}")]
        public async Task<ActionResult<GenreDTO>> DeleteGenre(int Id)
        {
            try
            {
                Genre genre = await _context.Genres.FirstOrDefaultAsync<Genre>(x => x.Id == Id);
                if(genre == null)
                {
                    return NotFound();
                }
                _context.Genres.Remove(genre);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
