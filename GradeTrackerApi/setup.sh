#!/bin/bash
# setup.sh - Sets up and runs the GradeTrackerApi project end to end.
#
# What this does:
#   1. Checks that the .NET SDK is installed.
#   2. Restores NuGet packages and builds the project.
#   3. Applies EF Core migrations to create the SQLite database file.
#   4. Starts the API in the background and waits for it to come up.
#   5. Seeds a couple of sample grades using curl (proves the API works
#      end to end, no manual clicking required).
#   6. Tails the API log so you can watch requests come in.
#
# Run this from the same directory as GradeTrackerApi.csproj:
#   chmod +x setup.sh
#   ./setup.sh

set -e

PROJECT_DIR="GradeTrackerApi"
API_URL="http://localhost:5082/api/grades"
LOG_FILE="api.log"

echo "== Checking for .NET SDK =="
if ! command -v dotnet &> /dev/null; then
    echo "ERROR: dotnet SDK not found. Install it first: https://dotnet.microsoft.com/download"
    exit 1
fi
dotnet --version

echo "== Restoring and building =="
cd "$PROJECT_DIR"
dotnet restore
dotnet build

echo "== Applying EF Core migrations (creates gradetracker.db) =="
if [ ! -d "Migrations" ]; then
    echo "No Migrations folder found yet - generating one for SQLite."
    dotnet ef migrations add InitialCreate
fi
dotnet ef database update

echo "== Starting the API in the background =="
dotnet run --urls "$API_URL" > "../$LOG_FILE" 2>&1 &
API_PID=$!
echo "API started with PID $API_PID, logging to $LOG_FILE"

echo "== Waiting for the API to respond =="
for i in $(seq 1 15); do
    if curl -s -o /dev/null "$API_URL"; then
        echo "API is up."
        break
    fi
    sleep 1
done

echo "== Seeding sample grades =="
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"courseName":"COMP123","assignmentName":"Assignment 02","score":88,"maxScore":100,"dateRecorded":"2026-07-01T00:00:00"}' \
  > /dev/null

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"courseName":"COMP125","assignmentName":"Assignment 03","score":95,"maxScore":100,"dateRecorded":"2026-07-05T00:00:00"}' \
  > /dev/null

echo "Sample data seeded. Current grades:"
curl -s "$API_URL"
echo ""

echo "== Tailing API log (Ctrl-C to stop watching; API keeps running as PID $API_PID) =="
tail -f "../$LOG_FILE"
