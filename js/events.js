$(document).ready(() => {

    SDK.Student.loadNav();

    const $eventList = $("#event-list");

    SDK.Event.getEvents((cb, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {

            let eventHtml = `
                <tr>
                    <td>${event.eventName}</td>
                    <td>${event.owner}</td>
                    <td>${event.location}</td>
                    <td>${event.price}</td>
                    <td>${event.eventDate}</td>
                    <td>${event.description}</td>
                    <td><button type="button" id="attend-button" class="btn btn-success attend-button" data-event-id="${event.idEvent}">Attend Event</button></td>
                    <td><button type="button" id="go-to-participants-button"  class="btn btn-success participants-button">See Participants</button></td>
                </tr>
                `;

            $eventList.append(eventHtml);
        });

        $(".attend-button").click(function() {
            const idEvent = $(this).data("event-id");
            const event = events.find((event) => event.idEvent === idEvent);
            console.log(event);
            SDK.Event.attendEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error")

                } else if (err) {
                    console.log("An error happened");
                        window.alert("Something happened - Try to attend the event again")
                } else {
                    window.location.href ="attendingEvents.html";
                }
            })
        });

        $(".go-to-participants-button").click(() => {
            window.location.href = "attendingStudents.html"
        });
    });
});