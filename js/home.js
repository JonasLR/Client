$(document).ready(() => {

    SDK.Student.loadNav();

    const $eventList = $("#event-list");

    SDK.Event.findAllEvents((err, events) => {
        if (err) throw err;
        events.forEach(event => {

            const eventHtml = `<!--tegnet før og efter nedenstående gør at man kan skrive html kode-->
        <div class="container">
           <table class="table">
              <tr>
                <th>Event Name</th>
                <td>${event.eventName}</td>
                <th>Location</th>
                <td>${event.location}</td>
                <th>Event Date</th>
                <td>${event.eventDate}</td>
                <th>Description</th>
                <td>${event.description}</td>
                <th>Price</th>
                <td>${event.price}</td>
              </tr>
           </table>
        </div>`;

            $eventList.append(eventHtml);
        });

        $(".attend-button").click(function () {
            const idEvent = $(this).data("event-id");
            const event = events.find(e => e.id === idEvent);
            SDK.Event.attendEvent(event);
        });
    });
})

