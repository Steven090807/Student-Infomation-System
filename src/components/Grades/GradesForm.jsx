import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function GradesForm() {
  const [formData, setFormData] = useState({
    id_code: "",
    student_name: "",
    course: "",
    grades: ""
  });
  const [loginNumber, setLoginNumber] = useState(localStorage.getItem("loginNumber"));
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state;

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("loginNumber", "0");
      localStorage.removeItem("pendingRole");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (loginNumber !== "1") {
      localStorage.setItem("pendingRole", "G");
      navigate("/login");
    }
  }, [loginNumber, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ln = localStorage.getItem("loginNumber");
      if (ln !== loginNumber) {
        setLoginNumber(ln);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [loginNumber]);

  const validationSchema = Yup.object({
    id_code: Yup.string()
      .matches(/^[A-Z0-9]+$/, "ID can only contain uppercase letters and numbers")
      .required("Student ID is required"),

    student_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name must contain letters only")
      .required("Student name is required"),

    course: Yup.string()
      .trim("Course cannot be empty")
      .min(1, "Course cannot be empty") 
      .required("Course is required"),

    grades: Yup.string()
      .matches(/^[A-F.+-]+$/, "Grades must be A-F and optional + or -")
      .max(2, "Grades only can be one letters and one symbol ")
      .required("Grades are required"),
  });

  const initialValues = {
    id_code: editData?.id_code || "",
    student_name: editData?.student_name || "",
    course: editData?.course || "",
    grades: editData?.grades || ""
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
          `http://localhost:3001/grades/${editData.id}`,
          submitData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Grade updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3001/grades",
          submitData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Grade added successfully!");
      }

      navigate("/grades");
    } catch (error) {
      console.error("Submission error:", error.response || error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div
      className="card_01"
      style={{
        maxWidth: "400px",
        marginTop: "80px",
        padding: "2.5rem",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        borderRadius: "15px",
        boxShadow: "0 0 15px rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", color: "#4fc3f7" }}>
        {editData ? "Edit Grade" : "Add Grade"}
      </h2>

      <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form
        className="card_02"
        style={{ width: "110%", display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Field
          name="id_code"
          placeholder="Student ID"
          className="form-control custom-input"
        />
        <ErrorMessage
          name="id_code" component="div" className="error-massege"
        />

        <Field
          name="student_name"
          placeholder="Student Name"
          className="form-control custom-input"
        />
        <ErrorMessage
          name="student_name" component="div" className="error-massege"
        />

        <Field
          name="course"
          placeholder="Course"
          className="form-control custom-input"
        />
        <ErrorMessage
          name="course" component="div" className="error-massege"
        />

        <Field
          name="grades"
          placeholder="Grades"
          className="form-control custom-input"
        />

        <ErrorMessage
          name="grades" component="div" className="error-massege"
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

        <button
          type="button"
          onClick={() => navigate("/grades")}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#fa2c2cff",
            color: "#1e1e2f",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          View All
        </button>
      </Form>
    </Formik>
  </div>
);
}

export default GradesForm;
