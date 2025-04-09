# MediOptima - Hospital Management System

## Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Visual Studio Code](https://code.visualstudio.com/) or any preferred IDE
- [SQLite](https://www.sqlite.org/index.html) (for local database) or SQL Server

---

## Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hwolf441/MeditOptima.git
   cd meditrack/client
   
 ##  2.Install dependencies
   npm install

   #Configure API endpoint

## Open api.js in the client directory

## Replace the Fabric/Azure endpoint with your own:

javascript

export const API_BASE_URL = 'https://api.fabric.microsoft.com/v1/workspaces/YOUR-WORKSPACE-ID/...';
Run the frontend


### npm run dev
## Backend Setup
Install missing NuGet packages

Open the .csproj file

### Restore packages:

dotnet restore
#Database Setup

## For SQLite (default):

Ensure you have SQLite extension installed in your IDE

For SQL Server:


dotnet add package Microsoft.EntityFrameworkCore.SqlServer
## Configure Database

Update the connection string in appsettings.json:


"ConnectionStrings": {
  "DefaultConnection": "Server=your-server;Database=your-db;User=your-user;Password=your-pwd;"
}
## Change DB provider in Program.cs:


builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
Migrations (Important!)


## Remove existing migrations (if any)
rm -rf Persistence/Migrations/

## Create new migration
dotnet ef migrations add InitialCreate --project YourProject.csproj --output-dir Persistence/Migrations

## Apply migrations
dotnet ef database update
Build and Run


### dotnet build
dotnet watch run
Default Login Credentials

## The system can use these default accounts or you can add yours in the admin page:

 Role: Admin,	 Staff ID: PA107/G/7485/19,	 Password: Aduzaka54@@29@#,
 Role: Doctor,	Staff ID: 236589,	Password: Doctor25@#,
 Role: Procurement,	Staff ID: 257930,	Password: Procurement25@#,
 Role: Reception,	Staff ID: 392460,	Password: Reception25@#,
 
## Troubleshooting
Common Issues
### Migrations errors:

Always delete Persistence/Migrations/ModelSnapshot.cs before creating new migrations

Ensure your connection string is correct

### Missing packages:

dotnet list package
dotnet add package Missing.Package
Frontend not connecting:

### Verify CORS settings in Program.cs

### Check API base URL in api.js

### Optional Configuration
### To use a different database:

Install the appropriate EF Core provider package

Update Program.cs configuration

Create new migrations

### For production:

Set environment variables for sensitive data

Configure HTTPS



### Key Features of This Documentation:
1. **Clear Step-by-Step Flow** - Logical progression from setup to running
2. **Code Snippets** - Ready-to-use commands
3. **Visual Structure** - Sections with clear headings
4. **Troubleshooting** - Common issues and solutions
5. **Default Credentials** - Highlighted for easy access
6. **Database Options** - Covers both SQLite and SQL Server cases
