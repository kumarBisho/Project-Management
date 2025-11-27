using Microsoft.EntityFrameworkCore;
using ProjectManagement.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();

builder.Services.AddOpenApi();

// Register DbContext
builder.Services.AddDbContext<ProjectManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin()
    );
});

// Add controller services
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.MapGet("/", () => "API is running!");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


// Enable routing for controllers
app.MapControllers();

app.UseHttpsRedirection();

app.Run();
