"use strict";

const express = require("express");
const Joi = require("joi");
const fs = require("fs");
const app = express();
app.use(express.json());

// json file PATH_COURSES

const PATH_COURSES = __dirname + "/" + "courses.json";
app.get("/", (req, res) => {
  res.send("welcome to courses API");
});

// a variable to save parsed courses for GET requests
let parsedCourses;

// GET all courses
app.get("/api/courses", (req, res) => {
  fs.readFile(PATH_COURSES, "utf-8", (err, data) => {
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
  fs.readFile(PATH_COURSES, "utf-8", (err, data) => {
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
    fs.writeFile(PATH_COURSES, stringifyCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log("the new course has been added successfully! ");
    });
  });
});

//PUT a course by id

app.put("/api/courses/:id", (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  fs.readFile(PATH_COURSES, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const parsedData = JSON.parse(data);
    const courses = parsedData.courses;

    const course = courses.find(
      (element) => element.id === parseInt(req.params.id)
    );

    if (!course) {
      res
        .status(404)
        .send(`the course with the id ${req.params.id}  dose not existed`);
      return;
    }

    course.name = req.body.name;
    res.send(course);
    const stringifyCourses = JSON.stringify(parsedData, null, 2);

    // write the updated course to course.json
    fs.writeFile(PATH_COURSES, stringifyCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(
        `the course with id : ${req.params.id} has been updated successfully `
      );
    });
  });
});

//DELETE a course by id
app.delete("/api/courses/:id", (req, res) => {
  fs.readFile(PATH_COURSES, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const parsedData = JSON.parse(data);
    const courses = parsedData.courses;

    const course = courses.find(
      (element) => element.id === parseInt(req.params.id)
    );

    if (!course) {
      res
        .status(404)
        .send(`the course with the id ${req.params.id} dose not existed`);
      return;
    }

    const courseIndex = courses.indexOf(course);
    courses.splice(courseIndex, 1);
    res.send(course);

    const stringifyCourses = JSON.stringify(parsedData, null, 2);

    // write the new changes to course.json
    fs.writeFile(PATH_COURSES, stringifyCourses, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(" the course has been deleted successfully");
    });
  });
});

// validation function

function courseValidation(course) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });

  return schema.validate(course);
}
// set port environments
const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}  ...`));
