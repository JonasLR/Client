$(document).ready(() => {

    SDK.Student.loadNav();

    const $eventList = $("#event-list");
    const $goToParticipantsButton = $("#goToParticipantsButton");

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
                    <td><button type="button" id="attendButton" class="btn btn-success attendButton" data-event-id="${event.idEvent}">Attend Event</button></td>
                    <td><button type="button" class="btn btn-success goToParticipantsButton" data-event-id="${event.idEvent}"
                    data-toggle="modal" data-target="#participantsModal">See Participants</button></td>
                </tr>
                `;

            $eventList.append(eventHtml);
        });

        $(".attendButton").click(function() {
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

        $(".goToParticipantsButton").click(function() {
            var idEvent = $(this).data("event-id");

            console.log(idEvent);

            SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
                if (students) {
                    students = JSON.parse(students);
                    students.forEach((student) => {

                        const studentsHtml = `
                        <tr>
                            <td>${student.firstName}</td> 
                            <td>${student.lastName}</td>
                        </tr>
                            
                    `;

                        $goToParticipantsButton.append(studentsHtml)
                    });
                } else {
                    $("#goToParticipantsButton").html("Something happened, try again");
                }
            });
        });
    });
    $("#clearModalText").click(function () {
        $("#goToParticipantsButton").html("");
    });
});