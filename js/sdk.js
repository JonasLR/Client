const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let token = {"authorization": localStorage.getItem("token")};

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
        attendEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    price: price,
                    location: location,
                    description: description,
                    eventDate: eventDate,
                },
                method: "POST",
                url: "/events/join"
            }, (err, data) => {

                if (err) return cb(err);

                cb(null, data);
            });
        },
        current: () => {
            return SDK.Storage.load("Event");
        },
        updateEvent: (eventName, location, eventDate, description, price, idEvent, cb) => {
            SDK.request({
                data: {
                    eventName: eventName,
                    location: location,
                    eventDate: eventDate,
                    description: description,
                    price: price
                },
                method: "PUT",
                url: "/events/" + idEvent + "/update-event",
            }, (err, data) => {

                if (err) return cb(err);

                SDK.Storage.persist("crypted", data);

                cb(null, data);
            });
        },
        createEvent: (eventName, location, eventDate, description, price, cb) => {
            SDK.request({

                data: {
                    eventName: eventName,
                    location: location,
                    eventDate: eventDate,
                    description: description,
                    price: price
                },
                method: "POST",
                url: "/events"
            }, (err, data) => {
                    if (err) return cb(err);

                    cb(null, data);
            });
        },
        deleteEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    location: location,
                    price: price,
                    eventDate: eventDate,
                    description: description,
                },
                method: "PUT",
                url: "/events/" + idEvent + "/delete-event",
            }, cb);
        },
        getEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/events",
                headers: {
                    filter: {
                        include: ["events"]
                    }
                }
            }, cb);
        },
        getAttendingStudents: (idEvent, cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students",
            }, cb);
        },
        getMyEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + localStorage.getItem("idStudent") + "/myEvents",
            }, cb);
        },
    },
    Student: {
        register: (firstName, lastName, email, password, verifyPassword, cb) => {
            SDK.request({
                method: "POST",
                url: "/register",
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    verifyPassword: verifyPassword
                },

            }, (err, data) => {

                if (err) return cb(err);

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

                localStorage.setItem("token", data);

                cb(null, data);
            });
        },
        current: (cb) => {
            SDK.request({
                url: "/students/profile",
                method: "GET"
            }, (err, data) => {

                if (err) return cb(err);

                localStorage.setItem("idStudent", JSON.parse(data).idStudent);

                cb(null, data);
            });
        },
        currentStudent: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
                headers: {authorization: SDK.Storage.load("token")}
            }, cb);
        },
        getAttendingEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/students/" + localStorage.getItem("idStudent") + "/events",
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
                var currentStudent = null;
                SDK.Student.current((err, res) => {
                    currentStudent = res;

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
                });
                cb && cb();
            });
        }
    },

    Link: {
      getParameterByName: (name) => {
          var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
          return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
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