$(document).ready(() => {

    SDK.Student.loadNav();

    const $eventList = $("#event-list");

    SDK.Event.getEvents((cb, events) => {
        events = JSON.parse(events);
        events.forEach(event => {

            const eventHtml = `<!--tegnet før og efter nedenstående gør at man kan skrive html kode-->
                <tr>
                    <td>${event.name}</td>
                    <td>${event.owner}</td>
                    <td>${event.location}</td>
                    <td>${event.price}</td>
                    <td>${event.date}</td>
                    <td>${event.description}</td>
                    <td><button type="button" id="attend-button" class="btn btn-success attend-button">Attend Event</button></td>
                </tr>
                `;

            $eventList.append(eventHtml);
        });

        $(".attend-button").click(function () {
            const idEvent = $(this).data("event-id");
            const event = events.find(e => e.id === idEvent);
            SDK.Event.attendEvent(event);
        });

    });
});