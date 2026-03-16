const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "aw421"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    }else {
        console.log("MySQL Connected to aw421");
    }
});

app.post("/login", loginHandler);
function loginHandler(req, res) {
  const { id_code, password } = req.body;

  const sql = "SELECT * FROM login_info WHERE id_code = ? AND password = ?";
  db.query(sql, [id_code, password], (err, result) => {
    if (err) return res.status(500).send({ success: false, message: "Server error" });
    if (result.length > 0) {
      res.send({ success: true, message: "Login Successful" });
    } else {
      res.send({ success: false, message: "Invalid ID or Password" });
    }
  });
}



//for studenform input to insert to database
app.post('/students', (req, res) => {
  const { name, age, class_name, email } = req.body;
  const getLastCode = "SELECT student_code FROM student_info ORDER BY id DESC LIMIT 1";

  db.query(getLastCode, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    let newCode = "ST001";

    if (result.length > 0 && result[0].student_code) {
      const lastCodeNum = parseInt(result[0].student_code.substring(2)) + 1;
      newCode = "ST" + String(lastCodeNum).padStart(3, "0");
    }
    const sql = "INSERT INTO student_info (name, age, class_name, email, student_code) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, age, class_name, email, newCode], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Student added successfully!", student_code: newCode });
    });
  });
});
// to show out to the table student list
app.get('/students', (req, res) => {
  const sql = "SELECT * FROM student_info";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(results);
    res.json(results);
  });
});
//for update student info
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age, class_name } = req.body;

  const sql = "UPDATE student_info SET name=?, email=?, age=?, class_name=? WHERE id=?";
  db.query(sql, [name, email, age, class_name, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Student updated successfully!" });
  });
});
//for delete student info
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM student_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Student deleted successfully!" });
  });
});
//for search student id in student list
app.get('/students', (req, res) => {
  const { student_code } = req.query;
  let sql = "SELECT * FROM student_info";
  if (student_code) {
    sql += " WHERE student_code LIKE ?";
  }
  db.query(sql, student_code ? [`%${student_code}%`] : [], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// get total students in dashboard
app.get("/count/students", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM student_info", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});


//for teacherform input to insert to database
app.post('/teachers', (req, res) => {
  const { name, email, subject } = req.body;
  const sql = "INSERT INTO teacher_info (name, email, subject) VALUES (?, ?, ?)";
  db.query(sql, [name, email, subject], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Teacher added successfully!" });
  });
});
// to show out to the table taecher list
app.get('/teachers', (req, res) => {
  const sql = "SELECT * FROM teacher_info";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(results);
    res.json(results);
  });
});
//for update teacher info
app.put("/teachers/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, subject } = req.body;

  const sql = "UPDATE teacher_info SET name=?, email=?, subject=? WHERE id=?";
  db.query(sql, [name, email, subject, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Student updated successfully!" });
  });
});
//for delete teacher info
app.delete("/teachers/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM teacher_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Teacher deleted successfully!" });
  });
});
//for search teacher name in teacher list
app.get('/teachers', (req, res) => {
  const { name } = req.query;
  let sql = "SELECT * FROM teacher_info";
  if (name) {
    sql += " WHERE name LIKE ?";
  }
  db.query(sql, name ? [`%${name}%`] : [], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// get total teacher in dashboard
app.get("/count/teachers", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM teacher_info", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});


//for courseform input to insert to database
app.post('/courses', (req, res) => {
  const { course_name, teacher, student_of_number } = req.body;
  const sql = "INSERT INTO course_info (course_name, teacher, student_of_number) VALUES (?, ?, ?)";
  db.query(sql, [course_name, teacher, student_of_number], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Courses added successfully!" });
  });
});
// to show out to the table course list
app.get('/courses', (req, res) => {
  const sql = "SELECT * FROM course_info";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(results);
    res.json(results);
  });
});
//for update course info
app.put("/courses/:id", (req, res) => {
  const { id } = req.params;
  const { course_name, teacher, student_of_number } = req.body;

  const sql = "UPDATE course_info SET course_name=?, teacher=?, student_of_number=? WHERE id=?";
  db.query(sql, [course_name, teacher, student_of_number, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Student updated successfully!" });
  });
});
//for delete course info
app.delete("/courses/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM course_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Course deleted successfully!" });
  });
});
//for search course name in course list
app.get('/courses', (req, res) => {
  const { course_name } = req.query;
  let sql = "SELECT * FROM course_info";
  if (course_name) {
    sql += " WHERE course_name LIKE ?";
  }
  db.query(sql, course_name ? [`%${course_name}%`] : [], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// get total course in dashboard
app.get("/count/courses", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM course_info", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});


//for gradesform input to insert to database
app.post('/grades', (req, res) => {
  const { id_code, student_name, course, grades } = req.body;
  const sql = "INSERT INTO grades_info (id_code, student_name, course, grades) VALUES (?, ?, ?, ?)";
  db.query(sql, [id_code, student_name, course, grades], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Grade added successfully!" });
  });
});
// to show out to the table grades list
app.get('/grades', (req, res) => {
  const sql = "SELECT * FROM grades_info";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(results);
    res.json(results);
  });
});
//for search grades name in grades list
app.get('/grades', (req, res) => {
  const { search } = req.query;
  let sql = "SELECT * FROM grades_info";
  const params = [];

  if (search) {
    sql += " WHERE id_code LIKE ? OR course LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});
//for update grades info
app.put("/grades/:id", (req, res) => {
  const { id } = req.params;
  const { id_code, student_name, course, grades } = req.body;

  const sql = "UPDATE grades_info SET id_code=?, student_name=?, course=?, grades=? WHERE id=?";
  db.query(sql, [id_code, student_name, course, grades, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Grade updated successfully!" });
  });
});
//find inside the student_info data got same or not
app.post("/grades", (req, res) => {
  const { id_code, student_name, course, grades } = req.body;

  const checkSQL = "SELECT * FROM student_info WHERE student_code = ? AND name = ?";
  db.query(checkSQL, [id_code, student_name], (err, result) => {
    if (err) return res.status(500).send({ message: "Server error" });

    if (result.length === 0) {
      return res.send({ success: false, message: "Please enter correct student info" });
    }
    const insertSQL =
      "INSERT INTO grades_info (id_code, student_name, course, grades) VALUES (?, ?, ?, ?)";
    db.query(insertSQL, [id_code, student_name, course, grades], (err) => {
      if (err) return res.status(500).send({ message: "Insert error" });

      return res.send({ success: true, message: "Grades added successfully!" });
    });
  });
});
// get the highest total grades in the dashboard.
app.get("/count/grades", (req, res) => {
  const sql = "SELECT grades, COUNT(*) AS total FROM grades_info GROUP BY grades ORDER BY total DESC";
  
  db.query(sql, (err, results) => {
    console.log("Full Debug List:", results); // This will list every grade and its count
    if (results.length > 0) {
      res.json({ grade: results[0].grades, count: results[0].total });
    }
  });
});




app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});
