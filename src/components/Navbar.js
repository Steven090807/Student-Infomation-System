import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">School Info System</Link>
        <div>
          <Link className="btn btn-light mx-1" to="/">Dashboard</Link>
          <Link className="btn btn-light mx-1" to="/students">Students</Link>
          <Link className="btn btn-light mx-1" to="/teachers">Teachers</Link>
          <Link className="btn btn-light mx-1" to="/courses">Courses</Link>
          <Link className="btn btn-light mx-1" to="/grades">Grades</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
