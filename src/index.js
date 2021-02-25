"use strict";

const express = require("express");
const Joi = require("joi");
const fs = require("fs");
const app = express();
app.use(express.json());

// json file path
const path = `${__dirname}/../courses.json`;

app.get("/", (req, res) => {
  res.send(`
  <div style="text-align:center;margin-top:20px;font-weight:700 ">
    <h1>Welcome to courses RESTful API</h1><br>
    <h3>use: /api/courses to access all the courses</h3><br>
    <h3>use: /api/courses/id to access a specific course with id</h3><br>
    <h3>use: Postman to GET, POST,  PUT and DELETE course(s)</h3><br> 
  </div> 
  `);
});

// a variable to save parsed courses for GET requests
let parsedCourses;

// GET all courses
app.get("/api/courses", (req, res) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    }
    parsedCourses = JSON.parse(data);
    res.status(200).send(parsedCourses);
  });
});
// GET one course by id
app.get("/api/courses/:id", (req, res) => {
  const course = parsedCourses.courses.find(
    (element) => element.id === parseInt(req.params.id)
  );
  if (!course) {
    res
      .status(404)
      .send(`the course with the id: ${req.params.id} dose not existed`);
    return;
  }
  res.send(course);
});

//POST a new course
app.post("/api/courses", (req, res) => {
  // validate the request
  const { error } = courseValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  // read course.json
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const parsedData = JSON.parse(data);
    const courses = parsedData.courses;

    const newCourse = {
      id: courses.length + 1,
      name: req.body.name,
    };
    const updatedCourses = parsedData.courses.push(newCourse);
    res.send(newCourse);

    const stringifyCourses = JSON.stringify(parsedData, null, 2);

    // write the new changes to course.json
    fs.writeFile(path, stringifyCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log("the new course has been added successfully! ");
    });
  });
});
