using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    public class TheaterDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
