$(document).ready(() => {

    SDK.Student.loadNav();

    $("#loginButton").click(() => {

        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

        SDK.Student.login(email, password, (err, data) => {
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