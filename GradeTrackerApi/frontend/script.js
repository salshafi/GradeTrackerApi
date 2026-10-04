// Base URL of the C# Web API. Matches the "http" profile in launchSettings.json.
const API_URL = "http://localhost:5082/api/grades";

document.addEventListener("DOMContentLoaded", function () {
    loadGrades();

    const gradeForm = document.getElementById("grade-form");
    gradeForm.addEventListener("submit", handleFormSubmit);
});

// Fetches all grades from the API and renders them into the table body.
async function loadGrades() {
    const gradesBody = document.getElementById("grades-body");

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Server responded with status " + response.status);
        }
        const grades = await response.json();

        gradesBody.innerHTML = ""; // Clear existing rows before re-rendering.

        grades.forEach(function (grade) {
            gradesBody.appendChild(buildGradeRow(grade));
        });
    } catch (error) {
        console.error("Failed to load grades:", error);
        gradesBody.innerHTML = "<tr><td colspan='5'>Could not load grades. Is the API running?</td></tr>";
    }
}

// Builds a single <tr> for one grade object, same createElement pattern
// used in the Assignment 3 photo gallery favorites list.
function buildGradeRow(grade) {
    const row = document.createElement("tr");

    const percentage = grade.maxScore > 0
        ? ((grade.score / grade.maxScore) * 100).toFixed(1) + "%"
        : "N/A";

    const dateText = new Date(grade.dateRecorded).toLocaleDateString();

    const cells = [
        grade.courseName,
        grade.assignmentName,
        grade.score + " / " + grade.maxScore,
        percentage,
        dateText
    ];

    cells.forEach(function (text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.appendChild(cell);
    });

    return row;
}

// Handles the "Add Grade" form submission: builds a Grade object matching
// the C# model, POSTs it to the API, then refreshes the table.
async function handleFormSubmit(event) {
    event.preventDefault();

    const newGrade = {
        courseName: document.getElementById("courseName").value,
        assignmentName: document.getElementById("assignmentName").value,
        score: parseFloat(document.getElementById("score").value),
        maxScore: parseFloat(document.getElementById("maxScore").value),
        dateRecorded: new Date().toISOString()
    };

    const message = document.getElementById("form-message");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGrade)
        });

        if (!response.ok) {
            throw new Error("Server responded with status " + response.status);
        }

        message.textContent = "Grade added!";
        document.getElementById("grade-form").reset();
        loadGrades();
    } catch (error) {
        console.error("Failed to add grade:", error);
        message.textContent = "Could not add grade. Is the API running?";
    }
}
