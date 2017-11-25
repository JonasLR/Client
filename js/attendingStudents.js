$(document).ready(() => {

    SDK.Student.loadNav();

    const $AttendingStudentsList = $("#attending-students-list");

    SDK.Event.getAttendingStudents((err, students) => {
        students = JSON.parse(students);
        students.forEach(student => {

            const studentHtml = `
            <tr>
                <td>${student.idStudent}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
            </tr>
            `;

            $AttendingStudentsList.append(studentHtml);
        });
    });
});
