using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using UManager.API.Models;

namespace UManager.API.Filters;

/// <summary>
/// Intended for filtering requests from locked or deleted users.
/// </summary>
public class LockedUsersFilter : IEndpointFilter
{
    protected readonly UserManager<AppUser> _userManager;

    public LockedUsersFilter(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var isAuthorized = context.HttpContext.User.Identity?.IsAuthenticated ?? false;

        if (isAuthorized)
        {
            var user = await _userManager.GetUserAsync(context.HttpContext.User);
            
            if (user == null || await _userManager.IsLockedOutAsync(user))
            {
                await context.HttpContext.SignOutAsync();
                return Results.Unauthorized();
            }
        }

        return await next(context);
    }
}