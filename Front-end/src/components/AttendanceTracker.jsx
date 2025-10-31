import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const AttendanceTracker = ({ employeeId, onAttendanceUpdate }) => {
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [apiTimeAvailable, setApiTimeAvailable] = useState(false); 
  const [timeOffset, setTimeOffset] = useState(0);
  const [autoCheckoutWarning, setAutoCheckoutWarning] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0); 

  // BUSINESS RULES
  const BUSINESS_CONFIG = {
    STANDARD_WORK_HOURS: 8,
    MAX_OVERTIME_HOURS: 4,
    MAX_TOTAL_HOURS: 12, // 8 + 4 = 12 hours maximum per day
    WORK_START_TIME: '09:00', // 9 AM
    AUTO_CHECKOUT_TIME: '21:00', // 9 PM (9 AM + 12 hours)
    LATE_THRESHOLD_MINUTES: 15 // Late if more than 15 min after work start
  };

  
  const styles = {
    attendanceTrackerCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden',
    },
    cardBefore: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
    },
    trackerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f3f4f6',
    },
    trackerHeaderH3: {
      margin: 0,
      color: '#0C3D4A',
      fontSize: '20px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerIcon: {
      width: '24px',
      height: '24px',
      color: '#0C3D4A',
    },
    currentTime: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    },
    timeLabel: {
      fontSize: '12px',
      color: '#666',
      textTransform: 'uppercase',
      fontWeight: '500',
    },
    timeDisplay: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#10b981',
      fontFamily: '"Courier New", monospace',
    },
    noEmployeeSelected: {
      textAlign: 'center',
      padding: '40px 20px',
      background: '#f9fafb',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
    },
    noEmployeeSelectedP: {
      margin: 0,
      color: '#6b7280',
      fontSize: '16px',
    },
    statusSection: {
      marginBottom: '24px',
    },
    statusCardTracker: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
    },
    statusHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    statusLabel: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '16px',
    },
    timeInfoGrid: {
      display: 'grid',
      gap: '12px',
    },
    timeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #e5e7eb',
    },
    timeRowLast: {
      borderBottom: 'none',
    },
    timeRowSpanFirst: {
      fontWeight: '500',
      color: '#6b7280',
    },
    timeValue: {
      fontWeight: '600',
      color: '#1f2937',
      fontFamily: '"Courier New", monospace',
    },
    sessionTime: {
      fontSize: '18px',
      color: '#10b981',
      fontWeight: '700',
      animation: 'pulse 2s infinite',
      fontFamily: '"Courier New", monospace',
    },
    overtimeValue: {
      color: '#dc2626',
      fontWeight: '600',
      fontFamily: '"Courier New", monospace',
    },
    breakInfoAlert: {
      marginTop: '12px',
      padding: '12px',
      background: '#fef3c7',
      borderRadius: '6px',
      borderLeft: '4px solid #f59e0b',
    },
    breakInfoAlertSpan: {
      color: '#92400e',
      fontWeight: '500',
      fontSize: '14px',
    },
    noAttendanceCard: {
      textAlign: 'center',
      padding: '40px 20px',
      background: '#f9fafb',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
    },
    actionButtonsSection: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    trackerBtn: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '140px',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    trackerBtnDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
    },
    btnCheckIn: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
    },
    btnCheckOut: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
    },
    btnBreak: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
    },
    btnEndBreak: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
    },
    completedMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '20px',
      background: '#d1fae5',
      borderRadius: '10px',
      border: '1px solid #a7f3d0',
    },
    checkIcon: {
      fontSize: '24px',
    },
    completedMessageSpan: {
      fontWeight: '600',
      color: '#065f46',
      fontSize: '16px',
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    statusPresent: {
      background: '#d1fae5',
      color: '#065f46',
    },
    statusAbsent: {
      background: '#fee2e2',
      color: '#991b1b',
    },
    statusLate: {
      background: '#fef3c7',
      color: '#92400e',
    },
    statusEarly: {
      background: '#dbeafe',
      color: '#1e40af',
    },
    statusOvertime: {
      background: '#f3e8ff',
      color: '#7c3aed',
    },
    sessionRow: {
      borderBottom: 'none',
    },
    overtimeRow: {
      borderTop: '2px solid #fef3c7',
      paddingTop: '12px',
      marginTop: '8px',
    }
  };

  // Add keyframes animation for pulse
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

 
  const fetchApiTime = async (forceRetry = false) => {
    // Avoided excessive API calls
    if (!forceRetry && apiCallCount >= 3) {
      console.warn('API call limit reached, using system time');
      setApiTimeAvailable(false);
      return new Date();
    }

    try {
      setApiCallCount(prev => prev + 1);
      
      // Use a different time API or your own server time endpoint
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const apiTime = new Date(data.datetime);
        const systemTime = new Date();
        setTimeOffset(apiTime.getTime() - systemTime.getTime());
        setApiTimeAvailable(true);
        return apiTime;
      } else if (response.status === 429) {
        console.warn('Rate limit exceeded, falling back to system time');
        setApiTimeAvailable(false);
        return new Date();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('API time unavailable, using system time:', error.message);
      setApiTimeAvailable(false);
      return new Date();
    }
  };

 
  const getCurrentTime = () => {
    const systemTime = new Date();
    if (apiTimeAvailable && timeOffset !== 0) {
      return new Date(systemTime.getTime() + timeOffset);
    }
    return systemTime;
  };

  // Check if auto-checkout is needed
  const checkAutoCheckout = async () => {
    if (!currentAttendance?.checkInTime || currentAttendance?.checkOutTime) {
      return;
    }

    const checkInTime = new Date(currentAttendance.checkInTime);
    const now = getCurrentTime();
    const hoursWorked = (now - checkInTime) / (1000 * 60 * 60);

    // Auto-checkout if worked more than max hours
    if (hoursWorked >= BUSINESS_CONFIG.MAX_TOTAL_HOURS) {
      setAutoCheckoutWarning(true);
      setTimeout(async () => {
        await handleAutoCheckout();
        setAutoCheckoutWarning(false);
      }, 3000); // 3 second warning before auto-checkout
    }
  };

  // Handle automatic checkout
  const handleAutoCheckout = async () => {
    try {
      const result = await makeAttendanceCall('checkout', { 
        isAutoCheckout: true,
        reason: 'Maximum work hours exceeded' 
      });
      
      if (result.success) {
        alert(`Auto check-out completed! You've reached the maximum ${BUSINESS_CONFIG.MAX_TOTAL_HOURS}-hour work limit.`);
      }
    } catch (error) {
      console.error('Auto checkout failed:', error);
    }
  };

  //  Update current time every second with better error handling
  useEffect(() => {
    // Try to fetch API time once on mount
    fetchApiTime().then(apiTime => {
      setCurrentTime(apiTime);
    });

    const timer = setInterval(() => {
      const newTime = getCurrentTime();
      setCurrentTime(newTime);
      
      // Check for auto-checkout every minute
      if (newTime.getSeconds() === 0) {
        checkAutoCheckout();
      }
    }, 1000);

    // Refresh API time every 30 minutes instead of 5 minutes to avoid rate limits
    const apiRefreshTimer = setInterval(() => {
      if (apiCallCount < 3) { // Only retry if we haven't hit the limit
        fetchApiTime();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearInterval(timer);
      clearInterval(apiRefreshTimer);
    };
  }, [timeOffset, currentAttendance, apiCallCount]);

  // Calculate session time with business logic
  useEffect(() => {
    if (currentAttendance?.checkInTime && !currentAttendance?.checkOutTime) {
      const checkInTime = new Date(currentAttendance.checkInTime);
      const now = getCurrentTime();
      
      let endTime = now;
      if (currentAttendance.status === 'ON_BREAK' && currentAttendance.breakStart) {
        endTime = new Date(currentAttendance.breakStart);
      }
      
      const diff = endTime - checkInTime;
      let breakTime = 0;
      if (currentAttendance.breakMinutes) {
        breakTime = currentAttendance.breakMinutes * 60 * 1000;
      }
      
      const workingDiff = Math.max(0, diff - breakTime);
      
      const hours = Math.floor(workingDiff / (1000 * 60 * 60));
      const minutes = Math.floor((workingDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((workingDiff % (1000 * 60)) / 1000);
      
      setSessionTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setSessionTime('00:00:00');
    }
  }, [currentTime, currentAttendance]);

  // Fetch current attendance status with date validation
  const fetchCurrentAttendance = async () => {
    if (!employeeId) return;
    
    try {
      const today = getCurrentTime().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5000/api/attendance/current/${employeeId}?date=${today}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentAttendance(data.attendance);
      } else {
        console.error('Failed to fetch attendance:', response.status);
      
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      // Continue with existing attendance data
    }
  };

  // Auto-refresh attendance data when date changes
  useEffect(() => {
    if (employeeId) {
      fetchCurrentAttendance();
      
      // Check for date change at midnight
      const checkDateChange = () => {
        const now = getCurrentTime();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Next midnight
        
        const timeToMidnight = midnight - now;
        
        // Set timeout to refresh at midnight
        if (timeToMidnight > 0) {
          setTimeout(() => {
            fetchCurrentAttendance();
            onAttendanceUpdate && onAttendanceUpdate();
            // Reset API call count at midnight
            setApiCallCount(0);
          }, timeToMidnight);
        }
      };

      checkDateChange();
    }
  }, [employeeId]);

  
  const validateAttendanceAction = (endpoint) => {
    console.log('Validating action for endpoint:', endpoint);
    
    let action = endpoint;
    if (endpoint.includes('/')) {
      const parts = endpoint.split('/');
      action = parts[0];
      
      if (parts[0] === 'break' && parts[1] === 'end') {
        action = 'break-end';
      }
    }
    
    switch (action) {
      case 'checkin':
        if (currentAttendance?.checkInTime && !currentAttendance?.checkOutTime) {
          return { valid: false, error: 'Already checked in today. Please check out first.' };
        }
        break;
        
      case 'checkout':
        if (!currentAttendance?.checkInTime) {
          return { valid: false, error: 'Cannot check out without checking in first.' };
        }
        if (currentAttendance?.checkOutTime) {
          return { valid: false, error: 'Already checked out today.' };
        }
        break;
        
      case 'break':
        if (!currentAttendance?.checkInTime) {
          return { valid: false, error: 'Cannot take break without checking in first.' };
        }
        if (currentAttendance?.checkOutTime) {
          return { valid: false, error: 'Cannot take break after checking out.' };
        }
        if (currentAttendance?.status === 'ON_BREAK') {
          return { valid: false, error: 'Already on break.' };
        }
        break;
        
      case 'break-end':
        if (!currentAttendance?.checkInTime) {
          return { valid: false, error: 'Cannot end break without checking in first.' };
        }
        if (currentAttendance?.checkOutTime) {
          return { valid: false, error: 'Cannot end break after checking out.' };
        }
        if (currentAttendance?.status !== 'ON_BREAK') {
          return { valid: false, error: 'Not currently on break.' };
        }
        break;
        
      default:
        break;
    }
    
    return { valid: true };
  };

  // Handle API calls with business rule validation
  const makeAttendanceCall = async (endpoint, data = {}) => {
    console.log('Making attendance call to:', endpoint);
    
    const validation = validateAttendanceAction(endpoint);
    if (!validation.valid) {
      console.error('Validation failed:', validation.error);
      alert(validation.error);
      return { success: false, error: validation.error };
    }

    setLoading(true);
    try {
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
          businessConfig: BUSINESS_CONFIG,
          ...data 
        })
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (response.ok) {
        setCurrentAttendance(result.attendance);
        onAttendanceUpdate && onAttendanceUpdate();
        return { success: true, data: result };
      } else {
        console.error('API Error:', result);
        alert(result.error || 'Operation failed');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection.');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Event handlers (keeping the same)
  const handleCheckIn = async () => {
    const result = await makeAttendanceCall('checkin');
    if (result.success) {
      const message = `Check-in successful!${result.data.isLate ? ' (Late arrival noted)' : ''}`;
      alert(message);
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
    }
  };

  const handleBreakStart = async () => {
    const result = await makeAttendanceCall('break/start');
    if (result.success) {
      alert('Break started!');
    }
  };

  const handleBreakEnd = async () => {
    console.log('Attempting to end break. Current status:', currentAttendance?.status);
    const result = await makeAttendanceCall('break/end');
    if (result.success) {
      alert(`Break ended! Duration: ${result.data.breakDuration} minutes`);
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

  const getStatusStyle = (statusClass) => {
    const statusStyles = {
      'status-present': styles.statusPresent,
      'status-absent': styles.statusAbsent,
      'status-late': styles.statusLate,
      'status-early': styles.statusEarly,
      'status-overtime': styles.statusOvertime,
    };
    return { ...styles.statusBadge, ...statusStyles[statusClass] };
  };

  // Calculate hours worked for progress indication
  const getWorkProgress = () => {
    if (!currentAttendance?.checkInTime || currentAttendance?.checkOutTime) {
      return { hours: 0, percentage: 0, overtimeHours: 0 };
    }

    const checkInTime = new Date(currentAttendance.checkInTime);
    const now = getCurrentTime();
    const totalMs = now - checkInTime;
    const breakMs = (currentAttendance.breakMinutes || 0) * 60 * 1000;
    const workMs = Math.max(0, totalMs - breakMs);
    const hoursWorked = workMs / (1000 * 60 * 60);
    
    const regularHours = Math.min(hoursWorked, BUSINESS_CONFIG.STANDARD_WORK_HOURS);
    const overtimeHours = Math.max(0, hoursWorked - BUSINESS_CONFIG.STANDARD_WORK_HOURS);
    
    return {
      hours: hoursWorked,
      regularHours,
      overtimeHours,
      percentage: (hoursWorked / BUSINESS_CONFIG.MAX_TOTAL_HOURS) * 100
    };
  };

  if (!employeeId) {
    return (
      <div style={styles.attendanceTrackerCard}>
        <div style={styles.cardBefore}></div>
        <div style={styles.trackerHeader}>
          <h3 style={styles.trackerHeaderH3}>
            <Clock style={styles.headerIcon} />
            Attendance Tracker
          </h3>
        </div>
        <div style={styles.noEmployeeSelected}>
          <p style={styles.noEmployeeSelectedP}>Please select an employee to track attendance</p>
        </div>
      </div>
    );
  }

  const statusBadge = currentAttendance?.status ? getStatusBadge(currentAttendance.status) : null;
  const workProgress = getWorkProgress();

  return (
    <div style={styles.attendanceTrackerCard}>
      <div style={styles.cardBefore}></div>
      
      {/* Auto-checkout warning */}
      {autoCheckoutWarning && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#fee2e2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
            <AlertTriangle size={20} />
            <span style={{ fontWeight: '600' }}>
              Auto check-out in 3 seconds - Maximum work hours exceeded!
            </span>
          </div>
        </div>
      )}

      <div style={styles.trackerHeader}>
        <h3 style={styles.trackerHeaderH3}>
          <Clock style={styles.headerIcon} />
          Smart Attendance Tracker
        </h3>
        <div style={styles.currentTime}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={styles.timeLabel}>Current Time</span>
            {apiTimeAvailable ? (
              <Wifi size={16} color="#10b981" title="API Time - Accurate" />
            ) : (
              <WifiOff size={16} color="#ef4444" title="System Time - Fallback" />
            )}
          </div>
          <span style={styles.timeDisplay}>{currentTime.toLocaleTimeString()}</span>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            Max: {BUSINESS_CONFIG.MAX_TOTAL_HOURS}h/day • API Calls: {apiCallCount}/3
          </div>
        </div>
      </div>

      <div style={styles.statusSection}>
        {currentAttendance ? (
          <div style={styles.statusCardTracker}>
            <div style={styles.statusHeader}>
              <span style={styles.statusLabel}>Today's Status:</span>
              {statusBadge && (
                <span style={getStatusStyle(statusBadge.class)}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            
            <div style={styles.timeInfoGrid}>
              <div style={styles.timeRow}>
                <span style={styles.timeRowSpanFirst}>Check-in:</span>
                <span style={styles.timeValue}>{formatTime(currentAttendance.checkInTime)}</span>
              </div>
              <div style={styles.timeRow}>
                <span style={styles.timeRowSpanFirst}>Check-out:</span>
                <span style={styles.timeValue}>{formatTime(currentAttendance.checkOutTime)}</span>
              </div>
              <div style={{...styles.timeRow, ...styles.sessionRow}}>
                <span style={styles.timeRowSpanFirst}>Session Time:</span>
                <span style={styles.sessionTime}>{sessionTime}</span>
              </div>
              
              {/* Work progress indicator */}
              {!currentAttendance.checkOutTime && currentAttendance.checkInTime && (
                <div style={styles.timeRow}>
                  <span style={styles.timeRowSpanFirst}>Progress:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '100px',
                      height: '6px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(workProgress.percentage, 100)}%`,
                        height: '100%',
                        backgroundColor: workProgress.overtimeHours > 0 ? '#f59e0b' : '#10b981',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {workProgress.hours.toFixed(1)}h
                    </span>
                  </div>
                </div>
              )}
              
              {currentAttendance.totalHours && (
                <div style={styles.timeRow}>
                  <span style={styles.timeRowSpanFirst}>Total Hours:</span>
                  <span style={styles.timeValue}>{currentAttendance.totalHours.toFixed(2)} hrs</span>
                </div>
              )}
              {currentAttendance.breakMinutes > 0 && (
                <div style={styles.timeRow}>
                  <span style={styles.timeRowSpanFirst}>Break Time:</span>
                  <span style={styles.timeValue}>{currentAttendance.breakMinutes} mins</span>
                </div>
              )}
              {currentAttendance.overtime > 0 && (
                <div style={{...styles.timeRow, ...styles.overtimeRow}}>
                  <span style={styles.timeRowSpanFirst}>Overtime:</span>
                  <span style={styles.overtimeValue}>{currentAttendance.overtime.toFixed(2)} hrs</span>
                </div>
              )}
            </div>

            {currentAttendance.breakStart && !currentAttendance.breakEnd && (
              <div style={styles.breakInfoAlert}>
                <span style={styles.breakInfoAlertSpan}>Break started at: {formatTime(currentAttendance.breakStart)}</span>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.noAttendanceCard}>
            <p style={styles.noEmployeeSelectedP}>No attendance record for today</p>
          </div>
        )}
      </div>

      <div style={styles.actionButtonsSection}>
        {!currentAttendance?.checkInTime ? (
          <button 
            style={{
              ...styles.trackerBtn,
              ...styles.btnCheckIn,
              ...(loading ? styles.trackerBtnDisabled : {})
            }}
            onClick={handleCheckIn}
            disabled={loading}
          >
            <Play style={{ width: '16px', height: '16px' }} />
            {loading ? 'Processing...' : 'Check In'}
          </button>
        ) : !currentAttendance?.checkOutTime ? (
          <div style={styles.buttonGroup}>
            {currentAttendance.status !== 'ON_BREAK' ? (
              <>
                <button 
                  style={{
                    ...styles.trackerBtn,
                    ...styles.btnBreak,
                    ...(loading ? styles.trackerBtnDisabled : {})
                  }}
                  onClick={handleBreakStart}
                  disabled={loading}
                >
                  <Pause style={{ width: '16px', height: '16px' }} />
                  {loading ? 'Processing...' : 'Start Break'}
                </button>
                <button 
                  style={{
                    ...styles.trackerBtn,
                    ...styles.btnCheckOut,
                    ...(loading ? styles.trackerBtnDisabled : {})
                  }}
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  <Square style={{ width: '16px', height: '16px' }} />
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              </>
            ) : (
              <>
                <button 
                  style={{
                    ...styles.trackerBtn,
                    ...styles.btnEndBreak,
                    ...(loading ? styles.trackerBtnDisabled : {})
                  }}
                  onClick={handleBreakEnd}
                  disabled={loading}
                >
                  <Play style={{ width: '16px', height: '16px' }} />
                  {loading ? 'Processing...' : 'End Break'}
                </button>
                <button 
                  style={{
                    ...styles.trackerBtn,
                    ...styles.btnCheckOut,
                    ...(loading ? styles.trackerBtnDisabled : {})
                  }}
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  <Square style={{ width: '16px', height: '16px' }} />
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={styles.completedMessage}>
            <CheckCircle style={styles.checkIcon} color="#10b981" size={24} />
            <span style={styles.completedMessageSpan}>Attendance completed for today</span>
          </div>
        )}
      </div>
      
      {/* Debug info - only show if there are issues */}
      {currentAttendance && (process.env.NODE_ENV === 'development' || apiCallCount >= 3) && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '10px',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          <div>Status: {currentAttendance.status}</div>
          <div>Break Start: {currentAttendance.breakStart ? formatTime(currentAttendance.breakStart) : 'None'}</div>
          <div>Break End: {currentAttendance.breakEnd ? formatTime(currentAttendance.breakEnd) : 'None'}</div>
          <div>API Calls: {apiCallCount}/3 • Time Source: {apiTimeAvailable ? 'API' : 'System'}</div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;