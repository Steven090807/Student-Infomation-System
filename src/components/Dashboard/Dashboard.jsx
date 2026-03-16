import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
// import gojo from "../../assets/gojo_satoru.png";
// import demon from "../../assets/demon_slayerpng.png";
import image01 from "../../assets/aw421bg01.jpg";
import image02 from "../../assets/aw421bg02.jpg";
import image03 from "../../assets/aw421bg03.jpg";
import image04 from "../../assets/aw421bg04.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );



function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, courses: 0, grades: "N/A" });
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Students',
        data: [20, 28, 30, 32, 35, counts.students],
        borderColor: '#4fc3f7',
        backgroundColor: '#4fc3f7',
        tension: 0.4,
        fill: false,
        pointRadius: 5
      },
      {
        label: 'Teachers',
        data: [20, 28, 30, 32, 35, counts.teachers],
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        tension: 0.4,
        fill: false,
        pointRadius: 5
      },
      {
        label: 'Courses',
        data: [20, 28, 30, 32, 35, counts.courses],
        borderColor: '#ff9800',
        backgroundColor: '#ff9800',
        tension: 0.4,
        fill: false,
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'School Progress Line Chart' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const images = [image01, image02, image03, image04];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);


  const schoolStartYear = 2013;

  const getSchoolHistoryYears = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - schoolStartYear;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [student, teacher, course, grades] = await Promise.all([
          axios.get("http://localhost:3001/count/students"),
          axios.get("http://localhost:3001/count/teachers"),
          axios.get("http://localhost:3001/count/courses"),
          axios.get("http://localhost:3001/count/grades")
        ]);

        console.log("Grades API Data:", grades.data);
        
        setCounts({
          students: student.data.total || 0,
        teachers: teacher.data.total || 0,
        courses: course.data.total || 0,
        grades: grades.data.grade || "N/A"
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-box text-center mt-5">
      <h3>School Dashboard</h3>
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div>
            <h5>Total Students</h5>
            <p>{getSchoolHistoryYears()} Years</p>
          </div>
          <div className="circle">{counts.students}</div>
        </div>

        <div className="dashboard-card">
          <div>
            <h5>Total Teachers</h5>
            <p>{getSchoolHistoryYears()} Years</p>
          </div>
          <div className="circle circle-green">{counts.teachers}</div>
        </div>

        <div className="dashboard-card">
          <div>
            <h5>Total Courses</h5>
            <p>Diploma & Degree</p>
          </div>
          <div className="circle circle-orange">{counts.courses}</div>
        </div>

        <div className="dashboard-card">
          <div>
            <h5>Average Grades</h5>
            <p>Overall</p>
          </div>
          <div className="circle circle-orange">{counts.grades}</div>
        </div>
      </div>
      <div className="school-assignment">
        <h3>Assignment</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="image-box">
            <Card
              sx={{
                maxWidth: 300,
                height: "350px",
                marginLeft: "0",
                borderRadius: "15px",
                backgroundColor: "transparent",
                color: "white",
                boxShadow: "0 0 10px rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100 custom-img" src={image01} alt="Image" />
                  <Carousel.Caption>
                    <p>Sign in to the Teacher page.</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img className="d-block w-100 custom-img" src={image02} alt="Image" />
                  <Carousel.Caption>
                    <p>Sign in to the Teacher page.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <CardContent>
                <Typography variant="h5">Teacher</Typography>
                <Typography variant="body2">
                  Manage and grade student assignments, upload learning materials, and monitor student performance efficiently.
                </Typography>
              </CardContent>

              <CardActions className="card-actions-right">
                <div className="learn-more-btn">
                  <Button size="small" onClick={() => window.location.href = "http://localhost/SISC/TEACHERS/login.php"}>
                    Learn More
                  </Button>
                </div>
              </CardActions>
            </Card>
          </div>

          <div className="image-box">
            <Card
              sx={{
                maxWidth: 300,
                height: "350px",
                marginLeft: "0",
                borderRadius: "15px",
                backgroundColor: "transparent",
                color: "white",
                boxShadow: "0 0 10px rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100 custom-img" src={image03} alt="Image" />
                  <Carousel.Caption>
                    <p>Sign in to the Student page.</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img className="d-block w-100 custom-img" src={image04} alt="Image" />
                  <Carousel.Caption>
                    <p>Sign in to the Student page.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <CardContent>
                <Typography variant="h5">Student</Typography>
                <Typography variant="body2">
                  View and submit assignments and access learning materials provided by teachers.
                </Typography>
              </CardContent>

              <CardActions className="card-actions-right">
                <div className="learn-more-btn">
                  <Button size="small" onClick={() => window.location.href = "http://localhost/SISC/STUDENTS/login.php"}>
                    Learn More
                  </Button>
                </div>
              </CardActions>
            </Card>
          </div>

          <div style={{ marginTop: "-80px", marginLeft: "60px" }}>
            <h3>School progress:</h3>
            <div style={{ width: "110%", height:"340px", maxWidth: "900px", margin: "0 auto" }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
