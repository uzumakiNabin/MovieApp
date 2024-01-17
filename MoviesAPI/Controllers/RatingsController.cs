using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace MoviesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : Controller
    {
       private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        public RatingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> RateMovie([FromBody] RatingDTO ratingDto)
        {
            try
            {
                var email = User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                IdentityUser? user = await _userManager.FindByEmailAsync(email);
                string? userId = user?.Id;

                Rating? currentRate = await _context.Ratings.FirstOrDefaultAsync(x => x.MovieId == ratingDto.MovieId && x.UserId == userId);

                if (currentRate == null)
                {
                    _context.Ratings.Add(new Rating()
                    {
                        MovieId = ratingDto.MovieId,
                        UserId = userId,
                        Rate = ratingDto.Rate,
                    });
                }
                else
                {
                    currentRate.Rate = ratingDto.Rate;
                }

                _context.SaveChanges();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
