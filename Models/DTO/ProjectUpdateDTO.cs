namespace ProjectManagement.Models.DTO
{
    public class ProjectUpdateDTO
    {
        public required string ProjectName { get; set; }
        public required string Description { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required string Status { get; set; }
        public int ManagerId { get; set; }
        public List<int> TeamMemberIds { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
