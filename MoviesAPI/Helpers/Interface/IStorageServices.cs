using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace MoviesAPI.Helpers
{
    public interface IStorageServices
    {
        Task DeleteFile(string ContainerName, string? FileRoute);
        Task<string> SaveFile(string ContainerName, IFormFile File);
        Task<string> EditFile(string ContainerName, IFormFile File, string? FileRoute);
    }
}
