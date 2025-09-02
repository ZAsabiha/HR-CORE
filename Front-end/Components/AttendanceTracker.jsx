import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, RotateCcw, Wifi, WifiOff } from 'lucide-react';

const AttendanceTracker = ({ employeeId, onAttendanceUpdate }) => {
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [apiTimeAvailable, setApiTimeAvailable] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0); // Offset between API time and system time

  // Fetch real-time from WorldTimeAPI
  const fetchApiTime = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
      if (response.ok) {
        const data = await response.json();
        const apiTime = new Date(data.datetime);
        const systemTime = new Date();
        setTimeOffset(apiTime.getTime() - systemTime.getTime());
        setApiTimeAvailable(true);
        return apiTime;
      }
    } catch (error) {
      console.warn('API time unavailable, using system time:', error);
      setApiTimeAvailable(false);
      return new Date();
    }
  };

  // Get current accurate time
  const getCurrentTime = () => {
    const systemTime = new Date();
    return new Date(systemTime.getTime() + timeOffset);
  };

  // Update current time every second
  useEffect(() => {
    // Initial API time fetch
    fetchApiTime().then(apiTime => {
      setCurrentTime(apiTime);
    });

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    // Refresh API time every 5 minutes to maintain accuracy
    const apiRefreshTimer = setInterval(() => {
      fetchApiTime();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(apiRefreshTimer);
    };
  }, [timeOffset]);

  // Calculate session time if checked in
  useEffect(() => {
    if (currentAttendance?.checkInTime && !currentAttendance?.checkOutTime) {
      const checkInTime = new Date(currentAttendance.checkInTime);
      const now = getCurrentTime();
      
      // If on break, calculate up to break start
      let endTime = now;
      if (currentAttendance.status === 'ON_BREAK' && currentAttendance.breakStart) {
        endTime = new Date(currentAttendance.breakStart);
      }
      
      const diff = endTime - checkInTime;
      
      // Subtract any completed break time
      let breakTime = 0;
      if (currentAttendance.breakMinutes) {
        breakTime = currentAttendance.breakMinutes * 60 * 1000;
      }
      
      const workingDiff = diff - breakTime;
      
      const hours = Math.floor(workingDiff / (1000 * 60 * 60));
      const minutes = Math.floor((workingDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((workingDiff % (1000 * 60)) / 1000);
      
      setSessionTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setSessionTime('00:00:00');
    }
  }, [currentTime, currentAttendance]);

  // Fetch current attendance status
  const fetchCurrentAttendance = async () => {
    if (!employeeId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/current/${employeeId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCurrentAttendance(data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Load current attendance on component mount
  useEffect(() => {
    fetchCurrentAttendance();
  }, [employeeId]);

  // Handle API calls with real-time timestamp
  const makeAttendanceCall = async (endpoint, data = {}) => {
    setLoading(true);
    try {
      // Use API time for accurate timestamps
      const accurateTime = getCurrentTime();
      
      const response = await fetch(`http://localhost:5000/api/attendance/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          employeeId: parseInt(employeeId), 
          timestamp: accurateTime.toISOString(),
          ...data 
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setCurrentAttendance(result.attendance);
        onAttendanceUpdate && onAttendanceUpdate();
        return { success: true, data: result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('API call error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const result = await makeAttendanceCall('checkin');
    if (result.success) {
      alert(`Check-in successful!${result.data.isLate ? ' (Late arrival noted)' : ''}`);
    } else {
      alert(result.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    const result = await makeAttendanceCall('checkout');
    if (result.success) {
      const totalHours = result.data.totalHours?.toFixed(2) || 0;
      const overtime = result.data.overtime?.toFixed(2) || 0;
      let message = `Check-out successful! Total hours: ${totalHours}`;
      if (overtime > 0) message += ` (Overtime: ${overtime} hours)`;
      alert(message);
    } else {
      alert(result.error || 'Check-out failed');
    }
  };

  const handleBreakStart = async () => {
    const result = await makeAttendanceCall('break/start');
    if (result.success) {
      alert('Break started!');
    } else {
      alert(result.error || 'Failed to start break');
    }
  };

  const handleBreakEnd = async () => {
    const result = await makeAttendanceCall('break/end');
    if (result.success) {
      alert(`Break ended! Duration: ${result.data.breakDuration} minutes`);
    } else {
      alert(result.error || 'Failed to end break');
    }
  };

  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString() : '--:--:--';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PRESENT: { class: 'status-present', label: 'Present' },
      ABSENT: { class: 'status-absent', label: 'Absent' },
      LATE: { class: 'status-late', label: 'Late' },
      HALF_DAY: { class: 'status-early', label: 'Half Day' },
      ON_BREAK: { class: 'status-late', label: 'On Break' },
      EARLY_DEPARTURE: { class: 'status-early', label: 'Early Out' },
      OVERTIME: { class: 'status-overtime', label: 'Overtime' }
    };
    
    const config = statusConfig[status] || statusConfig.PRESENT;
    return { class: config.class, label: config.label };
  };

  if (!employeeId) {
    return (
      <div className="attendance-tracker-card">
        <div className="tracker-header">
          <Clock className="header-icon" />
          <h3>Attendance Tracker</h3>
        </div>
        <div className="no-employee-selected">
          <p>Please select an employee to track attendance</p>
        </div>
      </div>
    );
  }

  const statusBadge = currentAttendance?.status ? getStatusBadge(currentAttendance.status) : null;

  return (
    <div className="attendance-tracker-card">
      <div className="tracker-header">
        <Clock className="header-icon" />
        <h3>Real-time Attendance Tracker</h3>
        <div className="current-time">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="time-label">Current Time</span>
            {apiTimeAvailable ? (
              <Wifi size={16} color="#10b981" title="API Time - Accurate" />
            ) : (
              <WifiOff size={16} color="#ef4444" title="System Time - Fallback" />
            )}
          </div>
          <span className="time-display">{currentTime.toLocaleTimeString()}</span>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            {apiTimeAvailable ? 'API Synced' : 'System Fallback'}
          </div>
        </div>
      </div>

      <div className="attendance-status-section">
        {currentAttendance ? (
          <div className="status-card-tracker">
            <div className="status-header">
              <span className="status-label">Today's Status:</span>
              {statusBadge && (
                <span className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            
            <div className="time-info-grid">
              <div className="time-row">
                <span>Check-in:</span>
                <span className="time-value">{formatTime(currentAttendance.checkInTime)}</span>
              </div>
              <div className="time-row">
                <span>Check-out:</span>
                <span className="time-value">{formatTime(currentAttendance.checkOutTime)}</span>
              </div>
              <div className="time-row session-row">
                <span>Session Time:</span>
                <span className="session-time">{sessionTime}</span>
              </div>
              {currentAttendance.totalHours && (
                <div className="time-row">
                  <span>Total Hours:</span>
                  <span className="time-value">{currentAttendance.totalHours.toFixed(2)} hrs</span>
                </div>
              )}
              {currentAttendance.breakMinutes > 0 && (
                <div className="time-row">
                  <span>Break Time:</span>
                  <span className="time-value">{currentAttendance.breakMinutes} mins</span>
                </div>
              )}
              {currentAttendance.overtime > 0 && (
                <div className="time-row overtime-row">
                  <span>Overtime:</span>
                  <span className="overtime-value">{currentAttendance.overtime.toFixed(2)} hrs</span>
                </div>
              )}
            </div>

            {currentAttendance.breakStart && !currentAttendance.breakEnd && (
              <div className="break-info-alert">
                <span>Break started at: {formatTime(currentAttendance.breakStart)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="no-attendance-card">
            <p>No attendance record for today</p>
          </div>
        )}
      </div>

      <div className="action-buttons-section">
        {!currentAttendance?.checkInTime ? (
          <button 
            className="tracker-btn btn-check-in"
            onClick={handleCheckIn}
            disabled={loading}
          >
            <Play className="btn-icon" />
            {loading ? 'Processing...' : 'Check In'}
          </button>
        ) : !currentAttendance?.checkOutTime ? (
          <div className="button-group">
            {currentAttendance.status !== 'ON_BREAK' ? (
              <>
                <button 
                  className="tracker-btn btn-break"
                  onClick={handleBreakStart}
                  disabled={loading}
                >
                  <Pause className="btn-icon" />
                  {loading ? 'Processing...' : 'Start Break'}
                </button>
                <button 
                  className="tracker-btn btn-check-out"
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  <Square className="btn-icon" />
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="tracker-btn btn-end-break"
                  onClick={handleBreakEnd}
                  disabled={loading}
                >
                  <Play className="btn-icon" />
                  {loading ? 'Processing...' : 'End Break'}
                </button>
                <button 
                  className="tracker-btn btn-check-out"
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  <Square className="btn-icon" />
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="completed-message">
            <span className="check-icon">✅</span>
            <span>Attendance completed for today</span>
          </div>
        )}
      </div>

      <div className="refresh-section">
        <button 
          className="tracker-btn btn-refresh"
          onClick={fetchCurrentAttendance}
          disabled={loading}
        >
          <RotateCcw className="btn-icon" />
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default AttendanceTracker;
