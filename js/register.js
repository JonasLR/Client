$(document).ready(() => {

    SDK.Student.loadNav();

    $("#registerButton").click(() => {

        const firstName = $("#registerFirstName").val();
        const lastName = $("#registerLastName").val();
        const email = $("#registerEmail").val();
        const password = $("#registerPassword").val();
        const verifyPassword = $("#verifyPassword").val();

        if (!firstName || !lastName || !email || !password || !verifyPassword) {
            window.alert("Please fill out empty fields")

        } else {
            if (password !== verifyPassword) {
                window.alert("Please correct unmatching passwords");
                return;
            }

            SDK.Student.register(firstName, lastName, email, password, verifyPassword, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error");
                }
                else if (err) {
                    console.log("Something went wrong. Please try again")
                } else {
                    window.alert("Please login with your new user");
                    window.location.href = "login.html";
                }
            });
        }
    });
});