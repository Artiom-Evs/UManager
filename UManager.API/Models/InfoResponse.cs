namespace UManager.API.Models;

public record InfoResponse
{
    public string? Name { get; init; }
    public string? Email { get; init; }
    public bool IsAuthenticated { get; init; }
}
