using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MoviesAPI.Helpers
{
    public static class HttpContextExtensions
    {
        public async static Task InsertPaginationParameterInHeader<T>(this HttpContext httpContext, IQueryable<T> queryable)
        {
            double count = await queryable.CountAsync();

            if(httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }
            httpContext.Response.Headers.Add("totalAmountOfRecords", count.ToString());
        }
    }
}
