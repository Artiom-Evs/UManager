using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using UManager.API.Models;

namespace UManager.API.Extensions;

public static class IdentityEndpointExtensions
{
    public static RouteGroupBuilder MapIdentityApiRoutes(this WebApplication app)
    {
        var prefix = app.Configuration.GetValue<string>("Identity:Prefix") ?? "";
        var routeGroup = app.MapGroup(prefix);

        routeGroup.MapPost("/register", RegisterPostHandler);
        routeGroup.MapPost("/login", LoginPostHandler);
        routeGroup.MapGet("/logout", LogoutGetHandler).RequireAuthorization();
        routeGroup.MapGet("/info", InfoGetHandler);

        return app;
    }

    private static async Task<Results<Ok, ValidationProblem>> RegisterPostHandler([FromBody] RegistrationRequest data, [FromServices] UserManager<AppUser> userManager)
    {
        if (string.IsNullOrWhiteSpace(data.Name))
        {
            return CreateValidationProblem("NameIsEmpty", $"Uncorrect name format.");
        }

        if (string.IsNullOrWhiteSpace(data.Email) || !(new EmailAddressAttribute()).IsValid(data.Email))
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(data.Email)));
        }

        if (string.IsNullOrWhiteSpace(data.Password))
        {
            return CreateValidationProblem("PasswordIsEmpty", $"Uncorrect password format.");
        }

        AppUser user = new()
        {
            UserName = data.Name,
            Email = data.Email,
            RegistrationDate = DateTime.Now
        };
        var registerResult = await userManager.CreateAsync(user, data.Password);

        if (!registerResult.Succeeded)
        {
            return CreateValidationProblem(registerResult);
        }

        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, UnauthorizedHttpResult, ValidationProblem>> LoginPostHandler([FromBody] LoginRequest data, [FromServices] UserManager<AppUser> userManager, [FromServices] SignInManager<AppUser> signInManager)
    {
        if (string.IsNullOrWhiteSpace(data.Email) || !(new EmailAddressAttribute()).IsValid(data.Email))
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(data.Email)));
        }

        if (string.IsNullOrWhiteSpace(data.Password))
        {
            return CreateValidationProblem("PasswordIsEmpty", $"Uncorrect password format.");
        }

        var user = await userManager.FindByEmailAsync(data.Email);

        if (user == null)
        {
            return TypedResults.Unauthorized();
        }

        var signInResult = await signInManager.PasswordSignInAsync(user, data.Password, data.RememberMe, false);

        if (!signInResult.Succeeded)
        {
            return TypedResults.Unauthorized();
        }

        user.LastLoginDate = DateTime.Now;
        await userManager.UpdateAsync(user);

        return TypedResults.Ok();
    }

    private static async Task<Results<Ok, NotFound>> LogoutGetHandler(HttpContext context, ClaimsPrincipal claimsPrincipal, [FromServices] UserManager<AppUser> userManager)
    {
        if (await userManager.GetUserAsync(claimsPrincipal) == null)
        {
            return TypedResults.NotFound();
        }

        await context.SignOutAsync();
        return TypedResults.Ok();
    }

    private static Ok<InfoResponse> InfoGetHandler(ClaimsPrincipal claimsPrincipal)
    {
        return TypedResults.Ok(new InfoResponse()
        {
            Name = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value,
            Email = claimsPrincipal.FindFirst(ClaimTypes.Email)?.Value,
            IsAuthenticated = claimsPrincipal.Identity?.IsAuthenticated ?? false
        });
    }

    private static ValidationProblem CreateValidationProblem(IdentityResult result)
    {
        // We expect a single error code and description in the normal case.
        // This could be golfed with GroupBy and ToDictionary, but perf! :P
        Debug.Assert(!result.Succeeded);
        var errorDictionary = new Dictionary<string, string[]>(1);

        foreach (var error in result.Errors)
        {
            string[] newDescriptions;

            if (errorDictionary.TryGetValue(error.Code, out var descriptions))
            {
                newDescriptions = new string[descriptions.Length + 1];
                Array.Copy(descriptions, newDescriptions, descriptions.Length);
                newDescriptions[descriptions.Length] = error.Description;
            }
            else
            {
                newDescriptions = new[] { error.Description };
            }

            errorDictionary[error.Code] = newDescriptions;
        }

        return TypedResults.ValidationProblem(errorDictionary);
    }

    private static ValidationProblem CreateValidationProblem(string errorCode, string errorDescription) =>
        TypedResults.ValidationProblem(new Dictionary<string, string[]> {
            { errorCode, new[] { errorDescription } }
        });
}
