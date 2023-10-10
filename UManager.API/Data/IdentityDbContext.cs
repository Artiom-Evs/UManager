using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UManager.API.Models;

namespace UManager.API.Data;

public class AppIdentityDbContext : IdentityDbContext<AppUser>
{
    public AppIdentityDbContext(DbContextOptions options) : base(options)
    {
        Database.EnsureCreated();
        Database.Migrate();
    }
}
