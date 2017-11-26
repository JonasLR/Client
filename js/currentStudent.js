$(document).ready(() => {

    SDK.Student.loadNav();

    const $currentStudent = $("#current-student-list");

    SDK.Student.currentStudent((cb, currentStudent) => {
        currentStudent = JSON.parse(currentStudent);

        const currentStudentHtml = `
            <tr>
                <td>${currentStudent.firstName}</td>
                <td>${currentStudent.lastName}</td>
                <td>${event.email}</td>
            </tr>
            `;

        $currentStudent.append(currentStudentHtml);
    });
});