import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function TeacherForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "" });
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
      localStorage.setItem("pendingRole", "T");
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
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters")
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),

    email: Yup.string()
      .matches(/^[a-z0-9._%+-]+@gmail\.com$/, "Email must be lowercase and end with @gmail.com")
      .required("Email is required"),

    subject: Yup.string()
      .trim("Subject cannot be empty")
      .min(1, "Subject cannot be empty")
      .required("Subject is required"),
  });

  const initialValues = {
    name: editData?.name || "",
    email: editData?.email || "",
    subject: editData?.subject || "",
  };
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (values) => {
    try {
      const submitData = { ...values, age: Number(values.age) };

      if (editData) {
        await axios.put(
          `http://localhost:3001/teachers/${editData.id}`,
          submitData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Teacher updated successfully!");
      } else {
        await axios.post("http://localhost:3001/teachers", submitData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Teacher added successfully!");
      }

      navigate("/teachers");
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
        {editData ? "Edit Teacher" : "Add Teacher"}
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
            name="email"
            type="email"
            placeholder="Email"
            className="form-control custom-input"
          />
          <ErrorMessage
            name="email" component="div" className="error-massege"
          />

          <Field
            name="subject"
            placeholder="Subject"
            className="form-control custom-input"
          />
          <ErrorMessage name="subject" component="div"className="error-massege"
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

export default TeacherForm;
