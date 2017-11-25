$(document).ready(() => {

    SDK.Student.loadNav();

    const $AttendingEventList = $("#attending-event-list");

    SDK.Student.getAttendingEvents((err, events) => {
        events = JSON.parse(events);
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

            $AttendingEventList.append(eventHtml);
        });
    });
});
