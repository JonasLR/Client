const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let token = {"authorization": localStorage.getItem("token")}
      /*  let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }*/

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
              error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    Event: {
        attendEvent: (event) => {
            let attendingStudents = SDK.Storage.load("attendingStudents");

            //check if the event exists, and if true add the event
            let foundEvent = attendingStudents.find(e => e.event.id === event.id);
            if (foundEvent) {
                let i = attendingStudents.indexOf(foundEvent);
                attendingStudents[i].count++;
            } else {
                attendingStudents.push({
                    count: 1,
                    event: event
                });
            }

            SDK.Storage.persist("attendingStudents", attendingStudents);
        },
        currentEvent: () => {
            return SDK.Storage.load("dsEvent");
        },
        updateEvent: (data, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/" + SDK.Event.currentEvent().id + "/update-event",
                data: data,
                headers: {authorization: SDK.Storage.load("idToken")}
            }, cb);
        },
        createEvent: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/events",
                data: data,
                headers: {authorization: SDK.Storage.load("idToken")}
            }, cb);
        },
        deleteEvent: (data, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/" + SDK.Event.currentEvent().id + "/delete-event",
                data: data,
                headers: {authorization: SDK.Storage.load("idToken")}
            }, cb);
        },
        getEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events",
            }, cb);
        },
        getAttendingStudents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + SDK.Event.currentEvent().id + "/students",
                headers: {
                    authorization: SDK.Storage.load("idToken")
                }
            }, cb);
        },
        joinEvent: (cb) => {
            SDK.request({
                method: "POST",
                url: "/events/join",
                headers: {authorization: SDK.Storage.load("idToken")}
            }, cb);
        },
    },
    Register: {
        register: (firstName, lastName, password, cb) => {
            SDK.request({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                },
                url: "/register",
                method: "POST",
                headers: {authorization: SDK.Storage.load("idToken")}
        }, cb);
        },
    },
    Student: {
        login: (email, password, cb) => {
            SDK.request({
                data: {
                    email: email,
                    password: password
                },
                url: "/login",
                method: "POST"
            }, (err, data) => {

                //On login-error
                if(err) return cb(err);

                localStorage.setItem("token", data);

                cb(null, data);
            });
        },
        current: () => {
            return SDK.Storage.load("Student");
        },
        currentStudent: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
            }, cb);
        },
        getAttendingEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/" + SDK.Student.currentStudent().idStudent + "/events",
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, cb);
        },
        logOut: () => {
            SDK.Storage.remove("idTokens");
            SDK.Storage.remove("idStudent");
            SDK.Storage.remove("student");
            window.location.href = "login.html";
        },
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentStudent = SDK.Student.current();
                if (currentStudent) {
                    $(".navbar-right").html(`
            <li><a href="home.html">Events</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                } else {
                    $(".navbar-right").html(`
            <li><a href="login.html">Login <span class="sr-only">(current)</span></a></li>
          `);
                }
                $("#logout-link").click(() => SDK.Student.logOut());
                cb && cb();
            });
        }
    },
    Storage: {
        prefix: "doekEventsSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};