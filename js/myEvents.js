$(document).ready(() => {

    SDK.Student.loadNav();

    const $myEventList = $("#my-event-list");

    SDK.Event.getMyEvents((err, events) => {
        events = JSON.parse(events);
        events.forEach(event => {

        const eventHtml = `
            <tr>
                <td>${event.eventName}</td>
                <td>${event.owner}</td>
                <td>${event.location}</td>
                <td>${event.price}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
                <td><button type="button" id="go-to-update-event-button" class="btn btn-success update-event-button">Update</button></td>
                <td><button type="button" id="delete-event-button" class="btn btn-success delete-event-button">Delete</button></td>
            </tr>
            `;

            $myEventList.append(eventHtml);
        });

        $(".go-to-update-event-button").click(() => {
            window.location.href = "updateEvent.html"
        });

        $(".delete-event-button").click(function () {
            const idEvent = $(this).data("event-id");
            const event = events.find(e => e.id === idEvent);
            SDK.Event.deleteEvent(event);
        });
    });
});

