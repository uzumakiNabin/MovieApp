using System.ComponentModel.DataAnnotations;
using System;

namespace MoviesAPI.DTOs
{
    public class ActorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Biography { get; set; }
        public string? Photo { get; set; }
    }
}
