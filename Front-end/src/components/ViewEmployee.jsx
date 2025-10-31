
import React from 'react';
import { useParams } from 'react-router-dom';
import './ViewEmployee.css';
import { useEffect, useState } from 'react';

// ✅ Custom hook to fetch employee data
const useEmployeeData = (id) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/employees/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setEmployee(data);
        setLoading(false);
      })
      .catch(() => {
        setEmployee(null);
        setLoading(false);
      });
  }, [id]);

  return { employee, loading };
};

const ViewEmployee = () => {
  const { id } = useParams();
  const { employee, loading } = useEmployeeData(id);

  if (loading) {
    return <div className="view-employee-container"><h2>Loading...</h2></div>;
  }

  if (!employee) {
    return <div className="view-employee-container"><h2>Employees not found</h2></div>;
  }

  return (
    <div className="view-employee-container">
      <h2 className="view-employee-title">Employee Profile - {employee.id}</h2>

      {/* Basic Information */}
      <div className="employee-card basic-info-card">
        <div className="employee-photo-section">
          <div className="employee-photo">
            <div className="default-avatar">
              <svg className="avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
1.79-4 4 1.79 4 4 4zm0 2c-2.67 
0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="employee-details">
          <h3 className="card-title">Basic Information</h3>
          <div className="employee-row"><span className="label">Name:</span><span className="value">{employee.name}</span></div>
          <div className="employee-row"><span className="label">Employee ID:</span><span className="value">{employee.id}</span></div>
          <div className="employee-row"><span className="label">Department:</span><span className="value">{employee.department?.name || 'N/A'}</span></div>
          <div className="employee-row"><span className="label">Position:</span><span className="value">{employee.position || 'N/A'}</span></div>
          <div className="employee-row"><span className="label">Joining Date:</span><span className="value">{employee.joinDate?.split('T')[0] || 'N/A'}</span></div>
        </div>
      </div>

      {/* Additional */}
      <div className="employee-card additional-card">
        <h3 className="card-title">Additional Information</h3>
        <div className="employee-row"><span className="label">Salary:</span><span className="value">{employee.salary || 'Confidential'}</span></div>
        <div className="employee-row"><span className="label">Status:</span><span className="value">{employee.status || 'Active'}</span></div>
        <div className="employee-row"><span className="label">Age:</span><span className="value">{employee.age || 'N/A'}</span></div>
        <div className="employee-row"><span className="label">Experience:</span><span className="value">{employee.experience || 'N/A'} years</span></div>
      </div>
    </div>
  );
};

export default ViewEmployee;
