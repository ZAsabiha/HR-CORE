// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
// import Sidebar from './components/sidebar';
// import EmployeeListPage from './components/EmployeeListPage';
// import Profile from './components/ViewEmployee';
// import EmployeeGoals from './components/EmployeeGoals';
// import PerformanceReview from './components/PerformanceReview';
// import LeaveRequests from './components/LeaveRequests';
// import LeaveApplicationForm from './components/LeaveApplicationForm';
// import EmployeeLeaveHistory from './components/EmployeeLeaveHistory';
// import CandidatesPage from './components/CandidatesPage';
// import JobPostingsPage from './components/JobPostingsPage';
// import CandidateJobPortal from './components/CandidateJobPortal';
// import Salary from './components/Salary';
// import AdminProfile from './components/AdminProfile';
// import ViewEmployee from './components/ViewEmployee';
// import LoginForm from './components/LoginForm';
// import LandingPage from './components/LandingPage';
// import AttendanceLogs from './components/AttendanceLogs';
// import AboutPage from './components/AboutPage';
// import ContactPage from './components/ContactPage';
// import Reporting from './components/Reporting';

// import './components/RecruitmentDashboard.css';
// import OvertimePay from './components/OvertimePay';
// import NotificationsBell from './components/NotificationsBell';

// const LayoutWithSidebar = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch user information on component mount
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/auth/status', {
//           credentials: 'include'
//         });
//         const data = await res.json();
        
//         if (data.loggedIn && data.user) {
//           setUser(data.user);
//         }
//       } catch (err) {
//         console.error('Failed to fetch user info:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:5000/auth/logout', {
//         method: 'POST',
//         credentials: 'include'
//       });
//       setUser(null);
//     } catch (err) {
//       console.error('Logout failed:', err);
//     }
//     navigate('/');
//   };

//   // Component to conditionally render Leave Requests based on user role
//   const LeaveRequestsRoute = () => {
//     if (!user) return <div>Loading...</div>;
    
//     // If user is an employee, show the leave history page
//     if (user.role === 'EMPLOYEE') {
//       return <EmployeeLeaveHistory />;
//     }
    
//     // If user is admin/HR/team lead, show the requests management page
//     return <LeaveRequests />;
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="app-layout">
//       <Sidebar onLogout={handleLogout} user={user} />

//       <div className="main-dashboard">
//         <div className="top-navigation">
//           <div className="nav-links">
//             <button className="nav-link logout-btn" onClick={() => navigate('/')}>
//               Home
//             </button>
//             <Link to="/about" className="nav-link">About</Link>
//             <Link to="/contact" className="nav-link">Contacts</Link>
//             <NotificationsBell />
//             <button className="nav-link logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>

//         <Routes>
//           <Route path="/EmployeeList" element={<EmployeeListPage />} />
//           <Route path="/employee/:id" element={<ViewEmployee />} />
//           <Route path="/AdminProfile" element={<AdminProfile />} />
//           <Route path="/EmployeeGoals" element={<EmployeeGoals />} />
//           <Route path="/Candidates" element={<CandidatesPage />} />
//           <Route path="/JobPostings" element={<JobPostingsPage />} />
//           {/* Role-based routing for leave requests */}
//           <Route path="/leave-requests" element={<LeaveRequestsRoute />} />
//           {/* Separate route for leave application form */}
//           <Route path="/leave-application" element={<LeaveApplicationForm />} />
//           <Route path="/dashboard" element={<Reporting />} />
//           <Route path="/attendance" element={<AttendanceLogs />} />
//           <Route path="/PerformanceReview" element={<PerformanceReview />} />
//           <Route path="/Salary" element={<Salary />} />
//           <Route path="/overtime" element={<OvertimePay />} />
         
//           <Route path="*" element={<h2>Page Not Found</h2>} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/auth/status', {
//           credentials: 'include',
//         });
//         const data = await res.json();

//         if (!data.loggedIn) {
//           // Only redirect if user is not on a public page
//           const publicPaths = ['/', '/login', '/about', '/contact', '/job-openings'];
//           if (!publicPaths.includes(location.pathname)) {
//             navigate('/login');
//           }
//         }
//         // If logged in, do nothing - stay on the page user clicked
//       } catch (err) {
//         console.error('Auth check failed:', err);
//         const publicPaths = ['/', '/login', '/about', '/contact', '/job-openings'];
//         if (!publicPaths.includes(location.pathname)) {
//           navigate('/login');
//         }
//       } finally {
//         setCheckingAuth(false);
//       }
//     };

