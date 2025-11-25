namespace ProjectManagement.Models
{
    public class Project
    {
        public int Id { get; set; }
        public required string ProjectName { get; set; }
        public required string Description { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required string Status { get; set; }
        public required string ManagerName { get; set; }
        // public required List<User> TeamMembers { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}