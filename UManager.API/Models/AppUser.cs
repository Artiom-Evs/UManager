using Microsoft.AspNetCore.Identity;

namespace UManager.API.Models;

public class AppUser : IdentityUser
{
    public DateTime RegistrationDate { get; set; } = default;
    public DateTime LastLoginDate { get; set; } = default;
}
