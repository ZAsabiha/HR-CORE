import React from "react";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">HR-CORE</div>
      <ul className="sidebar-menu">
        <li>
          <i className="bi bi-speedometer2"></i><span>Dashboard</span>
        </li>
        <li>
          <i className="bi bi-people"></i><span>Manage Employees</span>
        </li>
        <li>
          <i className="bi bi-columns-gap"></i><span>Category</span>
        </li>
        <li>
          <i className="bi bi-person-circle"></i><span>Profile</span>
        </li>
        <li>
          <i className="bi bi-wallet2"></i><span>Payroll</span>
        </li>
        <li>
          <i className="bi bi-bar-chart-line"></i><span>Performance</span>
        </li>
        <li>
          <i className="bi bi-person-plus"></i><span>Recruitment</span>
        </li>
        <li>
          <i className="bi bi-gear"></i><span>Settings</span>
        </li>
        <li onClick={onLogout} className="logout-btn" style={{cursor: 'pointer'}}>
          <i className="bi bi-box-arrow-right"></i><span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;