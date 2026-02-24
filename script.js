const addBtn = document.getElementById('add-btn');
const cancelBtn = document.getElementById('cancel-btn');
const container = document.querySelector('.add-student-container');
const editTitle = document.getElementById('title');

addBtn.addEventListener('click', function(){
    container.classList.add('active');
    editTitle.textContent = 'Add Student'
});

cancelBtn.addEventListener('click', function(){
    container.classList.remove('active');
    clearAllError();
    editTitle.textContent = 'Add Student'
});

function showError(input, error, message) {
    error.innerHTML = message;
    error.classList.add('active');
    input.style.border = '2px solid red';
}

function clearError(input, error) {
    error.innerHTML = '';
    error.classList.remove('active');
    input.style.border = 'none';
}

function clearAllError(){
    clearError(inputId, idError);
    clearError(inputFirst, fNameError);
    clearError(inputLast, lNameError);
    clearError(inputAge, ageError);
    clearError(inputYear, yearError);
    clearError(inputCourse, courseError);
}

let students = [];

const tableBody = document.querySelector('#student-table tbody');

function displayTable(students){
    tableBody.innerHTML = '';

    if(students.length === 0){
        tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="font-size: 1.5em; color: grey;">No students found.</td>
        </tr>`;
        return;
    }

    for(let i = 0; i < students.length; i++){
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${students[i].id}</td>
            <td>${students[i].name}</td>
            <td>${students[i].age}</td>
            <td>${students[i].year}</td>
            <td>${students[i].course}</td>
            <td>
                <button class="edit-btn" data-id="${students[i].id}">Edit</button>
                <button class="delete-btn" data-id="${students[i].id}">Delete</button>
            </td>`;
        tableBody.appendChild(tr);
    }
}

displayTable(students);

const submitBtn = document.getElementById('submit-btn');
const inputId = document.getElementById('studentId');
const inputFirst = document.getElementById('studentFirstname');
const inputLast = document.getElementById('studentLastname');
const inputAge = document.getElementById('studentAge');
const inputYear = document.getElementById('studentYear');
const inputCourse = document.getElementById('studentCourse');

const idError     = document.getElementById('idError');
const fNameError  = document.getElementById('fNameError');
const lNameError  = document.getElementById('lNameError');
const ageError    = document.getElementById('ageError');
const yearError   = document.getElementById('yearError');
const courseError = document.getElementById('courseError');

inputId.addEventListener('input', function(){
    clearError(inputId, idError);
});

inputFirst.addEventListener('input', function() {
    clearError(inputFirst, fNameError);
});

inputLast.addEventListener('input', function() {
    clearError(inputLast, lNameError);
});

inputAge.addEventListener('input', function() {
    clearError(inputAge, ageError);
});

inputYear.addEventListener('change', function() {
    clearError(inputYear, yearError);
});

inputCourse.addEventListener('change', function() {
    clearError(inputCourse, courseError);
});

let editingRow = null;

submitBtn.addEventListener('click', function(){

    const id = inputId.value.trim().toUpperCase();
    const firstName = inputFirst.value.trim().toUpperCase();
    const lastName = inputLast.value.trim().toUpperCase();
    const age = inputAge.value.trim();
    const yearLvl = inputYear.value;
    const course = inputCourse.value.trim();

    let hasError = false;

    if(!id){
        showError(inputId, idError, '<i>Please enter a valid Student Id.</i>');
        hasError = true;
    } else if(!id.startsWith('UA2025')){
        showError(inputId, idError, '<i>Please enter a valid Student Id (e.g. UA202502003 must be 11 characters).</i>');
        hasError = true;
    } else if(id.length !== 11){
        showError(inputId, idError, '<i>Please enter a valid Student Id (e.g. UA202502003 must be 11 characters).</i>');
        hasError = true;
    }

    if(!firstName){
        showError(inputFirst, fNameError, '<i>Please enter a valid name.</i>');
        hasError = true;
    }

    if(!lastName){
        showError(inputLast, lNameError, '<i>Please enter a valid name.</i>');
        hasError = true;
    }

    if(!age){
        showError(inputAge, ageError, '<i>Please enter a valid age.</i>');
        hasError = true;
    }

    if(!yearLvl){
        showError(inputYear, yearError, '<i>Please select a valid year.</i>');
        hasError = true;
    }

    if(!course){
        showError(inputCourse, courseError, '<i>Please enter a valid course</i>');
        hasError = true;
    }

    if(hasError) return;

    const fullName = `${firstName} ${lastName}`;

    if(editingRow !== null){
        students[editingRow] = { id, name: fullName, age, year: yearLvl, course };
        editingRow = null;
    } else {
        const duplicate = students.some(function(s){
            return s.id === id;
        });

        if(duplicate){
            showError(inputId, idError, `<i>Student ID "${id}" already exists.</i>`);
            return;
        }

        students.push({ id, name: fullName, age, year: yearLvl, course });
    }

    displayTable(students);
    container.classList.remove('active');
    clearAllError();
    clearForm();
});

tableBody.addEventListener('click', function(event){
    const btn = event.target.closest('button');
    if(!btn || !btn.classList.contains('edit-btn')) return;

    const id = btn.dataset.id;
    const index = students.findIndex(s => s.id === id);
    const student = students[index];
    const [firstName, ...rest] = student.name.split(' ');

    inputId.value     = student.id;
    inputFirst.value  = firstName;
    inputLast.value   = rest.join(' ');
    inputAge.value    = student.age;
    inputYear.value   = student.year;
    inputCourse.value = student.course;

    editingRow = index;
    clearAllError();
    container.classList.add('active');
    editTitle.textContent = 'Edit Student';
});

const warningContainer = document.getElementById('warning-container');
const warningDeleteBtn = document.getElementById('warning-delete-btn');
const warningCancelBtn = document.getElementById('warning-cancel-btn');

let deleteIndex = null;

tableBody.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if(!btn || !btn.classList.contains('delete-btn')) return;

    const id = btn.dataset.id;
    deleteIndex = students.findIndex(s => s.id === id);
    warningContainer.classList.add('active');
});

warningDeleteBtn.addEventListener('click', function() {
    if(deleteIndex !== null){
        students.splice(deleteIndex, 1);
        displayTable(students);
        deleteIndex = null;
    }
    warningContainer.classList.remove('active');
});

warningCancelBtn.addEventListener('click', function() {
    deleteIndex = null;
    warningContainer.classList.remove('active');
});

const searchBar = document.getElementById('search-bar');

function searchStudent() {
    const search = searchBar.value.trim().toUpperCase();

    if(!search){
        displayTable(students);
        return;
    }

    const filtered = students.filter(function(s){
        return s.name.toUpperCase().includes(search) ||
               s.id.toUpperCase().includes(search);
    });

    displayTable(filtered);
}

searchBar.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') searchStudent();
});

searchBar.addEventListener('input', searchStudent);

function clearForm() {
    inputId.value     = '';
    inputFirst.value  = '';
    inputLast.value   = '';
    inputAge.value    = '';
    inputYear.value   = '';
    inputCourse.value = '';
}
