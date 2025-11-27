namespace ProjectManagement.Models.DTO
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ManagerName { get; set; }

        // public List<UserDTO> TeamMembers { get; set; } = new();
        public List<UserShortDTO> TeamMembers { get; set; } = new();
    }
}
