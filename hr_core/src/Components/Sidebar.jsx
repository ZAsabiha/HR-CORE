import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const [expandedSections, setExpandedSections] = useState({
    employeeManagement: false,
    attendanceLeave: true, // Leave Requests should be expanded by default
    payrollCompensations: false,
    performance: false,
    recruitment: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">HR CORE</div>
      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </li>

        {/* Features */}
        <li className="menu-item">
          <i className="bi bi-grid-3x3-gap"></i>
          <span>Features</span>
        </li>

        {/* Employee Management */}
        <li className="menu-section">
          <div 
            className="menu-section-header" 
            onClick={() => toggleSection('employeeManagement')}
          >
            <i className="bi bi-people"></i>
            <span>Employee Management</span>
            <i className={`bi bi-chevron-${expandedSections.employeeManagement ? 'down' : 'right'} chevron`}></i>
          </div>
          {expandedSections.employeeManagement && (
            <ul className="submenu">
              <li className="submenu-item">
                <span>Employees</span>
              </li>
              <li className="submenu-item">
                <span>Profile</span>
              </li>
            </ul>
          )}
        </li>

        {/* Attendance and Leave */}
        <li className="menu-section">
          <div 
            className="menu-section-header" 
            onClick={() => toggleSection('attendanceLeave')}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Attendance and Leave</span>
            <i className={`bi bi-chevron-${expandedSections.attendanceLeave ? 'down' : 'right'} chevron`}></i>
          </div>
          {expandedSections.attendanceLeave && (
            <ul className="submenu">
              <li className="submenu-item">
                <span>Attendance Logs</span>
              </li>
              <li className="submenu-item active">
                <span>Leave Requests</span>
              </li>
            </ul>
          )}
        </li>

        {/* Payroll and Compensations */}
        <li className="menu-section">
          <div 
            className="menu-section-header" 
            onClick={() => toggleSection('payrollCompensations')}
          >
            <i className="bi bi-wallet2"></i>
            <span>Payroll and Compensations</span>
            <i className={`bi bi-chevron-${expandedSections.payrollCompensations ? 'down' : 'right'} chevron`}></i>
          </div>
          {expandedSections.payrollCompensations && (
            <ul className="submenu">
              <li className="submenu-item">
                <span>Salary Management</span>
              </li>
              <li className="submenu-item">
                <span>Overtime Tracking</span>
              </li>
            </ul>
          )}
        </li>

        {/* Performance */}
        <li className="menu-section">
          <div 
            className="menu-section-header" 
            onClick={() => toggleSection('performance')}
          >
            <i className="bi bi-bar-chart-line"></i>
            <span>Performance</span>
            <i className={`bi bi-chevron-${expandedSections.performance ? 'down' : 'right'} chevron`}></i>
          </div>
          {expandedSections.performance && (
            <ul className="submenu">
              <li className="submenu-item">
                <span>Goals</span>
              </li>
              <li className="submenu-item">
                <span>Performance Reviews</span>
              </li>
            </ul>
          )}
        </li>

        {/* Recruitment */}
        <li className="menu-section">
          <div 
            className="menu-section-header" 
            onClick={() => toggleSection('recruitment')}
          >
            <i className="bi bi-person-plus"></i>
            <span>Recruitment</span>
            <i className={`bi bi-chevron-${expandedSections.recruitment ? 'down' : 'right'} chevron`}></i>
          </div>
          {expandedSections.recruitment && (
            <ul className="submenu">
              <li className="submenu-item">
                <span>Onboarding</span>
              </li>
              <li className="submenu-item">
                <span>Offboarding</span>
              </li>
            </ul>
          )}
        </li>

        {/* System Setting */}
        <li className="menu-item">
          <i className="bi bi-gear"></i>
          <span>System Setting</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;