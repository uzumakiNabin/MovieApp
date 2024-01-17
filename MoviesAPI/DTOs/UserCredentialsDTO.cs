using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    public class UserCredentialsDTO
    {
        [Required]
        [EmailAddress] 
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
