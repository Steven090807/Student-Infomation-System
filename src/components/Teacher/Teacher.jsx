import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paginator } from 'primereact/paginator';
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
        position: "relative"
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
            cursor: "col-resize"
          }}
        />
      )}
    </th>
  );
};

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [first, setFirst] = useState(0);
  const rows = 5;
  const navigate = useNavigate();
  const activeIndex = useRef(null);
  const [columnRefs, setColumnRefs] = useState([]);
  const [name, setName] = useState("");

  const columns = [
    { name: "ID", field: "id", width: 60 },
    { name: "Name", field: "name", width: 140 },
    { name: "Email", field: "email", width: 240 },
    { name: "Subject", field: "subject", width: 150 },
    { name: "Actions", field: "actions", width: 150 },
  ];

  const [columnState, setColumnState] = useState(columns);

  useEffect(() => {
    axios.get("http://localhost:3001/teachers")
      .then(res => setTeachers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setColumnRefs(Array(columns.length).fill().map((_, i) => columnRefs[i] || createRef()));
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(name.toLowerCase())
  );
  const visibleTeachers = filteredTeachers.slice(first, first + rows);

  const onPageChange = (e) => setFirst(e.first);

  const editTeacher = (teacher) => {
    navigate("/teachers/add", { state: teacher });
  };

  const [deletedTeacher, setDeletedTeacher] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const deleteTeacher = (teacher) => {
    if (!teacher || !teacher.id) return alert("Missing Teacher ID");

    if (window.confirm(`Are you sure you want to delete "${teacher.name}"?`)) {
      axios.delete(`http://localhost:3001/teachers/${teacher.id}`)
        .then(() => {
          setTeachers(prev => prev.filter(t => t.id !== teacher.id));
          setDeletedTeacher(teacher);

          const timer = setTimeout(() => {
            setDeletedTeacher(null);
          }, 5000);

          setUndoTimer(timer);
        })
        .catch(err => console.error(err));
    }
  };

  const undoDeleteTeacher = () => {
    if (!deletedTeacher) return;

    axios.post("http://localhost:3001/teachers", deletedTeacher)
      .then(() => {
        setTeachers(prev => [...prev, deletedTeacher]);
        setDeletedTeacher(null);
        clearTimeout(undoTimer);
      })
      .catch(err => console.error(err));
  };

  const actionBody = (teacher) => (
    <div style={{ display: "flex", gap: "5px" }}>
      <button className="btn btn-sm btn-primary" onClick={() => editTeacher(teacher)}>Edit</button>
      <button className="btn btn-sm btn-danger" onClick={() => deleteTeacher(teacher)}>Delete</button>
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
    <div className='table_list_out'
      style={{
        width: '870px',
        padding: '2.5rem',
        backgroundColor: '#1e1e2f',
        color: '#fff',
        borderRadius: '15px',
        boxShadow: '0 0 15px rgba(255,255,255,0.2)',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
      }}
    >
      <button
        onClick={() => navigate("/teachers/add")}
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
        Add a Teacher
      </button>
      <h2 className="title">Teacher List</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-60px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Teacher Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            {visibleTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject}</td>
                <td>{actionBody(teacher)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredTeachers.length}
        onPageChange={onPageChange}
      />
      {deletedTeacher && (
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#333", borderRadius: "5px" }}>
          <span>❗ Teacher "{deletedTeacher.name}" deleted.</span>
          <button
            onClick={undoDeleteTeacher}
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

export default Teachers;
