using Microsoft.EntityFrameworkCore;
using RestrictedNL.Models;

namespace RestrictedNL.Context;

public class TestContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<TestFile> TestFiles { get; set; }
    public DbSet<TestRun> TestRuns { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TestRun>()
            .Property(e => e.Id)
            .ValueGeneratedOnAdd();
    }
}