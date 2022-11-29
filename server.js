/************************************************************************* * 
 * BTI325– Assignment 4 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part * 
 * of this assignment has been copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. * 
 * Name: Mohammed Aminoor Rahman Student ID: 166562215 Date: October 20th, 2022 * 
 * Your app’s URL (from HEROKU) :   * 
 **************************************************************************/




var express = require("express");
const exphbs = require('express-handlebars');
const { type } = require("os");
var app = express();
const multer = require("multer");
var path = require("path");
const fs = require('node:fs');


var dataServiceAuth = require("./data-service-auth");
var data_service = require("./data-service");
var clientSessions = require("client-sessions");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);

}

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "wedrftgbStainedDinginessBountifulSardineDeepenCongenialDiagnosisyhn@5@VGrW1@4HEo*9OTJCurtsySystemCountyPassageUnnaturalChlorineThievishRantingbk*X14U5q%2Bo5K%c^Eg*$uerftgyhunjimkoasedrftgvybhuijnmko,pNIa$891^C*#2%0lgR4!0Bu47x3AZHVDq6oRu^X%8lt$%Bj1Ts!13ds$6PKa0T6M^YJOnCcv^45mWh67*1!*mpF9%tf4#TKG00*cY3@N90&WIiE^HvxK3j2p3#", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));


app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

app.get("/", function (req, res) {
    res.render('home', {
        layout: "main.hbs"
    });
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.render('about', {
        layout: "main.hbs"
    });
});


app.get("/employees/add", ensureLogin, function (req, res) {

    data_service.getDepartments().then((dept) => {
        res.render('addEmployee', { data: dept });
    }).catch((mesg) => {
        res.render('addEmployee', { data: [] }, { layout: "main.hbs" });
    })

});

app.get("/images/add", ensureLogin, function (req, res) {
    res.render('addImage', {
        layout: "main.hbs"
    });

});

app.get("/departments/add", ensureLogin, function (req, res) {
    res.render('addDepartment', {
        layout: "main.hbs"
    });
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data_service.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.get("/department/:departmentId", ensureLogin, function (req, res) {


    data_service.getDepartmentById(req.params.departmentId).then((dept) => {
        if (dept == null) { res.status(404).send("Department Not Found"); }
        res.render("department", { data: dept });
    }).catch((mesg) => {
        res.status(404).send("Department Not Found");
    })

});

app.get("/employees", ensureLogin, function (req, res) {

    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((emp) => {
            if (emp.length > 0) {
                res.render("employees", { data: emp })
            }
            else { res.render("employees", { message: "no results" }); }
        }).catch((mesg) => {
            res.render("employees", { message: mesg });
        })

    }
    else if (req.query.department) {

        data_service.getEmployeesByDepartment(req.query.department).then((emp) => {
            if (emp.length > 0) {
                res.render("employees", { data: emp })
            }
            else { res.render("employees", { message: "no results" }); }
        }).catch((mesg) => {
            res.render("employees", { message: mesg });
        })


    }
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then((emp) => {
            if (emp.length > 0) {
                res.render("employees", { data: emp })
            }
            else { res.render("employees", { message: "no results" }); }
        }).catch((mesg) => {
            res.render("employees", { message: mesg });
        })

    }
    else {
        data_service.getAllEmployees().then((emp) => {
            if (emp.length > 0) {
                res.render("employees", { data: emp })
            }
            else { res.render("employees", { message: "no results" }); }
        }).catch((mesg) => {
            res.render("employees", { message: mesg });
        })
    }

});


app.get("/departments", ensureLogin, function (req, res) {

    data_service.getDepartments().then((dept) => {
        if (dept.length > 0) {
            res.render("departments", { data: dept });
        }
        else { res.render("departments", { message: "no results" }); }
    }).catch((mesg) => {
        res.render("departments", { message: mesg });
    })

});

app.get("/images", ensureLogin, function (req, res) {

    fs.readdir("./public/images/uploaded", function (err, items) {

        if (err) {
            console.log("Error reading Directory");
        }
        else {
            res.render('images', {
                data: items,
                layout: "main.hbs"
            });

        }

    })
});

app.get("/employees/delete/:empNum", ensureLogin, function (req, res) {

    data_service.deleteEmployeeByNum(req.params.empNum).then(() => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    })

});

app.get('/login', function (req, res) {
    res.render('login', {
        layout: "main.hbs"
    });
});


app.get('/register', function (req, res) {
    res.render('register', {
        layout: "main.hbs"
    });
});

app.get('/logout', function (req,res){
    req.session.reset();
    res.redirect('/');
});

app.get('/userHistory', ensureLogin, function(req,res){
    res.render('userHistory',{
        layout: "main.hbs"
    })
});

app.get('*', function (req, res) {
    var text = 'Error:404 <br/> You are not supposed to be here. <br/> Why are you still here? <br/> If you like this page, then alright, you can stay here.';
    text += '<br/> Or you can go back Home and explore the Website.';
    text += "<a href='/'> Home </a>";

    res.send(text, 404);
});


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });



/////////////////////////////////////////////////////////////////LOGIN ROUTES////////////////////////////////////////////////////////


app.post("/register", (req, res) => {

    dataServiceAuth.registerUser(req.body).then(() => {
        res.render('register', {
            successMessage: "User created",
            layout: "main.hbs"
        });
    }).catch((err) => {
        res.render('register', {
            errorMessage: err,
            userName: req.body.userName,
            layout: "main.hbs"
        });
    });

});

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body).then((user) => {
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch((err) => {
        res.render('login', {
            errorMessage: err, userName: req.body.userName,
            layout: "main.hbs"
        });
    });
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {

    res.redirect("/images");

});

app.post("/employees/add", ensureLogin, (req, res) => {


    data_service.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(() => {
        console.log('ERROR');
    })

});

app.post("/employee/update", ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Update Employee");
    });
});

app.post("/departments/add", ensureLogin, (req, res) => {

    data_service.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to add Department");
    });

});

app.post("/department/update", ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Update Department");
    });
});

// setup http server to listen on HTTP_PORT
// data_service.initialize().then(()=>{
//     //console.log("Test");
//     dataServiceAuth.initialize().then(()=>{
//         console.log("Test2");
//         app.listen(HTTP_PORT, onHttpStart);
//     }).catch((err)=>{
//         console.log("unable to start server: " + err);
//     });
//   }).catch((mesg)=>{
//     console.log(mesg);
//   });

data_service.initialize()
    .then(dataServiceAuth.initialize)
    .then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("app listening on: " + HTTP_PORT)
        });
    }).catch(function (err) {
        console.log("unable to start server: " + err);
    });