//     checkAuth();
//   }, [location.pathname, navigate]);

//   if (checkingAuth) return <div>Loading...</div>;

//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<LoginForm />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/contact" element={<ContactPage />} />
//       <Route path="/job-openings" element={<CandidateJobPortal />} />
//       <Route path="/home" element={<LandingPage />} />
//       <Route path="*" element={<LayoutWithSidebar />} />
//     </Routes>
//   );
// }

// export default function AppWrapper() {
//   return (
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
// }



import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import EmployeeListPage from './components/EmployeeListPage';
import Profile from './components/ViewEmployee';
import EmployeeGoals from './components/EmployeeGoals';
import PerformanceReview from './components/PerformanceReview';
import LeaveRequests from './components/LeaveRequests';
import LeaveApplicationForm from './components/LeaveApplicationForm';
import EmployeeLeaveHistory from './components/EmployeeLeaveHistory';
import CandidatesPage from './components/CandidatesPage';
import JobPostingsPage from './components/JobPostingsPage';
import CandidateJobPortal from './components/CandidateJobPortal';
import Salary from './components/Salary';
import AdminProfile from './components/AdminProfile';
import ViewEmployee from './components/ViewEmployee';
import LoginForm from './components/LoginForm';
import LandingPage from './components/LandingPage';
import AttendanceLogs from './components/AttendanceLogs';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Reporting from './components/Reporting';

import './components/RecruitmentDashboard.css';
import OvertimePay from './components/OvertimePay';
import NotificationsBell from './components/NotificationsBell';

/** ---------- Role Guard (ADMIN-only routes etc.) ---------- */
const RoleGuard = ({ user, allowed = [], redirectTo = "/EmployeeList", children }) => {
  // still loading user?
  if (user === undefined) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const ok = allowed.includes(user.role);
  return ok ? children : <Navigate to={redirectTo} replace />;
};

const LayoutWithSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(undefined); // undefined while loading, null if not logged in
  const [loading, setLoading] = useState(true);

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/status', {
          credentials: 'include'
        });
        const data = await res.json();

        if (data.loggedIn && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
    navigate('/');
  };

  // Component to conditionally render Leave Requests based on user role
  const LeaveRequestsRoute = () => {
    if (!user) return <div>Loading...</div>;

    if (user.role === 'EMPLOYEE') {
      return <EmployeeLeaveHistory />;
    }
    return <LeaveRequests />;
  };

  // Hard redirect if a non-admin manually tries /dashboard
  useEffect(() => {
    if (!loading && user && location.pathname === '/dashboard' && user.role !== 'ADMIN') {
      navigate('/EmployeeList', { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} user={user} />

      <div className="main-dashboard">
        <div className="top-navigation">
          <div className="nav-links">
        
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contacts</Link>
            <NotificationsBell />
            <button className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/EmployeeList" element={<EmployeeListPage />} />
          <Route path="/employee/:id" element={<ViewEmployee />} />
          <Route path="/AdminProfile" element={<AdminProfile />} />
          <Route path="/EmployeeGoals" element={<EmployeeGoals />} />
          <Route path="/Candidates" element={<CandidatesPage />} />
          <Route path="/JobPostings" element={<JobPostingsPage />} />
          {/* Role-based routing for leave requests */}
          <Route path="/leave-requests" element={<LeaveRequestsRoute />} />
          {/* Separate route for leave application form */}
          <Route path="/leave-application" element={<LeaveApplicationForm />} />
          
          {/* ✅ ADMIN-only Dashboard (others go to /EmployeeList) */}
          <Route
            path="/dashboard"
            element={
              <RoleGuard user={user} allowed={['ADMIN']} redirectTo="/EmployeeList">
                <Reporting />
              </RoleGuard>
            }
          />

          <Route path="/attendance" element={<AttendanceLogs />} />
          <Route path="/PerformanceReview" element={<PerformanceReview />} />
          <Route path="/Salary" element={<Salary />} />
          <Route path="/overtime" element={<OvertimePay />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/status', {
          credentials: 'include',
        });
        const data = await res.json();

        if (!data.loggedIn) {
          const publicPaths = ['/', '/login', '/about', '/contact', '/job-openings'];
          if (!publicPaths.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        const publicPaths = ['/', '/login', '/about', '/contact', '/job-openings'];
        if (!publicPaths.includes(location.pathname)) {
          navigate('/login');
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/job-openings" element={<CandidateJobPortal />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="*" element={<LayoutWithSidebar />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
