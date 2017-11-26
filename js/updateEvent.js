$(document).ready(() => {

    SDK.Student.loadNav();

    $("#update-event-button").click(() => {

        const eventName = $("#updateEventName").val();
        const location = $("#updateLocation").val();
        const eventDate = $("#updateEventDate").val();
        const description = $("#updateDescription").val();
        const price = $("#updatePrice").val();

        SDK.Event.updateEvent(eventName, location, eventDate, description, price, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                console.log("Something went wrong. Please try again")
            } else {
                window.alert("Your event is updated");
                window.location.href = "myEvents.html";
            }
        });
    });
});