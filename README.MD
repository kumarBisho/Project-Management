
Project Management System

## Backend setup for Data modeling and implement controllers

# Main Model for this Project:
1. User
    Fields:
    a. user_id
    b. name
    c. email
    d. password
    e. role

2. Project
    Fielsd:
    a. project_id
    b. Project_name
    c. description
    d. start_date
    e. end_date
    f. Status
    h. ManagerName


# Create a New Web API Project
Open Terminal and run:
dotnet new webapi -n ProjectManagement
cd ProjectManagement
code .

# Install SQL Server Provider from google

Install Entity Framework Core:
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet restore

# Create Models/
User.cs
Project.cs

# Configure SQL Server Connection
Open appsettings.json and add:
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ProjectDB;Trusted_Connection=True;TrustServerCertificate=True;"
}

# Register DbContext
open Program.cs and add:
builder.Services.AddDbContext<ProjectManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

Add controller services
open Program.cs and add:
builder.Services.AddControllers();

# Create Database via Migration
Put below command in vscode terminal:
dotnet ef migrations add InitialCreate --context ProjectManagementContext
dotnet ef database update --context ProjectManagementContext

# Run Project
dotnet build
dotnet run

# Open UI
https://localhost:7157

# Test all endpoint CRUD operation on postman

# Users CRUD Operations

GET https://localhost:5269/api/Users  -> To get all users

GET https://localhost:5269/api/Users/id  -> To get user by id

POST https://localhost:5269/api/Users  -> To create user

PUT https://localhost:5269/api/Users/id  -> To update user

DELETE https://localhost:5269/api/Users/id  -> To delete user

# Projects CRUD Operations

GET https://localhost:5269/api/Projects  -> To get all Projects

GET https://localhost:5269/api/Projects/id  -> To get Project by id

POST https://localhost:5269/api/Projects  -> To create Projects

PUT https://localhost:5269/api/Projects/id  -> To update Project

DELETE https://localhost:5269/api/Projects/id  -> To delete Projects

When use POST operation on POSTMAN ADD data in body as JSON FORMAT
for User
{
    "name": "Bisho",
    "email": "bisho@gmail.com",
    "password": "1234",
    "role": "manager"
    }

for Project
{
    "ProjectName": "Project Management System",
    "Description": "Redesign the company website with modern UI and improved performance.",
    "StartDate": "2025-02-01T10:00:00",
    "EndDate": "2025-05-15T18:00:00",
    "Status": "In Progress",
    "ManagerName": "Tanmay"
}