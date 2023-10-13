namespace UManager.API.Models;

public record InfoResponse
{
    public string? Id { get; init; }
    public string? Name { get; init; }
    public string? Email { get; init; }
}
