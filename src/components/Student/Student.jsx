import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paginator } from "primereact/paginator";
import 'bootstrap/dist/css/bootstrap.min.css';

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

function Students() {
  const [students, setStudents] = useState([]);
  const [first, setFirst] = useState(0);
  const rows = 5;
  const navigate = useNavigate();
  const activeIndex = useRef(null);
  const [columnRefs, setColumnRefs] = useState([]);
  const [searchCode, setSearchCode] = useState("");

  const columns = [
    { name: "ID", field: "id", width: 70 },
    { name: "Name", field: "name", width: 130 },
    { name: "Email", field: "email", width: 220 },
    { name: "Age", field: "age", width: 60 },
    { name: "Class", field: "class_name", width: 80 },
    { name: "Actions", field: "actions", width: 150 },
  ];

  const [columnState, setColumnState] = useState(columns);

  useEffect(() => {
    axios.get("http://localhost:3001/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setColumnRefs(Array(columns.length).fill().map((_, i) => columnRefs[i] || createRef()));
  }, []);

  const filteredStudents = students.filter(student =>
    student.student_code.toLowerCase().includes(searchCode.toLowerCase())
  );
  const visibleStudents = filteredStudents.slice(first, first + rows);

  const onPageChange = (e) => setFirst(e.first);

  const editStudent = (student) => {
    console.log(student);
    navigate("/students/add", { state: student }); 
  };

  const [deletedStudent, setDeletedStudent] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const deleteStudent = (student) => {
    if (!student || !student.id) return alert("Missing Student ID");

    if (window.confirm(`Are you sure you want to delete "${student.name}"?`)) {

      axios.delete(`http://localhost:3001/students/${student.id}`)
        .then(() => {
          setStudents(prev => prev.filter(s => s.id !== student.id));
          setDeletedStudent(student);
          
          const timer = setTimeout(() => {
            setDeletedStudent(null);
          }, 5000);

          setUndoTimer(timer);
        })
        .catch(err => console.error(err));
    }
  };

  const undoDelete = () => {
    if (!deletedStudent) return;

    axios.post("http://localhost:3001/students", deletedStudent)
      .then(() => {
        setStudents(prev => [...prev, deletedStudent]);
        setDeletedStudent(null);
        clearTimeout(undoTimer);
      })
      .catch(err => console.error(err));
  };

  const actionBody = (student) => (
    <div style={{ display: "flex", gap: "5px" }}>
      <button className="btn btn-sm btn-primary" onClick={() => editStudent(student)}>Edit</button>
      <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(student)}>Delete</button>
    </div>
  );

  const resize = (e) => {
    const columnsCopy = [...columnState];
    const column = columnsCopy[activeIndex.current];
    const columnRef = columnRefs[activeIndex.current];
    const nextWidth = e.clientX - columnRef.current.getBoundingClientRect().left;
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

  return (
    <div className='table_list_out' style={{
      width: '870px', padding: '2.5rem', backgroundColor: '#1e1e2f', color: '#fff',
      borderRadius: '15px', boxShadow: '0 0 15px rgba(255,255,255,0.2)',
      display: 'flex', flexDirection: 'column', textAlign: 'left',
    }}>
      <button
        onClick={() => navigate("/students/add")}
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
        Add a Student
      </button>
      <h2 className="title">Student List</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-60px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Student ID..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
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
            {visibleStudents.map(student => (
              <tr key={student.student_code}>
                <td>{student.student_code}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>{student.class_name}</td>
                <td>{actionBody(student)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredStudents.length}
        onPageChange={onPageChange}
      />
      {deletedStudent && (
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#333", borderRadius: "5px" }}>
          <span>❗ Student "{deletedStudent.name}" deleted.</span>
          <button
            onClick={undoDelete}
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

export default Students;
