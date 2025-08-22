import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper functions
const calculateHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const diffMs = new Date(endTime) - new Date(startTime);
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};

const calculateMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const diffMs = new Date(endTime) - new Date(startTime);
  return Math.floor(diffMs / (1000 * 60));
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return new Date(`${year}-${month}-${day}`);
};

// Check-in employee
export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = getTodayDate();

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) }
    });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if already checked in today
    let attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      }
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ 
        error: 'Employee already checked in today',
        checkInTime: attendance.checkInTime
      });
    }

    // Determine if late (assuming 9 AM is standard start time)
    const standardStartTime = new Date(today);
    standardStartTime.setHours(9, 0, 0, 0);
    const isLate = now > standardStartTime;

    // Create or update attendance record
    attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      },
      update: {
        checkInTime: now,
        status: isLate ? 'LATE' : 'PRESENT',
        location: 'Office' // Default location
      },
      create: {
        employeeId: parseInt(employeeId),
        checkInTime: now,
        date: today,
        status: isLate ? 'LATE' : 'PRESENT',
        location: 'Office'
      },
      include: {
        employee: {
          select: {
            name: true,
            email: true,
            position: true
          }
        }
      }
    });

    res.json({
      message: 'Check-in successful',
      attendance,
      checkInTime: now,
      isLate
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
};

// Check-out employee
export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = getTodayDate();

    // Find today's attendance record
    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ error: 'Employee has not checked in today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ 
        error: 'Employee already checked out today',
        checkOutTime: attendance.checkOutTime
      });
    }

    // Calculate total hours and break time
    const totalHours = calculateHours(attendance.checkInTime, now);
    const breakMinutes = attendance.breakStart && attendance.breakEnd 
      ? calculateMinutes(attendance.breakStart, attendance.breakEnd) 
      : 0;

    // Calculate working hours (total - break time)
    const workingHours = totalHours - (breakMinutes / 60);
    
    // Calculate overtime (assuming 8 hours is standard work day)
    const overtime = workingHours > 8 ? workingHours - 8 : 0;
    
    // Determine status
    let status = 'PRESENT';
    if (workingHours < 4) {
      status = 'HALF_DAY';
    } else if (overtime > 0) {
      status = 'OVERTIME';
    } else if (attendance.status === 'LATE') {
      status = 'LATE'; // Keep late status
    }

    // Check for early departure (before 5 PM)
    const standardEndTime = new Date(today);
    standardEndTime.setHours(17, 0, 0, 0);
    if (now < standardEndTime && workingHours >= 4) {
      status = 'EARLY_DEPARTURE';
    }

    // Update attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: now,
        totalHours: workingHours,
        breakMinutes,
        overtime,
        status
      },
      include: {
        employee: {
          select: {
            name: true,
            email: true,
            position: true
          }
        }
      }
    });

    res.json({
      message: 'Check-out successful',
      attendance: updatedAttendance,
      checkOutTime: now,
      totalHours: workingHours,
      breakMinutes,
      overtime
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
};

// Start break
export const startBreak = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = getTodayDate();

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ error: 'Employee must check in first' });
    }

    if (attendance.breakStart && !attendance.breakEnd) {
      return res.status(400).json({ error: 'Break already started' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        breakStart: now,
        breakEnd: null, // Reset break end
        status: 'ON_BREAK'
      }
    });

    res.json({
      message: 'Break started',
      attendance: updatedAttendance,
      breakStart: now
    });
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({ error: 'Failed to start break' });
  }
};

// End break
export const endBreak = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = getTodayDate();

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      }
    });

    if (!attendance || !attendance.breakStart) {
      return res.status(400).json({ error: 'Break not started' });
    }

    if (attendance.breakEnd) {
      return res.status(400).json({ error: 'Break already ended' });
    }

    const breakMinutes = calculateMinutes(attendance.breakStart, now);

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        breakEnd: now,
        breakMinutes,
        status: 'PRESENT'
      }
    });

    res.json({
      message: 'Break ended',
      attendance: updatedAttendance,
      breakEnd: now,
      breakDuration: breakMinutes
    });
  } catch (error) {
    console.error('End break error:', error);
    res.status(500).json({ error: 'Failed to end break' });
  }
};

// Get current attendance status
export const getCurrentAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = getTodayDate();

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: parseInt(employeeId),
          date: today
        }
      },
      include: {
        employee: {
          select: {
            name: true,
            email: true,
            position: true
          }
        }
      }
    });

    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
};

// Get attendance logs with filters (extends your existing functionality)
export const getAttendanceLogs = async (req, res) => {
  try {
    const { 
      employeeId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      status,
      department
    } = req.query;

    const where = {};
    
    if (employeeId) where.employeeId = parseInt(employeeId);
    if (status && status !== 'all') where.status = status;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Add department filter through employee relation
    const employeeWhere = {};
    if (department && department !== 'all') {
      employeeWhere.department = { name: department };
    }

    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      prisma.attendance.findMany({
        where: {
          ...where,
          employee: employeeWhere
        },
        include: {
          employee: {
            select: {
              name: true,
              email: true,
              position: true,
              department: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.attendance.count({ 
        where: {
          ...where,
          employee: employeeWhere
        }
      })
    ]);

    // Calculate statistics for the filtered data
    const stats = await calculateAttendanceStats(where, employeeWhere);

    res.json({
      logs,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get attendance logs' });
  }
};

// Helper function to calculate attendance statistics
const calculateAttendanceStats = async (where, employeeWhere) => {
  const today = getTodayDate();
  
  // Get today's attendance records
  const todayRecords = await prisma.attendance.findMany({
    where: {
      ...where,
      date: today,
      employee: employeeWhere
    }
  });

  const totalEmployees = await prisma.employee.count({
    where: employeeWhere
  });

  const present = todayRecords.filter(r => 
    ['PRESENT', 'LATE', 'OVERTIME', 'EARLY_DEPARTURE'].includes(r.status)
  ).length;
  
  const absent = totalEmployees - present;
  const late = todayRecords.filter(r => r.status === 'LATE').length;

  return {
    total: totalEmployees,
    present,
    absent,
    late
  };
};
