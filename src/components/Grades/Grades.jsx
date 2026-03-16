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

function Grades() {
  const [grades, setGrades] = useState([]);
  const [first, setFirst] = useState(0);
  const rows = 5;
  const navigate = useNavigate();
  const activeIndex = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { name: "Student ID", field: "id_code", width: 130 },
    { name: "Student Name", field: "student_name", width: 180 },
    { name: "Course", field: "course", width: 180 },
    { name: "Grades", field: "grades", width: 90 },
    { name: "Actions", field: "actions", width: 100 },
  ];

  const [columnState, setColumnState] = useState(columns);
  const [columnRefs, setColumnRefs] = useState([]);

  const filteredGrades = grades.filter((g) =>
    (g.student_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (g.id_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (g.course?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const visibleGrades = filteredGrades.slice(first, first + rows);

  const onPageChange = (e) => setFirst(e.first);

  useEffect(() => {
    axios
      .get("http://localhost:3001/grades")
      .then((res) => setGrades(res.data))
      .catch((err) => console.error(err));
  }, []);

  const editGrade = (grade) => {
    navigate("/grades/add", { state: grade });
  };

  const [deletedGrade, setDeletedGrade] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const deleteGrade = (grade) => {
    if (!grade || !grade.id) return alert("Missing Grade ID");

    if (
      window.confirm(
        `Are you sure you want to delete "${grade.student_name}" for course "${grade.course}"?`
      )
    ) {
      axios
        .delete(`http://localhost:3001/grades/${grade.id}`)
        .then(() => {
          setGrades((prev) => prev.filter((g) => g.id !== grade.id));
          setDeletedGrade(grade);

          const timer = setTimeout(() => {
            setDeletedGrade(null);
          }, 5000);

          setUndoTimer(timer);
        })
        .catch((err) => console.error(err));
    }
  };

  const undoDeleteGrade = () => {
    if (!deletedGrade) return;

    axios
      .post("http://localhost:3001/grades", deletedGrade)
      .then(() => {
        setGrades((prev) => [...prev, deletedGrade]);
        setDeletedGrade(null);
        clearTimeout(undoTimer);
      })
      .catch((err) => console.error(err));
  };

  const actionBody = (grade) => (
    <div style={{ display: "flex", gap: "5px" }}>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => editGrade(grade)}
      >
        Edit
      </button>
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
        onClick={() => navigate("/grades/add")}
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
          fontWeight: "bold",
        }}
      >
        Add Grade
      </button>
      <h2 className="title">Grades List</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-60px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by Student, ID, or Course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #555",
            backgroundColor: "#2a2a3d",
            color: "#fff",
            width: "250px",
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
            {visibleGrades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.id_code}</td>
                <td>{grade.student_name}</td>
                <td>{grade.course}</td>
                <td>{grade.grades}</td>
                <td>{actionBody(grade)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredGrades.length}
        onPageChange={onPageChange}
      />

      {deletedGrade && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#333",
            borderRadius: "5px",
          }}
        >
          <span>
            ❗ Grade for "{deletedGrade.student_name}" deleted.
          </span>
          <button
            onClick={undoDeleteGrade}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#4fc3f7",
              border: "none",
              color: "#1e1e2f",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default Grades;
