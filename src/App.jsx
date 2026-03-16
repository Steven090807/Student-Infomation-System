import { useState } from 'react';
import axios from 'axios';
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import MenuBar from './components/MenuBar';
import StudentForm from './components/Student/StudentForm';
import Student from './components/Student/Student';
import TeacherForm from './components/Teacher/TeacherForm';
import Teacher from './components/Teacher/Teacher';
import CourseForm from './components/Course/CourseForm';
import Course from './components/Course/Course';
import Grades from './components/Grades/Grades';
import GradesForm from './components/Grades/GradesForm';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

 return (
  <>
    <Router>
      <MenuBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students/add" element={<StudentForm />} />
        <Route path="/students" element={<Student />} />
        <Route path="/teachers/add" element={<TeacherForm />} />
        <Route path="/teachers" element={<Teacher />} />
        <Route path="/courses/add" element={<CourseForm />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/grades/add" element={<GradesForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </>
);
}

export default App;
