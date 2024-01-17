using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Validations
{
    public class FirstLetterUppercaseAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrEmpty(value.ToString()))
            {
                return ValidationResult.Success;
            }
            string FirstLetter = value.ToString()![0].ToString();
            if (FirstLetter != FirstLetter.ToUpper())
            {
                return new ValidationResult("First letter should be uppercase");
            }
            return ValidationResult.Success;
        }
    }
}
