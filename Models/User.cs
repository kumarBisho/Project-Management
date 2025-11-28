namespace ProjectManagement.Models
{
    public class User
    {
        public int Id{ get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }

        // One user can manage many projects
        public ICollection<Project> ManagedProjects { get; set; } = new List<Project>();

        // Many-to-many: user is part of many projects
        public ICollection<Project> TeamProjects { get; set; } = new List<Project>();
        // public IEnumerable<object> Projects { get; internal set; }
    }
}