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
        attendingEvents: (dsEvent) => {
            let attendingEvents = SDK.Storage.load("attendingEvents");

            //Has no attending events
            if (!attendingEvents) {
                return SDK.Storage.persist("attendingEvents", [{
                    count: 1,
                    dsEvent: dsEvent
                }]);
            }

            //Does the event already exist?
            let foundAttendingEvents = attendingEvents.find(dsEvent => dsEvent.dsEvent.id === dsEvent.id);
            if (foundAttendingEvents) {
                let i = attendingEvents.indexOf(foundAttendingEvents);
                attendingEvents[i].count++;
            } else {
                attendingEvents.push({
                    count: 1,
                    book: dsEvent
                });
            }

            SDK.Storage.persist("basket", basket);
        },
        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/books",
                headers: {
                    filter: {
                        include: ["authors"]
                    }
                }
            }, cb);
        }
    ,
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/books",
                data: data,
                headers: {authorization: SDK.Storage.load("tokenId")}
            }, cb);
        }
    },
    Author: {
        findAll: (cb) =>{
            SDK.request({method: "GET", url: "/authors"}, cb);
        }
    },
    Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/orders",
                data: data,
                headers: {authorization: SDK.Storage.load("tokenId")}
            }, cb);
        },
        findMine: (cb) => {
            SDK.request({
                method: "GET",
                url: "/orders/" + SDK.User.current().id + "/allorders",
                headers: {
                    authorization: SDK.Storage.load("tokenId")}
            }, cb);
        }
    },
    Student: {
        current: () => {
            return SDK.Storage.load("student");
        },
        logOut: () => {
            SDK.Storage.remove("idTokens");
            SDK.Storage.remove("idStudent");
            SDK.Storage.remove("student");
            window.location.href = "index.html";
        },
        login: (firstName, lastName, password, cb) => {
            SDK.request({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                },
                url: "/students/login?include=user",
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
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentUser = SDK.Student.current();
            if (currentStudent) {
                $(".navbar-right").html(`
                <li><a href="home.html">Attending Events</a></li>
                <li><a href="#" id="logout-link">Logout</a></li>
              `);
            } else {
                $(".navbar-right").html(`
                <li><a href="login.html">Login <span class="sr-only">(current)</span></a></li>
              `);
            }
            $("#logout-link").click(() => SDK.Student.logOut()
        );
            cb && cb();
        });
        }
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