
using Microsoft.EntityFrameworkCore;
using GradeTrackerApi.Models;

namespace GradeTrackerApi.Data {
        public class GradeContext : DbContext {
        public GradeContext(DbContextOptions<GradeContext> options) : base(options) { }

            public DbSet<Grade> Grades { get; set; }
        }
    }

