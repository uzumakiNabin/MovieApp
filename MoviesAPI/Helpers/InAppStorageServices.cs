using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MoviesAPI.Helpers
{
    public class InAppStorageServices : IStorageServices
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _contextAccessor;

        public InAppStorageServices(IWebHostEnvironment env, IHttpContextAccessor contextAccessor)
        {
            _env = env;
            _contextAccessor = contextAccessor;
        }
        public Task DeleteFile(string ContainerName, string? FileRoute)
        {
            if (string.IsNullOrEmpty(FileRoute))
            {
                return Task.CompletedTask;
            }

            string fileName = Path.GetFileName(FileRoute);
            var fileDirectory = Path.Combine(_env.WebRootPath, ContainerName, fileName);

            if(File.Exists(fileDirectory))
            {
                File.Delete(fileDirectory);
            }

            return Task.CompletedTask;
        }

        public async Task<string> EditFile(string ContainerName, IFormFile FileToEdit, string? FileRoute)
        {
            await DeleteFile(ContainerName, FileRoute);
            return await SaveFile(ContainerName, FileToEdit);
        }

        public async Task<string> SaveFile(string ContainerName, IFormFile FileToSave)
        {
            var Extension = Path.GetExtension(FileToSave.FileName);
            string FileName = $"{Guid.NewGuid()}{Extension}";
            string Folder = Path.Combine(_env.WebRootPath, ContainerName);
            if (!Directory.Exists(Folder))
            {
                Directory.CreateDirectory(Folder);
            }

            string route = Path.Combine(Folder, FileName);
            using (MemoryStream Stream = new())
            {
                await FileToSave.CopyToAsync(Stream);
                var Content = Stream.ToArray();
                await File.WriteAllBytesAsync(route, Content);
            }

            string url = $"{_contextAccessor.HttpContext?.Request.Scheme}://{_contextAccessor.HttpContext?.Request.Host}";
            string routeForDb = Path.Combine(url, ContainerName, FileName).Replace("\\", "/");
            return routeForDb;
        }
    }
}
