using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using UManager.API.Data;
using UManager.API.Models;
using UManager.API.Extensions;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("mssql")
        ?? throw new InvalidOperationException("The specified database connection string could not be found.")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<AppUser, IdentityRole>(o =>
{
    o.User.RequireUniqueEmail = true;
    o.Password.RequireNonAlphanumeric = false;
    o.Password.RequireDigit = false;
    o.Password.RequireUppercase = false;
    o.Password.RequireLowercase = false;
    o.Password.RequiredUniqueChars = 1;
    o.Password.RequiredLength = 1;
})
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<AppIdentityDbContext>();

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.UseRouting();
app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Use(async (context, next) =>
{
    ;
    await next.Invoke();
    ;
});

app.MapCustomIdentityApiRoutes();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
