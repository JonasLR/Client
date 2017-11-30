const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let token = {"authorization": localStorage.getItem("token")};

        /*let headers = {};
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
            data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
            success: (data, status, xhr) => {
                cb(null, SDK.Encryption.decrypt(data), status, xhr);
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

                localStorage.setItem("token", JSON.parse(data));

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
        logout: (cb) => {
            SDK.request({
                method: "POST",
                url: "/students/logout",
            }, (err, data) => {
                if (err) {
                    return cb(err);
                }
                cb(null, data);
            });
        },
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                var currentStudent = null;
                SDK.Student.current((err, res) => {
                    currentStudent = res;

                    if (currentStudent) {
                        $(".navbar-right").html(`
                              <li><a href="#" id="logout-link">Logout</a></li>          
                        `);
                    } else {
                        $(".navbar-right").html(`
                              <li><a href="login.html">Login <span class="sr-only">(current)</span></a></li>
                        `);
                    }
                    $("#logout-link").click(() => {
                        SDK.Student.logout((err, data) => {
                            if (err && err.xhr.status === 401) {
                                $(".form-group").addClass("has-error");
                            } else {
                                localStorage.removeItem("token");
                                localStorage.removeItem("idStudent");
                                window.location.href = "login.html";
                            }
                        });
                    });

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

    Encryption: {
        encrypt: (encrypt) => {
            if (encrypt !== undefined && encrypt.length !== 0) {
                const fields = ['J', 'M', 'F'];
                let encrypted = '';
                for (let i = 0; i < encrypt.length; i++) {
                    encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return encrypted;
            } else {
                return encrypt;
            }
        },
        decrypt: (decrypt) => {
            if (decrypt.length > 0 && decrypt !== undefined) {
                const fields = ['J', 'M', 'F'];
                let decrypted = '';
                for (let i = 0; i < decrypt.length; i++) {
                    decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return decrypted;
            } else {
                return decrypt;
            }
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