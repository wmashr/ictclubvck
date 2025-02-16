let students = [];
let currentPage = 1;
const studentsPerPage = 5;
let adminPassword = '';  // Variable to hold the correct admin password

// Fetch admin password from data/admin.json
async function fetchAdminPassword() {
try {
const response = await fetch('data/admin.json');
const data = await response.json();
adminPassword = data.password;
console.log('Admin password fetched:', adminPassword); // Debugging fetched password
} catch (error) {
console.error("Error fetching admin password:", error);
}
}


// Password authentication
function authenticateAdmin() {
const enteredPassword = prompt("Enter admin password:");

if (enteredPassword === adminPassword) {
fetchData(); // Fetch and display data if the password is correct
} else {
console.log('Incorrect password entered:', enteredPassword); // Debugging wrong input
alert("Incorrect password. Access denied.");
}
}


// Fetch data from the students JSON file
async function fetchData() {
    try {
        const response = await fetch('data/students.json');
        students = await response.json();
        console.log('Fetched Students:', students); // Debugging fetched data
        displayStudents();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Filter function
function filterData() {
    const grade = document.getElementById('grade-filter').value;
    const event = document.getElementById('event-filter').value;
    const school = document.getElementById('school-filter').value;

    console.log('Filters:', { grade, event, school });  // Debugging selected filter values

    let filteredStudents = students;

    if (grade) {
        filteredStudents = filteredStudents.filter(student => student.grade === grade);
    }
    if (event) {
        filteredStudents = filteredStudents.filter(student => student.events.includes(event));
    }
    if (school) {
        filteredStudents = filteredStudents.filter(student => student.school === school);
    }

    console.log('Filtered Students:', filteredStudents);  // Debugging filtered students
    displayStudents(filteredStudents);
}
function openEmailPage() {
    window.location.href = 'email.html'; // Redirects to the email.html page
}


// Reset filters function
function resetFilters() {
    document.getElementById('grade-filter').value = '';
    document.getElementById('event-filter').value = '';
    document.getElementById('school-filter').value = '';
    filterData(); // Call filterData to reset the table
}

// Display students
function displayStudents(filteredStudents = students) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = '';

    // Paginate the students
    const start = (currentPage - 1) * studentsPerPage;
    const end = start + studentsPerPage;
    const paginatedStudents = filteredStudents.slice(start, end);

    paginatedStudents.forEach(student => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'hover:bg-gray-700', 'text-white');
        
        row.innerHTML = `
            <td class="px-4 py-2">${student.name}</td>
            <td class="px-4 py-2">${student.email}</td>
            <td class="px-4 py-2">${student.id}</td>
            <td class="px-4 py-2">${student.school}</td>
            <td class="px-4 py-2">${student.grade}</td>
            <td class="px-4 py-2">${student.events.join(', ')}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination(filteredStudents);
}

// Update pagination buttons
function updatePagination(filteredStudents) {
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('px-4', 'py-2', 'mx-1', 'bg-gray-700', 'text-white', 'rounded');
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i);
        pagination.appendChild(pageButton);
    }
}

// Change page
function changePage(page) {
    currentPage = page;
    displayStudents();
}

// On page load, fetch the admin password
window.onload = async function() {
await fetchAdminPassword(); // Wait until the password is fetched
authenticateAdmin(); // Then ask for password
};

// Function to convert the form data into a JSON object
function convertToJson() {
// Collect values from the form
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const id = document.getElementById('id').value;
const school = document.getElementById('school').value;
const grade = document.getElementById('grade').value;
const password = document.getElementById('password').value;

// Collect checked events
const selectedEvents = [];
if (document.getElementById('event1').checked) selectedEvents.push('event1');
if (document.getElementById('event2').checked) selectedEvents.push('event2');
if (document.getElementById('event3').checked) selectedEvents.push('event3');
if (document.getElementById('event4').checked) selectedEvents.push('event4');
if (document.getElementById('event5').checked) selectedEvents.push('event5');
if (document.getElementById('event6').checked) selectedEvents.push('event6');

// Create a JSON object
const studentData = {
    name: name,
    email: email,
    id: id,
    school: school,
    grade: grade,
    password: password,
    events: selectedEvents
};

// Convert the JSON object to a string and display it
const jsonOutput = JSON.stringify(studentData, null, 2);
document.getElementById('json-output').textContent = jsonOutput;
}

// Function to copy the JSON to clipboard
function copyToClipboard() {
const jsonOutput = document.getElementById('json-output').textContent;
navigator.clipboard.writeText(jsonOutput).then(function() {
    alert('JSON copied to clipboard!');
}).catch(function(err) {
    alert('Failed to copy JSON: ' + err);
});
}

