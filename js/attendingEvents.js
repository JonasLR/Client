$(document).ready(() => {

    SDK.Student.loadNav();

    const $attendingEventList = $("#attending-event-list");

    SDK.Student.getAttendingEvents((cb, events) => {
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
            </tr>
            `;

            $attendingEventList.append(eventHtml);
        });
    });
});
