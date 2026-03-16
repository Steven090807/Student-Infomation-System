import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function StudentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state;

  const [loginNumber, setLoginNumber] = useState(localStorage.getItem("loginNumber"));

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
      localStorage.setItem("pendingRole", "S");
      navigate("/login");
    }
  }, [loginNumber, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ln = localStorage.getItem("loginNumber");
      if (ln !== loginNumber) setLoginNumber(ln);
    }, 500);

    return () => clearInterval(interval);
  }, [loginNumber]);


  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters")
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),


    age: Yup.number()
      .min(16, "Age must be at least 16")
      .max(80, "Age is too high")
      .required("Age is required"),

    class_name: Yup.string()
      .trim("Class cannot be empty")
      .min(1, "Class cannot be empty")
      .required("Class is required"),

    email: Yup.string()
      .matches(/^[a-z0-9._%+-]+@gmail\.com$/, "Email must be lowercase and end with @gmail.com")
      .required("Email is required"),
  });

  const initialValues = {
    name: editData?.name || "",
    age: editData?.age || "",
    class_name: editData?.class_name || "",
    email: editData?.email || "",
  };


  const onSubmit = async (values) => {
    try {
      const submitData = { ...values, age: Number(values.age) };

      if (editData) {
        await axios.put(
          `http://localhost:3001/students/${editData.id}`,
          submitData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Student updated successfully!");
      } else {
        await axios.post("http://localhost:3001/students", submitData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Student added successfully!");
      }

      navigate("/students");
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div
      className="card_01"
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "2.5rem",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        borderRadius: "15px",
        boxShadow: "0 0 15px rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", color: "#4fc3f7" }}>
        {editData ? "Edit Student" : "Add Student"}
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
            name="name"
            placeholder="Name"
            className="form-control custom-input"
          />
          <ErrorMessage name="name" component="div" className="error-massege" />

          <Field
            name="age"
            type="number"
            placeholder="Age"
            className="form-control custom-input"
          />
          <ErrorMessage name="age" component="div" className="error-massege" />

          <Field
            name="class_name"
            placeholder="Class"
            className="form-control custom-input"
          />
          <ErrorMessage name="class_name" component="div"className="error-massege"
          />

          <Field
            name="email"
            type="email"
            placeholder="Email"
            className="form-control custom-input"
          />
          <ErrorMessage
            name="email" component="div" className="error-massege"
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

export default StudentForm;
