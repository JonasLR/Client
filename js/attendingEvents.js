$(document).ready(() => {

    SDK.Student.loadNav();

    const $AttendingEventList = $("#attending-event-list");

    SDK.Student.getAttendingEvents((err, events) => {
        events = JSON.parse(events);
        events.forEach(event => {

        const eventHtml = `
            <tr>
                <td>${event.eventName}</td>
                <td>${event.location}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
                <td>${event.price}</td>
            </tr>
            `;

            $AttendingEventList.append(eventHtml);
        });
    });
});
