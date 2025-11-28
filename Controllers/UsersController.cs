using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Data;
using ProjectManagement.Models;
using ProjectManagement.Models.DTO;

namespace ProjectManagement.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ProjectManagementContext _context;

        public UsersController(ProjectManagementContext context)
        {
            _context = context;
        }

        // convert to DTO
        private UserDTO ToDetailsDTO(User u)
        {
            return new UserDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                TeamProjects = u.TeamProjects.Select(p => new ProjectShortDTO
                {
                    Id = p.Id,
                    ProjectName = p.ProjectName
                }).ToList()
            };
        }

        private UserDTO ToDTO(User u)
        {
            return new UserDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            };
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return users.Select(ToDTO).ToList();
        }

        

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.TeamProjects)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            return ToDetailsDTO(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser(UserCreateDTO dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password, // hash later
                Role = dto.Role
            };

            if (dto.TeamProjectIds.Any())
            {
                var teamProjects = await _context.Projects
                    .Where(p => dto.TeamProjectIds.Contains(p.Id))
                    .ToListAsync();

                foreach (var project in teamProjects)
                {
                    user.TeamProjects.Add(project);
                }
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, ToDTO(user));
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO dto)
        {
            var user = await _context.Users
                .Include(u => u.TeamProjects)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            // Basic properties
            user.Name = dto.Name;
            user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.Password))
                user.Password = dto.Password;

            user.Role = dto.Role;

            // ---- FIX: CLEAR existing relationships from join table ----
            user.TeamProjects.Clear();

            // ---- REASSIGN new team projects ----
            if (dto.TeamProjectIds.Any())
            {
                var teamProjects = await _context.Projects
                    .Where(p => dto.TeamProjectIds.Contains(p.Id))
                    .ToListAsync();

                foreach (var project in teamProjects)
                    user.TeamProjects.Add(project);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpPatch("{userId}/add-team-project/{projectId}")]
        public async Task<IActionResult> AddTeamProject(int userId, int projectId)
        {
            var user = await _context.Users
                .Include(u => u.TeamProjects)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("User not found.");

            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return NotFound("Project not found.");

            if (!user.TeamProjects.Any(p => p.Id == projectId))
                user.TeamProjects.Add(project);

            await _context.SaveChangesAsync();
            return Ok(ToDetailsDTO(user));
        }

        [HttpPatch("{userId}/remove-team-project/{projectId}")]
        public async Task<IActionResult> RemoveTeamProject(int userId, int projectId)
        {
            var user = await _context.Users
                .Include(u => u.TeamProjects)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("User not found.");

            var project = user.TeamProjects.FirstOrDefault(p => p.Id == projectId);
            if (project == null) return NotFound("User is not part of this project.");

            user.TeamProjects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(ToDetailsDTO(user));
        }


        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
