$(document).ready(() => {

    SDK.Student.loadNav();
    const currentStudent = SDK.Student.current();
    const $basketTbody = $("#basket-tbody");

    $(".page-header").html(`
    <h1>Hi, ${currentStudent.firstName} ${currentStudent.lastName}</h1>
  `);

    $(".profile-info").html(`
    <dl>
        <dt>Name</dt>
        <dd>${currentStudent.firstName} ${currentStudent.lastName}</dd>
        <dt>Email</dt>
        <dd>${currentStudent.email}</dd>
     </dl>
  `);
});