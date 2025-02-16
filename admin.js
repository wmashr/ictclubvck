const firebaseConfig = {
  apiKey: "AIzaSyDNALgHhVIUBJGzcMUFNMlwBOpuNdkWQJk",
  authDomain: "ictvck-f5b4d.firebaseapp.com",
  projectId: "ictvck-f5b4d",
  storageBucket: "ictvck-f5b4d.firebasestorage.app",
  messagingSenderId: "237518282571",
  appId: "1:237518282571:web:2fc9afaf0520d328f652ce",
  measurementId: "G-GS6PKG4BKJ"
};

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // Pagination Settings
  const itemsPerPage = 5;
  let currentPage = 1;
  let totalStudents = 0;

  // Event Data
  const eventsData = {
    event1: { name: "Quiz Competition" },
    event2: { name: "Video Editing" },
    event3: { name: "Animation Competition" },
    event4: { name: "Web Designing" },
    event5: { name: "Digital Art" },
    event6: { name: "Photo Manipulation" }
  };

  // Fetch total student count
  function getTotalStudentCount() {
    return db.ref('students').once('value').then(snapshot => {
      totalStudents = snapshot.numChildren();
      updatePageInfo();
    });
  }

  // Fetch students with pagination
let lastStudentKey = null;

function fetchStudents(page) {
const itemsPerPage = 5;

// Determine the query based on the current page
let query = db.ref('students').orderByKey().limitToFirst(itemsPerPage);

if (lastStudentKey && page > 1) {
  query = db.ref('students').orderByKey().startAfter(lastStudentKey).limitToFirst(itemsPerPage);
}

query.once('value').then(snapshot => {
  const students = snapshot.val();
  if (students) {
    const studentKeys = Object.keys(students);
    lastStudentKey = studentKeys[studentKeys.length - 1]; // Store the key of the last student for next page
    displayStudents(students);
    currentPage = page;
    updatePageInfo();
  }
});
}

  // Display student data
  function displayStudents(students, offset) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = '';

    Object.keys(students).forEach((key, index) => {
      const student = students[key];
      const studentEvents = student.events.map(eventKey => eventsData[eventKey]?.name || 'N/A').join(", ");
      const row = `
        <tr>
          <td class="p-4">${student.name}</td>
          <td class="p-4">${student.email}</td>
          <td class="p-4">${student.school}</td>
          <td class="p-4">${student.grade}</td>
          <td class="p-4">${student.id}</td>
          <td class="p-4">${studentEvents}</td>
          <td class="p-4 flex space-x-2">
            <button class="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg" onclick="editStudent('${key}')">
              <span class="material-icons">edit</span>
            </button>
            <button class="bg-red-500 hover:bg-red-600 p-2 rounded-lg" onclick="deleteStudent('${key}')">
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }

  // Edit student function
  function editStudent(studentKey) {
    const studentRef = db.ref('students/' + studentKey);
    studentRef.once('value', snapshot => {
      const student = snapshot.val();
      document.getElementById('edit-name').value = student.name;
      document.getElementById('edit-email').value = student.email;
      document.getElementById('edit-school').value = student.school;
      document.getElementById('edit-grade').value = student.grade;
      document.getElementById('edit-id').value = student.id;
      document.getElementById('edit-password').value = student.password;
          events: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value)
      document.getElementById('edit-form').onsubmit = function(e) {
        e.preventDefault();
        const updatedStudent = {
          name: document.getElementById('edit-name').value,
          email: document.getElementById('edit-email').value,
          school: document.getElementById('edit-school').value,
          grade: document.getElementById('edit-grade').value,
          id: document.getElementById('edit-id').value,
          password: document.getElementById('edit-password').value,
          events: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value)
        };
        studentRef.update(updatedStudent);
        closeModal();
        fetchStudents(currentPage);
      };
      openModal();
    });
  }

  // Delete student function
  function deleteStudent(studentKey) {
    if (confirm("Are you sure you want to delete this student?")) {
      db.ref('students/' + studentKey).remove();
      fetchStudents(currentPage);
    }
  }

  // Open modal
  function openModal() {
    document.getElementById('edit-modal').classList.remove('hidden');
  }

  // Close modal
  function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
  }

  // Update pagination info
  function updatePageInfo() {
    const pageInfo = document.getElementById('page-info');
    const totalPages = Math.ceil(totalStudents / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  // Pagination button event listeners
  document.getElementById('next-page').addEventListener('click', function() {
    if (currentPage * itemsPerPage < totalStudents) {
      fetchStudents(currentPage + 1);
    }
  });

  document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
      fetchStudents(currentPage - 1);
    }
  });

   // Open Add Student Modal
   document.getElementById('add-new-student-button').addEventListener('click', function() {
    document.getElementById('add-student-modal').classList.remove('hidden');
  });

  // Close Add Student Modal
  function closeAddModal() {
    document.getElementById('add-student-modal').classList.add('hidden');
  }

  // Add New Student to Firebase
  document.getElementById('add-student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newStudent = {
      name: document.getElementById('new-name').value,
      email: document.getElementById('new-email').value,
      school: document.getElementById('new-school').value,
      grade: document.getElementById('new-grade').value,
      id: document.getElementById('new-id').value,
      password: document.getElementById('new-password').value,
      events: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
.map(checkbox => checkbox.value)
    };

    // Push to Firebase
    db.ref('students').push(newStudent).then(() => {
      closeAddModal();
      fetchStudents(currentPage); // Re-fetch students to update the list
    });
  });


  // Initial Data Fetch
  getTotalStudentCount().then(() => fetchStudents(1));