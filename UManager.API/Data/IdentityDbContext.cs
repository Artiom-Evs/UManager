using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UManager.API.Models;

namespace UManager.API.Data;

public class AppIdentityDbContext : IdentityDbContext<AppUser>
{
    public AppIdentityDbContext(DbContextOptions options) : base(options)
    {
        // Migrating a scheme to Azure SQL Databases can take a VERY long time!
        // preferably to execute migration in advance to avoid runtime exceptions 
        Database.EnsureCreated();
        Database.Migrate();
    }
}
