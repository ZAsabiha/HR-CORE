import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDepartmentsDropdown = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      select: { id: true, name: true }
    });
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load departments' });
  }
};

export const getEmployeesByDepartment = async (req, res) => {
  const { departmentId } = req.query;
  if (!departmentId) {
    return res.status(400).json({ success: false, message: 'Department ID is required' });
  }

  try {
    const employees = await prisma.employee.findMany({
      where: { departmentId: Number(departmentId) },
      select: {
        id: true,
        name: true,
        department: { select: { name: true } }
      }
    });

    res.json({ success: true, data: employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load employees' });
  }
};

export const updateSalary = async (req, res) => {
  const { employee, baseSalary, allowances, deductions, payDate, overtimeHours } = req.body;

  if (!employee || !baseSalary || !payDate) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const salary = await prisma.salary.create({
      data: {
        employeeId: Number(employee),
        baseSalary: Number(baseSalary),
        allowances: Number(allowances || 0),
        deductions: Number(deductions || 0),
        payDate: new Date(payDate),
        overtimeHours: Number(overtimeHours || 0),
      }
    });

    res.json({ success: true, data: salary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create salary record' });
  }
};

// NEW: Get overtime data from attendance records
export const getOvertimeData = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      department,
      employeeId,
      page = 1, 
      limit = 10 
    } = req.query;

    const where = {
      overtime: {
        gt: 0 // Only records with overtime
      }
    };

    // Add date filters
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    } else {
      // Default to current month if no date specified
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      where.date = {
        gte: startOfMonth,
        lte: endOfMonth
      };
    }

    // Add employee filter
    if (employeeId) {
      where.employeeId = parseInt(employeeId);
    }

    // Add department filter through employee relation
    const employeeWhere = {};
    if (department && department !== 'all') {
      employeeWhere.department = { name: department };
    }

    const skip = (page - 1) * limit;

    const [overtimeRecords, total] = await Promise.all([
      prisma.attendance.findMany({
        where: {
          ...where,
          employee: employeeWhere
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              salary: true,
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

    // Calculate overtime pay for each record
    const processedRecords = overtimeRecords.map(record => {
      const hourlyRate = record.employee.salary / (52 * 40); // Annual salary to hourly rate
      const regularHours = Math.min(record.totalHours || 0, 8);
      const overtimeHours = record.overtime || 0;
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x for overtime

      return {
        id: record.id,
        employeeId: record.employee.id,
        employeeName: record.employee.name,
        employeeEmail: record.employee.email,
        position: record.employee.position,
        department: record.employee.department.name,
        date: record.date,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalHours: record.totalHours,
        regularHours,
        overtimeHours,
        hourlyRate: parseFloat(hourlyRate.toFixed(2)),
        regularPay: parseFloat(regularPay.toFixed(2)),
        overtimePay: parseFloat(overtimePay.toFixed(2)),
        totalPay: parseFloat((regularPay + overtimePay).toFixed(2)),
        breakMinutes: record.breakMinutes,
        location: record.location,
        status: record.status
      };
    });

    // Calculate summary statistics
    const stats = {
      totalEmployees: new Set(processedRecords.map(r => r.employeeId)).size,
      totalRecords: total,
      totalOvertimeHours: parseFloat(processedRecords.reduce((sum, r) => sum + r.overtimeHours, 0).toFixed(1)),
      totalOvertimePay: parseFloat(processedRecords.reduce((sum, r) => sum + r.overtimePay, 0).toFixed(2)),
      averageOvertimeHours: processedRecords.length > 0 ? 
        parseFloat((processedRecords.reduce((sum, r) => sum + r.overtimeHours, 0) / processedRecords.length).toFixed(1)) : 0
    };

    res.json({
      success: true,
      data: processedRecords,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get overtime data error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch overtime data' });
  }
};

// NEW: Get overtime summary by employee for a date range
export const getOvertimeSummary = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;

    const where = {
      overtime: {
        gt: 0
      }
    };

    // Add date filters
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Add department filter
    const employeeWhere = {};
    if (department && department !== 'all') {
      employeeWhere.department = { name: department };
    }

    const overtimeRecords = await prisma.attendance.findMany({
      where: {
        ...where,
        employee: employeeWhere
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            salary: true,
            position: true,
            department: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Group by employee and calculate totals
    const employeeSummary = {};
    overtimeRecords.forEach(record => {
      const empId = record.employee.id;
      if (!employeeSummary[empId]) {
        const hourlyRate = record.employee.salary / (52 * 40);
        employeeSummary[empId] = {
          employeeId: empId,
          name: record.employee.name,
          email: record.employee.email,
          position: record.employee.position,
          department: record.employee.department.name,
          hourlyRate: parseFloat(hourlyRate.toFixed(2)),
          totalOvertimeHours: 0,
          totalOvertimePay: 0,
          overtimeDays: 0,
          records: []
        };
      }

      const summary = employeeSummary[empId];
      const overtimeHours = record.overtime || 0;
      const overtimePay = overtimeHours * summary.hourlyRate * 1.5;

      summary.totalOvertimeHours += overtimeHours;
      summary.totalOvertimePay += overtimePay;
      summary.overtimeDays += 1;
      summary.records.push({
        date: record.date,
        overtimeHours,
        overtimePay: parseFloat(overtimePay.toFixed(2))
      });
    });

    // Convert to array and round totals
    const summaryArray = Object.values(employeeSummary).map(summary => ({
      ...summary,
      totalOvertimeHours: parseFloat(summary.totalOvertimeHours.toFixed(1)),
      totalOvertimePay: parseFloat(summary.totalOvertimePay.toFixed(2))
    }));

    // Sort by total overtime pay descending
    summaryArray.sort((a, b) => b.totalOvertimePay - a.totalOvertimePay);

    res.json({
      success: true,
      data: summaryArray,
      summary: {
        totalEmployees: summaryArray.length,
        grandTotalOvertimeHours: parseFloat(summaryArray.reduce((sum, emp) => sum + emp.totalOvertimeHours, 0).toFixed(1)),
        grandTotalOvertimePay: parseFloat(summaryArray.reduce((sum, emp) => sum + emp.totalOvertimePay, 0).toFixed(2))
      }
    });
  } catch (err) {
    console.error('Get overtime summary error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch overtime summary' });
  }
};

// NEW: Generate payroll with automatic overtime calculation
export const generatePayrollWithOvertime = async (req, res) => {
  try {
    const { startDate, endDate, departmentId } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start date and end date are required' });
    }

    const employeeWhere = {};
    if (departmentId) {
      employeeWhere.departmentId = parseInt(departmentId);
    }

    // Get all employees
    const employees = await prisma.employee.findMany({
      where: employeeWhere,
      include: {
        department: true,
        attendances: {
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          }
        }
      }
    });

    const payrollRecords = [];

    for (const employee of employees) {
      const hourlyRate = employee.salary / (52 * 40);
      let totalRegularHours = 0;
      let totalOvertimeHours = 0;

      // Calculate totals from attendance records
      employee.attendances.forEach(attendance => {
        const regularHours = Math.min(attendance.totalHours || 0, 8);
        const overtimeHours = attendance.overtime || 0;
        
        totalRegularHours += regularHours;
        totalOvertimeHours += overtimeHours;
      });

      const regularPay = totalRegularHours * hourlyRate;
      const overtimePay = totalOvertimeHours * hourlyRate * 1.5;
      const grossPay = regularPay + overtimePay;
      const deductions = grossPay * 0.15; // 15% deductions (taxes, etc.)
      const netPay = grossPay - deductions;

      // Create salary record
      const salaryRecord = await prisma.salary.create({
        data: {
          employeeId: employee.id,
          baseSalary: parseFloat(regularPay.toFixed(2)),
          allowances: parseFloat(overtimePay.toFixed(2)), // Store overtime pay as allowances
          deductions: parseFloat(deductions.toFixed(2)),
          payDate: new Date(endDate),
          overtimeHours: parseInt(totalOvertimeHours)
        }
      });

      payrollRecords.push({
        salaryRecord,
        employeeName: employee.name,
        department: employee.department.name,
        totalRegularHours: parseFloat(totalRegularHours.toFixed(1)),
        totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(1)),
        regularPay: parseFloat(regularPay.toFixed(2)),
        overtimePay: parseFloat(overtimePay.toFixed(2)),
        grossPay: parseFloat(grossPay.toFixed(2)),
        netPay: parseFloat(netPay.toFixed(2))
      });
    }

    res.json({
      success: true,
      message: 'Payroll generated successfully',
      data: payrollRecords,
      summary: {
        totalEmployees: payrollRecords.length,
        totalGrossPay: parseFloat(payrollRecords.reduce((sum, r) => sum + r.grossPay, 0).toFixed(2)),
        totalOvertimePay: parseFloat(payrollRecords.reduce((sum, r) => sum + r.overtimePay, 0).toFixed(2))
      }
    });
  } catch (err) {
    console.error('Generate payroll error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate payroll' });
  }
};
