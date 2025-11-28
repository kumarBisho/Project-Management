namespace ProjectManagement.Models.DTO
{
    public class UserUpdateDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public  string? Password { get; set; }
        public required string Role { get; set; }
        public List<int> TeamProjectIds { get; set; } = new();
    }
}