import React from "react";
sabiha
import "./Sidebar.css";
import { Link } from "react-router-dom";
import "./Sidebar.css";
//import {  Outlet, useNavigate } from "react-router-dom";
main

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">HR-CORE</div>
      <ul className="sidebar-menu">
sabiha
        <li><i className="bi bi-speedometer2"></i><span>Dashboard</span></li>
        <li><i className="bi bi-people"></i><span>Manage Employees</span></li>
        <li><i className="bi bi-columns-gap"></i><span>Category</span></li>
        <li><i className="bi bi-person-circle"></i><span>Profile</span></li>
        <li><i className="bi bi-wallet2"></i><span>Payroll</span></li>
        <li><i className="bi bi-bar-chart-line"></i><span>Performance</span></li>
        <li><i className="bi bi-person-plus"></i><span>Recruitment</span></li>
        <li><i className="bi bi-gear"></i><span>Settings</span></li>

        <li>
          <Link to="/dashboard">
            <i className="bi bi-speedometer2"></i><span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/employee">
            <i className="bi bi-people"></i><span>Manage Employees</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/category">
            <i className="bi bi-columns-gap"></i><span>Category</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/profile">
            <i className="bi bi-person-circle"></i><span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/payroll">
            <i className="bi bi-wallet2"></i><span>Payroll</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/performance">
            <i className="bi bi-bar-chart-line"></i><span>Performance</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/recruitment">
            <i className="bi bi-person-plus"></i><span>Recruitment</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/settings">
            <i className="bi bi-gear"></i><span>Settings</span>
          </Link>
        </li>
main
        <li onClick={onLogout} className="logout-btn">
          <i className="bi bi-box-arrow-right"></i><span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
