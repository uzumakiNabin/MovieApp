using System;

namespace MoviesAPI.DTOs
{
    public class AuthenticationResponseDTO
    {
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
