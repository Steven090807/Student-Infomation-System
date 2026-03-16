import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function CourseForm() {
  
  const [formData, setFormData] = useState({
    course_name: "",
    teacher: "",
    student_of_number: ""
  });



  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state; 
  const loginNumber = localStorage.getItem("loginNumber");

  useEffect(() => {
    if (loginNumber !== "1") {
      localStorage.setItem("pendingRole", "C");
      navigate("/login");
    }
  }, [loginNumber, navigate]);


  const validationSchema = Yup.object({
    course_name: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "Course name must contain letters and number only")
      .min(5, "Course name must be at least 5 characters")
      .required("Course name is required"),

    teacher: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Teacher name must contain letters only")
      .required("Teacher name is required"),

    student_of_number: Yup.number()
      .min(1, "Student count must be at least 1")
      .required("Student count is required"),
  });

  
    const initialValues = {
      course_name: editData?.course_name || "",
      teacher: editData?.teacher || "",
      student_of_number: editData?.student_of_number || ""
    };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (values) => {
    try {
      const submitData = { ...values, age: Number(values.age) };

      if (editData) {
        await axios.put(
          `http://localhost:3001/courses/${editData.id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Course updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3001/courses",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Course added successfully!");
      }

      navigate("/courses");
    } catch (error) {
      console.error("Submission error:", error.response || error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div className='card_01'
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '2.5rem',
        backgroundColor: '#1e1e2f',
        color: '#fff',
        borderRadius: '15px',
        boxShadow: '0 0 15px rgba(255,255,255,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', color: '#4fc3f7' }}>
        {editData ? "Edit Course" : "Add Course"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        <Form
          className="card_02"
          style={{
            width: "110%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Field
            name="course_name"
            placeholder="Course Name"
            className="form-control custom-input"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#fff",
            }}
          />
          <ErrorMessage
            name="course_name" component="div" className="error-massege"
          />

          <Field
            name="teacher"
            placeholder="Teacher"
            className="form-control custom-input"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#fff",
            }}
          />
          <ErrorMessage
            name="teacher" component="div" className="error-massege"
          />

          <Field
            name="student_of_number"
            placeholder="Student Count"
            className="form-control custom-input"
            type="number"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#fff",
            }}
          />
          <ErrorMessage
            name="student_of_number" component="div" className="error-massege"
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundImage: "linear-gradient(90deg, #4fc3f7, #925ceeff)",
              color: "#1e1e2f",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CourseForm;
