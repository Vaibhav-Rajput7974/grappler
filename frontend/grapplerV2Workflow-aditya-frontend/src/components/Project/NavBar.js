import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { getAllProject, getProjectById } from "../../slice/ProjectSlice";
import { getProjectId, getProjects } from "../../Api/AllApi";

const NavBar = () => {
  const { projects } = useSelector((state) => state.Project);
  const dispatch = useDispatch();

  const [active, setActive] = useState(false);

  function handleClick(projectId) {
    setActive(true);
    getProjectId(projectId)
      .then((response) => {
        dispatch(getProjectById(response.data.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  useEffect(() => {
    getProjects()
      .then((response) => {
        dispatch(getAllProject(response.data.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    marginBottom: "10px",
  };

  return (
    <div
      style={{position: "fixed",width: "250px",height: "100vh",backgroundColor: "#f8f9fa",borderRight: "1px solid #dee2e6"}}
    >
      <nav id="sidebar" style={{ padding: "10px" , marginTop: "70px" }}>
        <ul className="nav flex-column">
          <li className={`nav-item.${active ? "active" : ""}`}>
            <Link className="nav-link" to="/dashboard" style={linkStyle} onClick={() => setActive(true)}>
              Dashboard
            </Link>
          </li>
          <li className={`nav-item ${active ? "active" : ""}`}>
            <a
              className="nav-link"
              href="#projectsCollapse"
              data-bs-toggle="collapse"
              style={linkStyle}
            >
              Projects
            </a>
            <div
              className={`collapse.${active ? "show" : ""}`}
              id="projectsCollapse"
            >
              {projects ? (
                <ul className="list-unstyled ps-3">
                  {projects.map((project) => (
                    <li key={project.projectId}>
                      <NavLink
                        className="nav-link project-link"
                        to={`/projects/${project.projectId}`}
                        onClick={() => handleClick(project.projectId)}
                      >
                        {project.projectName}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={linkStyle}>Data Not found</p>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
