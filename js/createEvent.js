$(document).ready(() => {

    SDK.Student.loadNav();

    $("#createEventButton").click(() => {

        const eventName = $("#registerEventName").val();
        const location = $("#registerLocation").val();
        const eventDate = $("#registerEventDate").val();
        const description = $("#registerDescription").val();
        const price = $("#registerPrice").val();

        SDK.Event.createEvent(eventName, location, eventDate, description, price, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Something went wrong. Please try again")
            } else {
                window.alert("Your event is created");
                window.location.href = "myEvents.html";
            }
        });
    });
});