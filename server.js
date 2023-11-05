/********************************************************************************* 
 WEB700 – Assignment 03** I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:*
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html*
 * * Name: Heer Patel Student ID: 103843223 Date: 14/10/2023
 * *********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const collegeData = require("./modules/collegeData.js");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

collegeData.initialize()
.then(()=>{

app.get("/students", (req, res) => {
  collegeData.getAllStudents()
  .then((students) => {
  if (students.length > 0) {
    res.json(students);
    } else {
          res.status(404).json({ message: "no results" });
        }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: "internal server error" });
  });
});

  // Route to get students by course
  app.get("/students", (req, res) => {
    const course = req.query.course;
    if (!course) {
      res.status(400).json({ message: "course parameter is required" });
      return;
    }

collegeData.getStudentsByCourse(parseInt(course))
        .then((students) => {
          if (students.length > 0) {
            res.json(students);
          } else {
            res.status(404).json({ message: "no results" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "internal server error" });
        });
    });

    // Route to get all TAs
    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then((tas) => {
          if (tas.length > 0) {
            res.json(tas);
          } else {
            res.status(404).json({ message: "no results" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "internal server error" });
        });
    });

    // Route to get all courses
    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then((courses) => {
          if (courses.length > 0) {
            res.json(courses);
          } else {
            res.status(404).json({ message: "no results" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "internal server error" });
        });
    });

    // Route to get a student by student number
    app.get("/student/:num", (req, res) => {
      const num = parseInt(req.params.num);

      collegeData.getStudentByNum(num)
        .then((student) => {
          if (student) {
            res.json(student);
          } else {
            res.status(404).json({ message: "no results" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "internal server error" });
        });
    });

    app.post('/students/add', async (req, res) => {
      try {
       const createdStudent = await collegeData.addStudent(req.body);
        res.redirect('/students');
      } catch (error) {
        res.status(500).json({message:"Error adding student"});
      }
    });

    // Serve static HTML files
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
    });

    app.get("/students/add",(req,res)=>{
      res.sendFile(path.join(__dirname,"views","addStudent.html"));
  });

    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });

    
  })
  .catch((err) => {
    console.error(err);
    console.error("Failed to initialize collegeData module. Server not started.");
  });

