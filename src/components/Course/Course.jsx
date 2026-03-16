import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paginator } from "primereact/paginator";
import "bootstrap/dist/css/bootstrap.min.css";

const TableHeader = ({ index, column, columnRef, initResize }) => {
  const width = column.width || 100;

  return (
    <th
      ref={columnRef}
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
        position: "relative",
      }}
    >
      {column.name}
      {initResize && (
        <span
          className="draggable"
          onMouseDown={(e) => initResize(e, index)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            cursor: "col-resize",
          }}
        />
      )}
    </th>
  );
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [first, setFirst] = useState(0);
  const rows = 5;
  const navigate = useNavigate();
  const activeIndex = useRef(null);
  const [courseName, setCourseName] = useState("");

  const columns = [
    { name: "ID", field: "id", width: 60 },
    { name: "Course Name", field: "course_name", width: 155 },
    { name: "Teacher", field: "teacher", width: 180 },
    { name: "Student Count", field: "student_of_number", width: 150 },
    { name: "Actions", field: "actions", width: 150 },
  ];

  const [columnState, setColumnState] = useState(columns);
  const [columnRefs, setColumnRefs] = useState([]);

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(courseName.toLowerCase())
  );
  const visibleCourses = filteredCourses.slice(first, first + rows);

  const onPageChange = (e) => setFirst(e.first);

  useEffect(() => {
    axios
      .get("http://localhost:3001/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const editCourse = (course) => {
    navigate("/courses/add", { state: course });
  };

  const [deletedCourse, setDeletedCourse] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const deleteCourse = (course) => {
    if (!course || !course.id) return alert("Missing Course ID");

    if (window.confirm(`Are you sure you want to delete "${course.course_name}"?`)) {
      axios.delete(`http://localhost:3001/courses/${course.id}`)
        .then(() => {
          setCourses(prev => prev.filter(c => c.id !== course.id));
          setDeletedCourse(course);

          const timer = setTimeout(() => {
            setDeletedCourse(null);
          }, 5000);

          setUndoTimer(timer);
        })
        .catch(err => console.error(err));
    }
  };

  const undoDeleteCourse = () => {
    if (!deletedCourse) return;

    axios.post("http://localhost:3001/courses", deletedCourse)
      .then(() => {
        setCourses(prev => [...prev, deletedCourse]);
        setDeletedCourse(null);
        clearTimeout(undoTimer);
      })
      .catch(err => console.error(err));
  };

  const actionBody = (course) => (
    <div style={{ display: "flex", gap: "5px" }}>
      <button className="btn btn-sm btn-primary" onClick={() => editCourse(course)}>Edit</button>
      <button className="btn btn-sm btn-danger" onClick={() => deleteCourse(course)}>Delete</button>
    </div>
  );

  const resize = (e) => {
    const columnsCopy = [...columnState];
    const column = columnsCopy[activeIndex.current];
    const columnRef = columnRefs[activeIndex.current];
    const nextWidth =
      e.clientX - columnRef.current.getBoundingClientRect().left;

    if (nextWidth > 50) {
      column.width = nextWidth;
      setColumnState(columnsCopy);
    }
  };

  const stopResize = () => {
    document.body.style.cursor = "default";
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  };

  const initResize = (e, index) => {
    activeIndex.current = index;
    e.stopPropagation();
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  };

  useEffect(() => {
    setColumnRefs(
      Array(columns.length)
        .fill()
        .map((_, i) => columnRefs[i] || createRef())
    );
  }, []);

  return (
    <div
      className="table_list_out"
      style={{
        width: "870px",
        padding: "2.5rem",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        borderRadius: "15px",
        boxShadow: "0 0 15px rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <button
        onClick={() => navigate("/courses/add")}
        style={{
          width: "130px",
          padding: "8px 10px",
          backgroundColor: "#4fc3f7",
          border: "none",
          color: "#1e1e2f",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          marginBottom: "-45px",
          zIndex: "1",
          fontWeight: "bold"
        }}
      >
        Add a Course
      </button>
      <h2 className="title">Course List</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-60px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Course Name..."
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #555",
            backgroundColor: "#2a2a3d",
            color: "#fff",
            width: "200px"
          }}
        />
      </div>
      <div className="wrapper table_list_in">
        <table>
          <thead>
            <tr>
              {columnState.map((col, i) => (
                <TableHeader
                  key={col.name}
                  index={i}
                  column={col}
                  columnRef={columnRefs[i]}
                  initResize={i === columnState.length - 1 ? null : initResize}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.course_name}</td>
                <td>{course.teacher}</td>
                <td>{course.student_of_number}</td>
                <td>{actionBody(course)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredCourses.length}
        onPageChange={onPageChange}
      />
      {deletedCourse && (
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#333", borderRadius: "5px" }}>
          <span>❗ Course "{deletedCourse.course_name}" deleted.</span>
          <button
            onClick={undoDeleteCourse}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#4fc3f7",
              border: "none",
              color: "#1e1e2f",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;
