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
    public class TheatersController : Controller
    {
        private readonly ILogger<GenresController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TheatersController(ILogger<GenresController> logger, ApplicationDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<TheaterDTO>>> GetAll()
        {
            List<Theater> theaters = await _context.Theaters.OrderBy(x => x.Name).ToListAsync();
            if (theaters == null || theaters.Count == 0)
            {
                return NoContent();
            }
            return _mapper.Map<List<TheaterDTO>>(theaters);
        }

        [HttpPost]
        public async Task<ActionResult<Theater>> SaveTheater(TheaterCreationDTO theaterCreation)
        {
            try
            {
                Theater theater = _mapper.Map<Theater>(theaterCreation);
                _context.Add(theater);
                await _context.SaveChangesAsync();
                TheaterDTO theaterDTO = _mapper.Map<TheaterDTO>(theater);
                return Created("", theaterDTO);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("{Id:int}")]
        public async Task<ActionResult<TheaterDTO>> GetTheaterById(int Id)
        {
            _logger.LogInformation($"getting theater with id {Id}");
            Theater theater = await _context.Theaters.FirstOrDefaultAsync(x => x.Id == Id);
            if (theater == null)
            {
                return NotFound();
            }
            return _mapper.Map<TheaterDTO>(theater);
        }

        [HttpPut("{Id:int}")]
        public async Task<ActionResult<TheaterDTO>> EditTheater(int Id, TheaterCreationDTO theaterCreation)
        {
            try
            {
                Theater theater = _context.Theaters.FirstOrDefault(x => x.Id == Id);
                if (theater == null)
                {
                    return NotFound();
                }
                theater = _mapper.Map(theaterCreation, theater);

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{Id:int}")]
        public async Task<ActionResult<TheaterDTO>> DeleteTheater(int Id)
        {
            try
            {
                Theater theater = await _context.Theaters.FirstOrDefaultAsync<Theater>(x => x.Id == Id);
                if (theater == null)
                {
                    return NotFound();
                }
                _context.Theaters.Remove(theater);
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
