using MoviesAPI.Validations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Entities
{
    public class Genre
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, ErrorMessage = "More than 50 chars is not allowed")]
        [FirstLetterUppercase]
        public string? Name { get; set; }
        public ICollection<MovieGenre> MovieGenres { get; set; }
    }
}
