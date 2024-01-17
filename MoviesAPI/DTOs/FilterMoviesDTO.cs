namespace MoviesAPI.DTOs
{
    public class FilterMoviesDTO
    {
        public int Page { get; set; }
        public int RecordsPerPage { get; set; }
        public PaginationDTO Pagination
        {
            get
            {
                return new PaginationDTO()
                {
                    Page = Page,
                    RecordPerPage = RecordsPerPage
                };
            }

        }

        public string? Title { get; set; }
        public int GenreId { get; set; }
        public bool InTheater { get; set; }
        public bool UpcomingRelease { get; set; }
    }
}
