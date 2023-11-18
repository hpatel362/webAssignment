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
function getCourseById(id) {
  return new Promise((resolve, reject) => {
      if (!dataCollection?.courses?.length) {
          reject(noResultReturnMessage);
      } else {
          const matchedCourse = dataCollection.courses.find(course => course.courseId === parseInt(id));
          if (!matchedCourse) {
              reject("query returned 0 results");
          } else {
              resolve(matchedCourse);
          }
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

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
      let index = dataCollection.students.findIndex(student => student.studentNum === parseInt(studentData.studentNum));

      if (index === -1) {
          reject("Student not found");
      } else {
          if (studentData.TA === 'on') {
              studentData.TA = true;
          } else {
              studentData.TA = false;
          }
          dataCollection.students[index].studentNum = parseInt(studentData.studentNum);
          dataCollection.students[index].firstName = studentData.firstName;
          dataCollection.students[index].lastName = studentData.lastName;
          dataCollection.students[index].email = studentData.email;
          dataCollection.students[index].addressStreet = studentData.addressStreet;
          dataCollection.students[index].addressCity = studentData.addressCity;
          dataCollection.students[index].addressProvince = studentData.addressProvince;
          dataCollection.students[index].TA = studentData.TA;
          dataCollection.students[index].status = studentData.status;
          dataCollection.students[index].course = parseInt(studentData.course);

          resolve();
      }
  });
}

  module.exports = {
    initialize,
    getAllStudents,
    //getTAs,
    getCourseById,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent
  };
  