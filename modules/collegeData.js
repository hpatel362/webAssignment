const courses = require("../data/courses.json");
const students = require("../data/students.json");

class Data {
    constructor(students, courses) {
      this.students = students;
      this.courses = courses;
    }
  }
  
let dataCollection = null;

function initialize() {
    dataCollection = new Data(students, courses);
    return Promise.resolve();
  }

  
function getAllStudents() {
    return new Promise((resolve, reject) => {
      if (dataCollection.students.length === 0) {
        reject("No results returned");
      } else {
        resolve(dataCollection.students);
      }
    });
  }

function getTAs() {
    return new Promise((resolve, reject) => {
      const tas = dataCollection.students.filter((student) => student.TA === true);
      if (tas.length === 0) {
        reject("No results returned");
      } else {
        resolve(tas);
      }
    });
  }

  
function getCourses() {
    return new Promise((resolve, reject) => {
      if (dataCollection.courses.length === 0) {
        reject("No results returned");
      } else {
        resolve(dataCollection.courses);
      }
    });
  }
  
function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    const filteredStudents = students.filter((student) => student.course === course);   
    if (filteredStudents.length > 0) {
      resolve(filteredStudents);
    } else {
      reject("No results returned");
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    const student = students.find((s) => s.studentNum === num);
    if (student) {
      resolve(student);
    } else {
      reject("No results returned");
    }
  });
}

function addStudent(studentData){
  return new Promise((resolve,reject) => {
      if(studentData){
      if (studentData.TA === undefined) {
          studentData.TA = false;
        } else {
          studentData.TA = true;
        }
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);
        resolve(studentData);
      }else{
          reject("please provide valid input");
      }
  })
}
  module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent
  };
  