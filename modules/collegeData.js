const Sequelize = require('sequelize');

process.env.PGHOST = 'ep-summer-unit-34434391.us-east-2.aws.neon.tech';
process.env.PGDATABASE = 'SenecaDB';
process.env.PGUSER = 'hpatel362';
process.env.PGPASSWORD = '28xHpTqbuSZv'; 
process.env.ENDPOINT_ID = 'ep-summer-unit-34434391';

var sequelize = new Sequelize('SenecaDB', 'hpatel362', '28xHpTqbuSZv', {
    host: 'ep-summer-unit-34434391.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER, 
    primaryKey: true, autoIncrement: true 
  },
  firstName: {
      type: Sequelize.STRING 
  },
  lastName: {
      type: Sequelize.STRING
  },
  email: {
      type: Sequelize.STRING
  },
  addressStreet: {
      type: Sequelize.STRING
  },
  addressCity: {
      type: Sequelize.STRING
  },
  addressProvince: {
      type: Sequelize.STRING
  },
  TA: {
      type: Sequelize.BOOLEAN 
  },
  status: {
      type: Sequelize.STRING
  }
}, {
  tableName: 'students', 
  createdAt: false, 
  updatedAt: false 
});

const Course = sequelize.define('Course', {
  courseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  courseCode: {
      type: Sequelize.STRING
  },
  courseDescription: {
      type: Sequelize.STRING
  }
}, {
  tableName: 'courses',
  timestamps: false 
});

Course.hasMany(Student, {
  foreignKey: 'course', 
  onDelete: 'SET NULL'  
});

const noResultReturnMessage = "No results returned";


function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(); 
        }).catch(err => {
            console.error("Failed to sync with database:", err);
            reject("Unable to sync with database");
        });
    });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
      Student.findAll().then(data => {
          if (data) {
              resolve(data); 
          } else {
              reject("No results returned"); 
          }
      }).catch(err => {
          console.error("Failed to sync and  get students:", err);
          reject("Failed to sync with database");
      });
  });
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
      Student.findAll({
          where: { course: parseInt(course) } 
      }).then(data => {
          if (data && data.length > 0) {
              resolve(data); 
          } else {
              reject("No results returned"); 
          }
      }).catch(err => {
          console.error("Failed to sync and get students for the course:", err);
          reject("Failed to sync with database");
      });
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
      Student.findAll({
          where: { studentNum: parseInt(num) } 
      }).then(data => {
          if (data && data.length > 0) {
              resolve(data[0]); 
          } else {
              reject("No results returned"); 
          }
      }).catch(err => {
          console.error("Failed to sync and get student for the student Number:", err);
          reject("Failed to sync with database");
      });
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
      Course.findAll().then(data => {
          if (data && data.length > 0) {
              resolve(data); 
          } else {
              reject("No results returned"); 
          }
      }).catch(err => {
          console.error("Failed to sync and get courses:", err);
          reject("Failed to sync with database");
      });
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
      Course.findAll({
          where: { courseId: parseInt(id)} 
      }).then(data => {
          if (data && data.length > 0) {
              resolve(data[0]); 
          } else {
              reject("No results returned"); 
          }
      }).catch(err => {
          console.error("Failed to sync and get course for a given id:", err);
          reject("Failed to sync with database");
      });
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {

      if(studentData){
      if (studentData.TA === undefined) {
          studentData.TA = false;
        } else {
          studentData.TA = true;
        }
        
      studentData.course= parseInt(studentData.course);
      for (let property in studentData) {
          if (studentData.hasOwnProperty(property) && studentData[property] === "") {
              studentData[property] = null;
          }
      }

      Student.create(studentData).then(() => {
          resolve(); 
      }).catch(err => {
          console.error("Failed to sync and create new student:", err);
          reject("Unable to create student");
      });
  }else{
      reject("please provide valid input");
  }
  });
}

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
      studentData.TA = studentData.TA === 'on' ? true : false;

      studentData.course= parseInt(studentData.course);

      for (let property in studentData) {
          if (studentData.hasOwnProperty(property) && studentData[property] === "") {
              studentData[property] = null;
          }
      }

      const studentNum = studentData.studentNum;
      delete studentData.studentNum;

      Student.update(studentData, { where: { studentNum: parseInt(studentNum) } }).then(() => {
          resolve(); 
      }).catch(err => {
          console.error("Failed to sync and update student:", err);
          reject("Unable to update student");
      });
  });
}

function addCourse(courseData) {
  return new Promise((resolve, reject) => {
    for (let property in courseData) {
        if (courseData.hasOwnProperty(property) && courseData[property] === "") {
              courseData[property] = null;
          }
      }

      Course.create(courseData).then(() => {
          resolve(); 
      }).catch(err => {
          console.error("Failed to sync and create new course:", err);
          reject("Unable to create course");
      });
  });
}

function updateCourse(courseData) {
  return new Promise((resolve, reject) => {
      for (let property in courseData) {
          if (courseData.hasOwnProperty(property) && courseData[property] === "") {
              courseData[property] = null;
          }
      }

      const courseId = courseData.courseId;
      delete courseData.courseId;

      Course.update(courseData, { where: { courseId: courseId } }).then(() => {
          resolve(); 
      }).catch(err => {
          console.error("Failed to sync and update course:", err);
          reject("Unable to update course");
      });
  });
}

function deleteCourseById(id) {
  return new Promise((resolve, reject) => {
      Course.destroy({
          where: { courseId: parseInt(id) } 
      }).then(deleted => {
          if (deleted) {
              resolve(); 
          } else {
              reject("Course not found or already deleted"); 
          }
      }).catch(err => {
          console.error("Failed to sync and delete course:", err);
          reject("Unable to delete course");
      });
  });
}

function deleteStudentByNum(studentNum) {
  return new Promise((resolve, reject) => {
      Student.destroy({
          where: { studentNum: parseInt(studentNum) } 
      }).then(deleted => {
          if (deleted) {
              resolve(); 
          } else {
              reject("Student not found or already deleted"); 
          }
      }).catch(err => {
          console.error("Failed to sync and delete student:", err);
          reject("Unable to delete student"); 
      });
  });
}



/*function getTAs() {
    return new Promise((resolve, reject) => {
      const tas = dataCollection.students.filter((student) => student.TA === true);
      if (tas.length === 0) {
        reject("No results returned");
      } else {
        resolve(tas);
      }
    });
  }*/

  


  module.exports = {
    Student,
    Course,
    initialize,
    getAllStudents,
    //getTAs,
    getCourseById,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent,
    addCourse,
    updateCourse,
    deleteCourseById,
    deleteStudentByNum
  };
  