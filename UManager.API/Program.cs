using Microsoft.EntityFrameworkCore;
using UManager.API.Data;
using UManager.API.Extensions;
using UManager.API.Filters;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("mssql")
        ?? throw new InvalidOperationException("The specified database connection string could not be found.")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCustomAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApiRoutes().AddEndpointFilter<LockedUsersFilter>();
app.MapIdentityManageApiRoutes().AddEndpointFilter<LockedUsersFilter>();

app.Run();
