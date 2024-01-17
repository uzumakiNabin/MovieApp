using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
    public class ActorsController : Controller
    {
        private readonly ILogger<GenresController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IStorageServices _storageServices;

        private readonly string ContainerName = "actors";

        public ActorsController(ILogger<GenresController> logger, ApplicationDbContext context, IMapper mapper, IStorageServices storageServices)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
            _storageServices = storageServices;
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
        public async Task<ActionResult<Actor>> SaveActor([FromForm] ActorCreationDTO actorCreation)
        {
            try
            {
                Actor actor = _mapper.Map<Actor>(actorCreation);
                actor.DateOfBirth = DateTime.SpecifyKind(actor.DateOfBirth, DateTimeKind.Utc);
                if (actorCreation.Photo != null)
                {
                    actor.Photo = await _storageServices.SaveFile(ContainerName, actorCreation.Photo);
                }
                _context.Add(actor);
                await _context.SaveChangesAsync();
                return Created("", actor);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("{Id:int}")]
        public async Task<ActionResult<ActorDTO>> GetActorById(int Id)
        {
            _logger.LogInformation($"getting actor with id {Id}");
            Actor actor = await _context.Actors.FirstOrDefaultAsync(x => x.Id == Id);
            if (actor == null)
            {
                return NotFound();
            }
            return _mapper.Map<ActorDTO>(actor);
        }

        [HttpPost("searchByName")]
        public async Task<ActionResult<List<MovieActorDTO>>> GetActorByName([FromBody] string query)
        {
            _logger.LogInformation($"getting actor with name like {query}");
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<MovieActorDTO>();
            }
            return await _context.Actors
                .Where(x => x.Name.Contains(query))
                .OrderBy(x => x.Name)
                .Select(x => new MovieActorDTO { Id = x.Id, Name = x.Name, Photo = x.Photo })
                .Take(5)
                .ToListAsync();
        }

        [HttpPut("{Id:int}")]
        public async Task<ActionResult<ActorDTO>> EditActor(int Id, [FromForm] ActorCreationDTO actorCreation)
        {
            try
            {
                Actor actor = _context.Actors.FirstOrDefault(x => x.Id == Id);
                if (actor == null)
                {
                    return NotFound();
                }
                actor = _mapper.Map(actorCreation, actor);

                if (actorCreation.Photo != null)
                {
                    actor.Photo = await _storageServices.EditFile(ContainerName, actorCreation.Photo, actor.Photo);
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{Id:int}")]
        public async Task<ActionResult<ActorDTO>> DeleteActor(int Id)
        {
            try
            {
                Actor actor = await _context.Actors.FirstOrDefaultAsync<Actor>(x => x.Id == Id);
                if (actor == null)
                {
                    return NotFound();
                }
                _context.Actors.Remove(actor);
                await _storageServices.DeleteFile(ContainerName, actor.Photo);
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
