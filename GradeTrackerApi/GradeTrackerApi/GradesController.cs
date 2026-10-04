using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GradeTrackerApi.Data;
using GradeTrackerApi.Models;

namespace  GradeTrackerApi.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class GradesController : ControllerBase {
        private readonly GradeContext _context;

        public GradesController(GradeContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGrades() {
            return await _context.Grades.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Grade>> PostGrade(Grade grade) {
            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGrades), new { id = grade.Id }, grade);
        }
    }
}
