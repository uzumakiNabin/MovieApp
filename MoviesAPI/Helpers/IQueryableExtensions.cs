using MoviesAPI.DTOs;
using System.Linq;

namespace MoviesAPI.Helpers
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> Paginate<T>(this IQueryable<T> queryable, PaginationDTO pagination)
        {
            return queryable
                .Skip((pagination.Page - 1) * pagination.RecordPerPage)
                .Take(pagination.RecordPerPage);
        }
    }
}
