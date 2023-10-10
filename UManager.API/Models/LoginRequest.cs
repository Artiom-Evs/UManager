namespace UManager.API.Models;

public record LoginRequest
{
    public string Email { get; init; } = "";
    public string Password { get; init; } = "";
    public bool RememberMe { get; init; }
}
