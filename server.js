/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Heer Patel     Student ID:103843223  Date: 11-17-2023 
*
* Published URL: 
* 
*
********************************************************************************/

var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");
const exphbs = require('express-handlebars');
var HTTP_PORT = process.env.PORT || 8080;
const promiseRejectionMessage = "No results returned";
const noResultMessage = "no results";
const internalErrorMessage = "Internal server error";
var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.set('view engine', '.hbs');
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return `<li class="nav-item">
                <a class="nav-link ${url == app.locals.activeRoute ? "active" : ""}" href="${url}">${options.fn(this)}</a>
            </li>`;
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper 'equal' needs 2 parameters");
            return lvalue != rvalue ? options.inverse(this) : options.fn(this);
        },
        compare: function(v1, v2) {
            return v1 == v2;
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

collegeData.initialize()
.then(()=>{
    app.get("/students", async (req, res) => {
        try {
            let students;
            if (req.query.course) {
                var course = parseInt(req.query.course);
                students = await collegeData.getStudentsByCourse(course);
            } else {
                students = await collegeData.getAllStudents();
            }

            if (students && students.length > 0) {
                res.render("students", { students: students });                
            } else {
                res.render("students", { message: noResultMessage });
            }
        } catch (err) {
            if (err === promiseRejectionMessage) {
                res.render("students", { message: noResultMessage });
            } else {
                console.error(err);
                res.status(500).render("students", { message: internalErrorMessage });
            }
        }
    });

    app.get("/courses", async (req, res) => {
        try {
            const courses = await collegeData.getCourses();
            if (courses && courses.length > 0) {
                res.render("courses", { courses: courses });

                
            } else {
                res.render("courses", { message: "no results" });
            }
        } catch (err) {
            console.error(err);
            res.render("courses", { message: "no results" });
        }
    });
    
    app.get("/course/:id", async (req, res) => {
        try {
            const course = await collegeData.getCourseById(req.params.id);
            if (course) {
                res.render("course", { course: course });
            } else {
                res.render("course", { message: "Course not found" });
            }
        } catch (err) {
            console.error(err);
            res.render("course", { message: "An error occurred" });
        }
    });


    
    app.get("/student/:num", async (req, res) => {
        try {
        const num = parseInt(req.params.num); 
        const matchedStudent = await collegeData.getStudentByNum(num);
            if (matchedStudent) {
                console.log("Student found:", matchedStudent);
                res.render("student", { student: matchedStudent });
            } else {
                res.render("student", { message: "student not found" });
            }
        } catch (err) {
            console.error(err);
            res.render("student", { message: "An error occurred" });
        }

    });
    

    app.post('/students/add', async (req, res) => {
        try {
         const createdStudent = await collegeData.addStudent(req.body);      
          res.redirect('/students');
        } catch (error) {
          res.status(500).json({message:"Error adding student"});
        }
      });
      
   
    app.post("/student/update", (req, res) => {
        collegeData.updateStudent(req.body)
            .then(() => {
                console.log("Student updated:", req.body);
                res.redirect("/students");
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Unable to update student");
            });
    });

    app.get("/",(req,res)=>{
        res.render('home');
    });
    
    app.get("/about",(req,res)=>{
        res.render('about'); 
    });

    app.get("/htmlDemo",(req,res)=>{
        res.render('htmlDemo'); 
    });

     app.get("/students/add",(req,res)=>{
        res.render('addStudent'); 
    });

    
    app.use((req,res)=>{
      res.status(404).sendFile(path.join(__dirname,"views","pageNotFound.html"));
        
    });

    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

})
.catch(err => {
    console.error("Initalizastion error",err);
});
