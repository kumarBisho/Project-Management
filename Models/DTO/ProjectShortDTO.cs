namespace ProjectManagement.Models.DTO
{
    public class ProjectShortDTO
    {
        public int Id { get; set; }
        public required string ProjectName { get; set; }
        public required string Status { get; set; }

    }
}