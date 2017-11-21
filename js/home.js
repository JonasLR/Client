$(document).ready(() => {

    SDK.Student.loadNav();

    const $eventList = $("#event-list");
    const $eventModal = $('#event-modal');
    const $modalTbody = $("#basket-tbody");

    SDK.Event.getEvents((cb, events) => {
        events = JSON.parse(events);
        events.forEach(event => {

            const eventHtml = `<!--tegnet før og efter nedenstående gør at man kan skrive html kode-->
        <div class="col-lg-4 event-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${event.eventName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>
                        <dt>Location</dt>
                        <dd>${event.location}</dd>
                        <dt>eventDate</dt>
                        <dd>${event.eventDate}</dd>
                        <dt>description</dt>
                        <dd>${event.description}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${event.price}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success attend-button" data-book-id="${event.idEvent}">Attend Event</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            $eventList.append(eventHtml);
        });

        $(".attend-button").click(function () {
            const idEvent = $(this).data("event-id");
            const event = events.find(e => e.id === idEvent);
            SDK.Event.attendEvent(event);
        });
    });
//When modal opens
    $eventModal.on('shown.bs.modal', () => {

        const eventBasket = SDK.Storage.load("eventBasket");
        let total = 0;

        eventBasket.forEach(entry => {
            let subtotal = entry.event.price * entry.count;
            total += subtotal;
            $modalTbody.append(`
        <tr>
            <td>${entry.event.eventName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.event.price}</td>
            <td>kr. ${subtotal}</td>
        </tr>
      `);
        });

        $modalTbody.append(`
      <tr>
        <td colspan="3"></td>
        <td><b>Total</b></td>
        <td>kr. ${total}</td>
      </tr>
    `);

    });

    //When modal closes
    $eventModal.on("hidden.bs.modal", () => {
        $modalTbody.html("");
    });

});

