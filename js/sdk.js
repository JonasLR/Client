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
        current: () => {
            return SDK.Storage.load("dsEvent");
        },
        updateEvent: (data, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/{idEvent}/update-event",
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
        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events",
            }, cb);
        },
        getAttendingStudents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + SDK.Event.current().id + "/students",
            }, cb);
        },
        joinEvent: (cb) => {
            SDK.request({
                method: "POST"
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
                method: "POST"
            }, (err, data) => {

                //On register-error
                if(err) return cb(err);

                SDK.Storage.persist("idToken", data.idToken);
                SDK.Storage.persist("idStudent", data.idStudent);
                SDK.Storage.persist("student", data.student);

                cb(null, data);
            });
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
    },
    Student: {
        current: (cb) => {
            SDK.request({
                method: "GET",
                url: "/student/profile",
            }, cb);
        },
        getAttendingEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/" + SDK.Student.current().id + "/events",
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
                <li><a href="home.html">Home</a></li>
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
        prefix: "DøkSocialSDK",
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