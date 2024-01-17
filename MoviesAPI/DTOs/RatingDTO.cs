using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    public class RatingDTO
    {
        [Range(0, 5)]
        public int Rate { get; set; }
        public int MovieId { get; set; }
    }
}
