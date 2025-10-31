import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';
import { FaPlus } from 'react-icons/fa';

const EmployeeList = ({ searchResults, isSearching }) => {
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Get auth status (role)
    (async () => {
      try {
        const r = await fetch('http://localhost:5000/auth/status', { credentials: 'include' });
        const j = await r.json();

        if (!j.loggedIn) {
          navigate('/login');
          return;
        }
        setRole(j.user?.role || null);
        setAuthChecked(true);
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (authChecked && !isSearching) {
      fetchEmployees();
    }
  }, [authChecked, isSearching]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees', { credentials: 'include' });
      if (res.status === 401) return navigate('/login');
      if (res.status === 403) return alert('Forbidden');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleView = (id) => navigate(`/employee/${id}`);

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch employee');
      const data = await res.json();
      setEditingEmployee(data);
      setShowEditModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to load employee for editing.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const j = await response.json().catch(() => ({}));
        throw new Error(j?.error || 'Delete failed');
      }
      
      
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      
    
      
    } catch (err) {
      console.error('Failed to delete employee:', err);
      alert(err.message || 'Failed to delete employee.');
    }
  };

  const handleAddEmployee = () => setShowAddModal(true);
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingEmployee(null);
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          salary: parseFloat(payload.salary),
          age: parseInt(payload.age),
          experience: parseInt(payload.experience)
        })
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Failed to add employee');
        return;
      }

      await fetchEmployees();
      setShowAddModal(false);
    } catch (err) {
      console.error('Add error:', err);
      alert('An unexpected error occurred while adding employee.');
    }
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          salary: parseFloat(payload.salary),
          age: parseInt(payload.age),
          experience: parseInt(payload.experience)
        })
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || 'Failed to update employee');
        return;
      }

      await fetchEmployees();
      setShowEditModal(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update employee.');
    }
  };

  // Guard while we check auth state
  if (!authChecked) return null;

  const isAdmin = role === 'ADMIN';

  // Determine which employees to show: search results or all employees
  const displayEmployees = isSearching ? searchResults : employees;

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        {isAdmin && (
          <button className="add-btn" onClick={handleAddEmployee}>
            <FaPlus style={{ marginRight: '8px' }} /> Add
          </button>
        )}
      </div>

      <div className="employee-list-title">
        <h2>
          Employee List
          {isSearching && (
            <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
              ({displayEmployees.length} search result{displayEmployees.length !== 1 ? 's' : ''})
            </span>
          )}
        </h2>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Joining Date</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayEmployees.length > 0 ? (
            displayEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.department?.name || 'N/A'}</td>
                <td>{emp.joinDate?.split('T')[0] || 'N/A'}</td>
                <td className="action-column">
                  <button onClick={() => handleView(emp.id)} className="view-btn">View</button>

                  {isAdmin && (
                    <>
                      <button onClick={() => handleEdit(emp.id)} className="edit-btn">Edit</button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="delete-btn"
                        style={{ backgroundColor: '#276f82', color: '#fff', border: 'none' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                {isSearching ? 'No employees found matching your search.' : 'No employees found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Modal (Admin only) */}
      {isAdmin && showAddModal && (
        <ModalForm
          title="Add New Employee"
          onSubmit={handleAddEmployeeSubmit}
          onClose={handleCloseModal}
        />
      )}

      {/* Edit Modal (Admin only) */}
      {isAdmin && showEditModal && editingEmployee && (
        <ModalForm
          title="Edit Employee"
          onSubmit={handleEditEmployeeSubmit}
          onClose={handleCloseModal}
          initialData={editingEmployee}
        />
      )}
    </div>
  );
};

const ModalForm = ({ title, onSubmit, onClose, initialData }) => {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white', padding: '2.5rem', borderRadius: '10px',
        width: '650px', maxWidth: '98%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2>{title}</h2>
          <button onClick={onClose} style={{
            fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer'
          }}>&times;</button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Name and Email */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              name="name"
              required
              placeholder="Name *"
              defaultValue={initialData?.name}
              title="Enter the full name of the employee"
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Email *"
              defaultValue={initialData?.email}
              title="Enter a valid email address"
              style={{ flex: 1, padding: '0.5rem' }}
            />
          </div>

          {/* Department and Position */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <select
              name="department"
              required
              defaultValue={initialData?.department?.name}
              title="Select the employee's department"
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <option value="">Select Department *</option>
              <option value="HR">HR</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
            </select>
            <input
              name="position"
              required
              placeholder="Position *"
              defaultValue={initialData?.position}
              title="Enter the job title or position"
              style={{ flex: 1, padding: '0.5rem' }}
            />
          </div>

          {/* Salary and Status */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              name="salary"
              required
              placeholder="Salary *"
              type="number"
              defaultValue={initialData?.salary}
              title="Enter the employee's salary"
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <select
              name="status"
              required
              defaultValue={initialData?.status}
              title="Select whether the employee is active or inactive"
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Join Date, Date of Birth, and Experience with Labels */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 0.3, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#666' }}>
                Join Date *
              </label>
              <input
                name="joinDate"
                required
                type="date"
                defaultValue={initialData?.joinDate?.split('T')[0]}
                title="Select the employee's joining date"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div style={{ flex: 0.3, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#666' }}>
                Date of Birth *
              </label>
              <input
                name="dateOfBirth"
                required
                type="date"
                defaultValue={
                  initialData?.dateOfBirth
                    ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
                    : ''
                }
                title="Select the employee's date of birth"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div style={{ flex: 0.3, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#666' }}>
                Experience (years) *
              </label>
              <input
                name="experience"
                required
                placeholder="Years"
                type="number"
                defaultValue={initialData?.experience}
                title="Enter total years of experience"
                style={{ padding: '0.5rem' }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              title="Cancel and close the form"
              style={{ padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              title="Save the employee information"
              style={{
                padding: '0.5rem 1.2rem',
                backgroundColor: '#008075',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeList;