using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Data;
using ProjectManagement.Models;
using ProjectManagement.Models.DTO;

namespace ProjectManagement.Controllers
{
    [Route("api/Projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectManagementContext _context;

        public ProjectsController(ProjectManagementContext context)
        {
            _context = context;
        }

        // Convert to DTO
        private ProjectDTO ToDTO(Project p)
        {
            return new ProjectDTO
            {
                Id = p.Id,
                ProjectName = p.ProjectName,
                Description = p.Description,
                Status = p.Status,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                ManagerName = p.Manager?.Name,
                TeamMembers = p.TeamMembers.Select(t => new UserShortDTO
                {
                    Id = t.Id,
                    Name = t.Name
                }).ToList()
            };
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDTO>>> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Manager)
                .Include(p => p.TeamMembers)
                .ToListAsync();

            return projects.Select(ToDTO).ToList();
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDTO>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Manager)
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            return ToDTO(project);
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<ProjectDTO>> CreateProject(ProjectCreateDTO dto)
        {
            var project = new Project
            {
                ProjectName = dto.ProjectName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status,
                ManagerId = dto.ManagerId,
                CreatedAt = dto.CreatedAt
            };

            // Add team members
            if (dto.TeamMemberIds.Any())
            {
                var users = await _context.Users
                    .Where(u => dto.TeamMemberIds.Contains(u.Id))
                    .ToListAsync();

                project.TeamMembers = users;
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, ToDTO(project));
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectUpdateDTO dto)
        {
            var project = await _context.Projects
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            project.ProjectName = dto.ProjectName;
            project.Description = dto.Description;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;
            project.Status = dto.Status;
            project.ManagerId = dto.ManagerId;
            project.CreatedAt = dto.CreatedAt;

            // Replace team members
            project.TeamMembers.Clear();
            if (dto.TeamMemberIds.Any())
            {
                var users = await _context.Users
                    .Where(u => dto.TeamMemberIds.Contains(u.Id))
                    .ToListAsync();
                foreach (var u in users) project.TeamMembers.Add(u);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/Projects/5/add-member/3
        [HttpPatch("{projectId}/add-member/{userId}")]
        public async Task<IActionResult> AddTeamMember(int projectId, int userId)
        {
            var project = await _context.Projects
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return NotFound("Project not found.");
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found.");

            if (!project.TeamMembers.Any(u => u.Id == userId))
                project.TeamMembers.Add(user);

            await _context.SaveChangesAsync();
            return Ok(ToDTO(project));
        }

        // PATCH: api/Projects/5/remove-member/3
        [HttpPatch("{projectId}/remove-member/{userId}")]
        public async Task<IActionResult> RemoveTeamMember(int projectId, int userId)
        {
            var project = await _context.Projects
                .Include(p => p.TeamMembers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return NotFound("Project not found.");
            var user = project.TeamMembers.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound("User is not in this project.");

            project.TeamMembers.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(ToDTO(project));
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
