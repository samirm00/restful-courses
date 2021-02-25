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
