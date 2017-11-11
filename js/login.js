$(document).ready(() => {

    SDK.Student.loadNav();

    $("#loginButton").click(() => {

        const firstName = $("#inputFirstName").val();
        const lastName = $("#inputLastName").val();
        const password = $("#inputPassword").val();

        SDK.Student.login(firstName, lastName, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
              console.log("Something went wrong. Please try again")
            } else {
                window.location.href = "home.html";
            }
        });
    });
});