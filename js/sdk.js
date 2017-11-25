const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let token = {"authorization": SDK.Storage.load("token")};

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
        current: () => {
            return SDK.Storage.load("Event");
        },
        updateEvent: (data, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/" + SDK.Event.current().id + "/update-event",
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
                url: "/events/" + SDK.Event.current().id + "/delete-event",
                data: data,
                headers: {authorization: SDK.Storage.load("idToken")}
            }, cb);
        },
        getEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/events",
            }, cb);
        },
        getAttendingStudents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + SDK.Event.current().id + "/students",
                headers: {
                    authorization: SDK.Storage.persist("token")
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
        getMyEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + SDK.Student.currentStudent().id + "/myEvents",
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, cb);
        },
    },
    Student: {
        register: (firstName, lastName, email, password, verifyPassword, cb) => {
            SDK.request({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    verifyPassword: verifyPassword
                },
                url: "/register",
                method: "POST",
            }, (err, data) => {

                if (err) {
                    return cb(err);
                }

                console.log(data);

                SDK.Storage.persist("token", data);

                cb(null, data);
            });
        },
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

                SDK.Storage.persist("token", data);

                cb(null, data);
            });
        },
        current: () => {
            return SDK.Storage.load("token");
        },
        currentStudent: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
                headers: {authorization: SDK.Storage.load("token")}
            }, cb);
        },
        getAttendingEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/" + SDK.Student.current().id + "/events",
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, cb);
        },
        logout: () => {
            SDK.Storage.remove("token");
            SDK.Storage.remove("IdStudent");
            SDK.Storage.remove("Student");
            window.location.href = "login.html";
        },
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentStudent = SDK.Student.current();

                if (currentStudent) {
                    $(".navbar-right").html(`
            <li><a href="login.html" id="logout-link">Logout</a></li>
          `);
                } else {
                    $(".navbar-right").html(`
            <li><a href="login.html">Login <span class="sr-only">(current)</span></a></li>
          `);
                }
                $("#logout-link").click(() => SDK.Student.logout());
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