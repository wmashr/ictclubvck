async function loadStudentData() {
    const response = await fetch('data/students.json');
    const students = await response.json();

    // Populate the dropdown with student names
    const studentSelect = document.getElementById('student-select');
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.email;
        option.textContent = `${student.name} - ${student.id}`;
        studentSelect.appendChild(option);
    });
}

// Function to generate Gmail link with email template
function sendEmail() {
    const studentSelect = document.getElementById('student-select');
    const selectedEmail = studentSelect.value;
    const selectedName = studentSelect.options[studentSelect.selectedIndex].text;

    // Check if a student is selected
    if (!selectedEmail) {
        alert('Please select a student.');
        return;
    }

    // Get selected student data
    const students = JSON.parse(localStorage.getItem('students'));
    const student = students.find(s => s.email === selectedEmail);

    if (!student) {
        alert('Student data not found.');
        return;
    }

    // Create the email content with a template
    const subject = encodeURIComponent('Student Data');
    const body = encodeURIComponent(`
        Hello,

        I hope this message finds you well. Below is the information for ${selectedName}:

        Name: ${student.name}
        Email: ${student.email}
        ID: ${student.id}
        School: ${student.school}
        Grade: ${student.grade}
        Events: ${student.events.join(', ')}

        Regards,
        Admin
    `);

    // Create the Gmail link directly in the browser
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEmail}&su=${subject}&body=${body}`;

    // Open Gmail in the browser with the email template
    window.open(mailtoLink, '_blank');
}

// Call the function to load the student data when the page is loaded
window.onload = async () => {
    await loadStudentData();
    // Store the students' data in localStorage for easy access in sendEmail
    const response = await fetch('data/students.json');
    const students = await response.json();
    localStorage.setItem('students', JSON.stringify(students));
}