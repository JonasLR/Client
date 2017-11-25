$(document).ready(() => {

    SDK.Student.loadNav();

    const $myEventList = $("#my-event-list");

    SDK.Event.getMyEvents((err, events) => {
        events = JSON.parse(events);
        events.forEach(event => {

        const eventHtml = `
            <tr>
                <td>${event.eventName}</td>
                <td>${event.location}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
                <td>${event.price}</td>
                <td><button type="button" id="update-event-button" class="btn btn-success update-event-button">Update Event</button></td>
            </tr>
            `;

            $myEventList.append(eventHtml);
        });

        $(".update-event-button").click(function () {
            const idEvent = $(this).data("event-id");
            const event = events.find(e => e.id === idEvent);
            SDK.Event.updateEvent(event);
        });
    });
});

