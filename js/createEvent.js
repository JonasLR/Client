$(document).ready(() => {

    SDK.Student.loadNav();

    $("#createEventButton").click(() => {

        const eventName = $("#registerEventName").val();
        const location = $("#registerLocation").val();
        const eventDate = $("#registerEventDate").val();
        const description = $("#registerDescription").val();
        const price = $("#registerPrice").val();

        SDK.Event.createEvent((eventName, location, eventDate, description, price) => {
                window.location.href = "home.html";
        });

    });

});