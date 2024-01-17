using System.Collections.Generic;

namespace MoviesAPI.DTOs
{
    public class GenresAndTheatersDTO
    {
        public List<GenreDTO> Genres { get; set; }
        public List<TheaterDTO> Theaters { get; set; }
    }
}
