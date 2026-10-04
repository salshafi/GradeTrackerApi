# Grade Tracker — Integrated Project

A single project spanning C#, a database, and JS/HTML/CSS, glued together with a Linux
setup script. Built on top of the original `GradeTrackerApi` C# Web API.

## What changed from the original project

- **Database switched from SQL Server to SQLite** (`GradeTrackerApi.csproj`,
  `Program.cs`, `appsettings.json`). SQLite needs no server install, so anyone who
  clones the repo can run it immediately — important for a portfolio piece.
- **Connection string moved out of code** and into `appsettings.json` under
  `ConnectionStrings:DefaultConnection`.
- **CORS enabled** in `Program.cs` so the JS front end (served from a different
  origin/port) can call the API from the browser.
- **The old SQL-Server-specific `Migrations` folder was removed.** You'll need to
  regenerate it once, for the SQLite provider (see Step 2 below) — `setup.sh` does
  this automatically if the folder is missing.

## Project layout

```
GradeTrackerApi/              <- solution root
├── GradeTrackerApi.slnx
├── setup.sh                  <- Linux glue: builds, migrates, seeds, runs
├── frontend/                 <- HTML/CSS/JS client
│   ├── index.html
│   ├── style.css
│   └── script.js
└── GradeTrackerApi/           <- the C# Web API project
    ├── Controllers/GradesController.cs
    ├── Models/Grade.cs
    ├── Data/GradeContext.cs
    └── Program.cs
```

## Running it

### Option A: the automated way (Linux/WSL)
```bash
chmod +x setup.sh
./setup.sh
```
This builds the API, creates `gradetracker.db`, seeds two sample grades, and
starts the API on `http://localhost:5082`.

### Option B: manual steps (Windows/Visual Studio)
1. `cd GradeTrackerApi` (the inner project folder)
2. `dotnet ef migrations add InitialCreate` (first time only — the old SQL Server
   migration was removed since it doesn't apply to SQLite)
3. `dotnet ef database update`
4. `dotnet run` — API comes up on `http://localhost:5082`

### Then, open the front end
Open `frontend/index.html` with a Live Server (same tool you've used for the
COMP125 assignments). It will call the API at `http://localhost:5082/api/grades`
to list and add grades.

## Next possible additions
- A Python script that pulls `GET /api/grades` and computes a weighted average
  per course, or exports to CSV.
- Basic input validation (e.g. reject a `score` greater than `maxScore`).
- A Dockerfile so the whole thing runs with one command, anywhere.
