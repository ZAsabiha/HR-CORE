import React from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          window.location.href = '/';
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
       <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{ backgroundColor: '#0C3D4A' }}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <span className="fs-5 fw-bolder d-none d-sm-inline mb-4">
                  HR-CORE
            </span>

            <ul   className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"id="menu" style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li className="w-100">
                <i className="fs-4 bi-speedometer2 ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Dashboard</span>
              </li>
              <li className="w-100">
                <i className="fs-4 bi-people ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Manage Employees</span>
              </li>
              <li className="w-100">
                <i className="fs-4 bi-columns ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Category</span>
              </li>
              <li className="w-100">
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Profile</span>
              </li>

                   <li className="w-100">
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Payroll</span>
              </li>

                   <li className="w-100">
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Performance</span>
              </li>

                   <li className="w-100">
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Recruitment</span>
              </li>

                     <li className="w-100">
                <i className="fs-4 bi-person ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Setting</span>
              </li>

              <li className="w-100" onClick={handleLogout} style={{ cursor: 'pointer',listStyleType: 'none' }}>
                <i className="fs-4 bi-power ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Logout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0 m-0">
          <div className="p-3 shadow-sm bg-white">
            <h4 className="text-center">Human Resource Management System</h4>
          </div>

          {/* Example Content */}
          <div className="p-4 d-flex flex-wrap gap-4 justify-content-center">
            <div className="card text-center shadow-sm" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Total Employees</h5>
                <p className="card-text">150</p>
              </div>
            </div>

            <div className="card text-center shadow-sm" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Active Projects</h5>
                <p className="card-text">12</p>
              </div>
            </div>

            <div className="card text-center shadow-sm" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Departments</h5>
                <p className="card-text">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
