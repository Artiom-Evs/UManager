using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UManager.API.Models;

namespace UManager.API.Extensions;

public record UserModel(
    string Id, 
    string Name, 
    string Email,
    DateTime RegistrationDate,
    DateTime LastLoginDate,
    bool IsLocked);

public static class IdentityManageEndpointExtensions
{
    public static RouteGroupBuilder MapIdentityManageApiRoutes(this WebApplication app)
    {
        var prefix = app.Configuration.GetValue<string>("Identity:Prefix") ?? "";
        var routeGroup = app.MapGroup($"{prefix}/manage");
        
        routeGroup.MapGet("/users", UsersGetHandler);
        routeGroup.MapDelete("/users", UsersDeleteHandler);
        // TODO: refactor this routes
        routeGroup.MapGet("/users/block", BlockUserGetHandler);
        routeGroup.MapGet("/users/unblock", UnblockUserGetHandler);

        routeGroup.RequireAuthorization();
        return routeGroup;
    }

    private static async Task<Ok<UserModel[]>> UsersGetHandler([FromServices] UserManager<AppUser> userManager)
    {
        var users = await userManager.Users
            .Select(u => new UserModel(u.Id, u.UserName ?? "-", u.Email ?? "-", u.RegistrationDate, u.LastLoginDate, u.LockoutEnd > DateTime.Now))
            .ToArrayAsync();

        return TypedResults.Ok(users);
    }

    private static async Task<Results<Ok, BadRequest, NotFound>> UsersDeleteHandler([FromQuery] string id, [FromServices] UserManager<AppUser> userManager)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return TypedResults.BadRequest();
        }

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return TypedResults.NotFound();
        }

        await userManager.DeleteAsync(user);
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, BadRequest, NotFound>> BlockUserGetHandler([FromQuery] string id, [FromServices] UserManager<AppUser> userManager)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return TypedResults.BadRequest();
        }

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return TypedResults.NotFound();
        }

        await userManager.SetLockoutEndDateAsync(user, DateTime.MaxValue);
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, BadRequest, NotFound>> UnblockUserGetHandler([FromQuery] string id, [FromServices] UserManager<AppUser> userManager)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return TypedResults.BadRequest();
        }

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return TypedResults.NotFound();
        }

        await userManager.SetLockoutEndDateAsync(user, null);
        return TypedResults.Ok();
    }
}
