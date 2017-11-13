const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
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
    Login: {
        login: (firstName, lastName, password, cb) => {
            SDK.request({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                },
                url: "/login",
                method: "POST"
            }, (err, data) => {

                //On login-error
                if(err) return cb(err);

                SDK.Storage.persist("idToken", data.idToken);
                SDK.Storage.persist("idStudent", data.idStudent);
                SDK.Storage.persist("student", data.student);

                cb(null, data);
            });
        },
    },
    Student: {
        currentStudent: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
            }, cb);
        },
        getAttendingEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/" + SDK.Student.currentStudent().id + "/events",
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
                const currentStudent = SDK.Student.currentStudent();
            if (currentStudent) {
                $(".navbar-right").html(`
                <li><a href="home.html">Home</a></li>
                <li><a href="create%20event.html">Create Event</a></li>
                <li><a href="registered%20events.html">Registered Events</a></li>
                <li><a href="about.html">About</a></li>
               `);
            cb && cb();
            }
        })
    },

    Storage: {
        prefix: "DoekSocialSDK",
            persist:
        (key, value) => {
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