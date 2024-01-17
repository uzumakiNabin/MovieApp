using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MoviesAPI.DTOs;
using MoviesAPI.Helpers;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MoviesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly EmailServices _emailServices;

        public AccountsController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IMapper mapper,
            EmailServices emailServices
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
            _emailServices = emailServices;
        }

        [HttpPost("create")]
        public async Task<ActionResult<AuthenticationResponseDTO>> CreateUser([FromBody] UserCredentialsDTO userCredentials)
        {
            IdentityUser user = new()
            {
                UserName = userCredentials.Email,
                Email = userCredentials.Email
            };
            var result = await _userManager.CreateAsync(user, userCredentials.Password);
            if (result.Succeeded)
            {
                if (await SendConfirmationEmail(new IdentityUser() { Email = userCredentials.Email, UserName = userCredentials.Email }))
                {
                    return await BuildToken(userCredentials);
                }
                return BadRequest();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpGet("confirmEmail")]
        public async Task<ActionResult> ConfirmEmail(string token, string email)
        {
            if(token == null || email == null)
            {
                return BadRequest();
            }
            IdentityUser? user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest();
            }
            byte[] decodedToken = WebEncoders.Base64UrlDecode(token);
            string emailConfirmationToken = Encoding.UTF8.GetString(decodedToken);
            IdentityResult result = await _userManager.ConfirmEmailAsync(user, emailConfirmationToken);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResponseDTO>> Login([FromBody] UserCredentialsDTO userCredentials)
        {
            var result = await _signInManager.PasswordSignInAsync(userCredentials.Email, userCredentials.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return await BuildToken(userCredentials);
            }
            else
            {
                return BadRequest("Incorrect login");
            }
        }

        [HttpGet("listUsers")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<List<UserDTO>>> GetUsers([FromQuery] PaginationDTO pagination)
        {
            IQueryable<IdentityUser> queryable = _context.Users.AsQueryable();
            await HttpContext.InsertPaginationParameterInHeader(queryable);
            List<IdentityUser> users = await queryable.OrderBy(x => x.Email).Paginate(pagination).ToListAsync();

            return _mapper.Map<List<UserDTO>>(users);
        }

        [HttpPost("addRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult> AddRole([FromBody] ManageRoleDTO roleDTO)
        {
            IdentityUser? user = await _userManager.FindByIdAsync(roleDTO.UserId);
            if (user != null)
            {
                await _userManager.AddClaimAsync(user, new Claim("role", roleDTO.Role));
                return NoContent();
            }
            else
            {
                return NotFound("Invalid User");
            }
        }

        [HttpPost("removeRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult> RemoveRole([FromBody] ManageRoleDTO roleDTO)
        {
            IdentityUser? user = await _userManager.FindByIdAsync(roleDTO.UserId);
            if (user != null)
            {
                await _userManager.RemoveClaimAsync(user, new Claim("role", roleDTO.Role));
                return NoContent();
            }
            else
            {
                return NotFound("Invalid User");
            }
        }

        private async Task<AuthenticationResponseDTO> BuildToken(UserCredentialsDTO credentials)
        {
            try
            {
                List<Claim> claims = new()
                {
                new Claim("email", credentials.Email)
                };

                IdentityUser? user = await _userManager.FindByEmailAsync(credentials.Email);
                if (user != null)
                {
                    var userClaims = await _userManager.GetClaimsAsync(user);
                    claims.AddRange(userClaims);
                }

                SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_configuration["keyjwt"]));
                SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);
                DateTime expirtyDate = DateTime.UtcNow.AddDays(2);
                JwtSecurityToken token = new(issuer: null, audience: null, claims: claims, expires: expirtyDate, signingCredentials: creds);

                return new AuthenticationResponseDTO
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    ExpiryDate = expirtyDate,
                };
            }
            catch
            {
                throw;
            }
        }

        private async Task<bool> SendConfirmationEmail(IdentityUser user)
        {
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            string url = $"{HttpContext?.Request.Scheme}://{HttpContext?.Request.Host}/{_configuration["Email:ConfirmationEmailPath"]}?token={token}&email={user.Email}";

            string body = $"<p>Hello, {user.UserName}" +
                "<p>Confirm your email by clicking the link below.</p>" +
                $"<p><a href={url}>Click here</a></p>" +
                "<p>Thank You." +
                $"<br><p>{_configuration["Email:ApplicationName"]}</p>";
            if (user.Email != null)
            {
                EmailDTO emailToSend = new(user.Email, "Confirm Your Email", body);
                return await _emailServices.SendEmailAsync(emailToSend);
            }
            return false;
        }
    }
}
