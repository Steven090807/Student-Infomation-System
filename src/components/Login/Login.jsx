import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function LgoinForm() {
  const [formData, setFormData] = useState({ id_code: '', password: ''});
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state;

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("loginNumber", "0");
      localStorage.removeItem("pendingRole");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        id_code: editData.id_code || "",
        password: editData.password || ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const submitData = { ...formData };
        const response = await axios.post(
        "http://localhost:3001/login",
        submitData,
        { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
        alert("Login Successful!");
        localStorage.setItem("loginNumber", "1");

        const pendingRole = localStorage.getItem("pendingRole");

        if (pendingRole === "T") {
          navigate("/teachers/add");
        } else if (pendingRole === "S") {
          navigate("/students/add");
        } else if (pendingRole === "C") {
          navigate("/courses/add");
        }else if (pendingRole === "G") {
          navigate("/grades/add");
        } else {
          navigate("/dashboard");
        }

        localStorage.removeItem("pendingRole");
        } else {
        alert("Invalid ID or Password.");
        }
      } catch (error) {
          console.error("Login error:", error.response || error);
          alert("Server error, please try again.");
      }
    };

    const handleLogout = () => {
      localStorage.setItem("loginNumber", "0");
      localStorage.removeItem("pendingRole");
      navigate("/login");
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
        Login your acc
      </h2>

      <form onSubmit={handleSubmit} className='card_02'
        style={{ width: '110%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          name="id_code"
          placeholder="ID"
          value={formData.id_code}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2a2a3d', color: '#fff' }}
        />
        <input
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2a2a3d', color: '#fff' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundImage: 'linear-gradient(90deg, #4fc3f7, #925ceeff)',
            color: '#1e1e2f',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default LgoinForm;
