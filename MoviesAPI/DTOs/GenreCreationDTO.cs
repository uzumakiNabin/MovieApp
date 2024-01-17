using MoviesAPI.Validations;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    //public class GenreCreationDTO : IValidatableObject
    public class GenreCreationDTO
    {
        [Required(ErrorMessage = "The field {0} is required")]
        [StringLength(50, ErrorMessage = "More than 50 chars is not allowed")]
        [FirstLetterUppercase]
        public string? Name { get; set; }

        //public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        //{
        //    if (!string.IsNullOrWhiteSpace(Name))
        //    {
        //        string FirstLetter = Name[0].ToString();
        //        if (FirstLetter != FirstLetter.ToUpper())
        //        {
        //            yield return new ValidationResult("First letter should be uppercase", new string[] { nameof(Name) });
        //        }
        //    }
        //}
    }
}
