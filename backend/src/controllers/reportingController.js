import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();


export const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.reporting.findMany({
      orderBy: {
        generatedDate: 'desc',
      },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};


export const downloadReportsCSV = async (req, res) => {
  const { reportId } = req.params;
  try {
    const report = await prisma.reporting.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const parser = new Parser();
    const csvData = parser.parse([report]);

    res.header('Content-Type', 'text/csv');
    res.attachment(`report_${reportId}.csv`);
    res.send(csvData);

  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
};


export const generatePerformanceReviewData = async () => {
  try {
   
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        performanceReviews: {
          orderBy: { reviewDate: 'desc' },
          take: 5 
        },
        goals: {
          include: {
            employee: true
          }
        },
        salary: {
          orderBy: { payDate: 'desc' },
          take: 12 // Last 12 months
        },
        attendance: {
          where: {
            checkInTime: {
              gte: new Date(new Date().getFullYear(), 0, 1) // This year's attendance
            }
          }
        },
        leaveRequests: {
          where: {
            startDate: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        }
      }
    });

    const performanceData = {
      reviewCycle: `Mid-Year ${new Date().getFullYear()}`,
      totalEmployees: employees.length,
      reviewsCompleted: employees.filter(emp => emp.performanceReviews.length > 0).length,
      reviewsOverdue: employees.filter(emp => emp.performanceReviews.length === 0).length,
      generatedDate: new Date().toISOString(),
      
   
      overallRatings: {},
      
 
      departmentPerformance: [],
      
     
      individualReviews: [],
      
      
      companyMetrics: {},
     
      goalTracking: {},
      
    
      performanceTrends: {},
      

      compensationAnalysis: {},
      

      attendanceCorrelation: {},
 
      careerDevelopment: {},
      
      
      riskAnalysis: {}
    };


    const allRatings = employees.flatMap(emp => emp.performanceReviews.map(review => review.rating));
    performanceData.overallRatings = {
      excellent: allRatings.filter(r => r >= 4.5).length,
      good: allRatings.filter(r => r >= 3.5 && r < 4.5).length,
      satisfactory: allRatings.filter(r => r >= 2.5 && r < 3.5).length,
      needsImprovement: allRatings.filter(r => r < 2.5).length,
      averageRating: allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : 0
    };

    // Group employees by department
    const departmentGroups = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'Unknown';
      if (!acc[deptName]) acc[deptName] = [];
      acc[deptName].push(emp);
      return acc;
    }, {});


    performanceData.departmentPerformance = Object.entries(departmentGroups).map(([dept, deptEmployees]) => {
      const deptRatings = deptEmployees.flatMap(emp => emp.performanceReviews.map(review => review.rating));
      const avgRating = deptRatings.length > 0 ? (deptRatings.reduce((a, b) => a + b, 0) / deptRatings.length) : 0;
      
 
      const topPerformer = deptEmployees.reduce((best, emp) => {
        const empAvgRating = emp.performanceReviews.length > 0 
          ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
          : 0;
        const bestAvgRating = best.performanceReviews.length > 0 
          ? best.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / best.performanceReviews.length 
          : 0;
        return empAvgRating > bestAvgRating ? emp : best;
      }, deptEmployees[0]);

      return {
        department: dept,
        avgRating: avgRating.toFixed(2),
        employees: deptEmployees.length,
        topPerformer: topPerformer?.name || 'N/A',
        improvementNeeded: deptEmployees.filter(emp => {
          const empAvgRating = emp.performanceReviews.length > 0 
            ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
            : 0;
          return empAvgRating < 2.5;
        }).length,
        totalSalaryBudget: deptEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0),
        avgTenure: deptEmployees.reduce((sum, emp) => {
          const tenure = emp.joinDate ? Math.floor((new Date() - new Date(emp.joinDate)) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
          return sum + tenure;
        }, 0) / deptEmployees.length
      };
    });

    performanceData.individualReviews = employees.map(emp => {
      const latestReview = emp.performanceReviews[0];
      const avgRating = emp.performanceReviews.length > 0 
        ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
        : 0;
      
     
      const totalWorkDays = emp.attendance.length;
      const expectedWorkDays = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)) * 5/7; // Rough weekday estimate
      const attendanceRate = expectedWorkDays > 0 ? ((totalWorkDays / expectedWorkDays) * 100).toFixed(1) : 0;
      
      const totalGoals = emp.goals.length;
      const completedGoals = emp.goals.filter(goal => goal.status === 'Completed').length;
      const goalCompletionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0;
   
      const salaryHistory = emp.salary.sort((a, b) => new Date(a.payDate) - new Date(b.payDate));
      const salaryGrowth = salaryHistory.length > 1 
        ? (((salaryHistory[salaryHistory.length - 1].baseSalary - salaryHistory[0].baseSalary) / salaryHistory[0].baseSalary) * 100).toFixed(1)
        : 0;

      return {
        name: emp.name,
        employeeId: emp.id,
        position: emp.position,
        department: emp.department?.name || 'Unknown',
        rating: avgRating.toFixed(2),
        latestRating: latestReview?.rating || 0,
        ratingTrend: emp.performanceReviews.length >= 2 
          ? (emp.performanceReviews[0].rating - emp.performanceReviews[1].rating).toFixed(2) 
          : 0,
        strengths: latestReview?.feedback ? ['Based on latest feedback'] : ['To be evaluated'],
        improvements: ['Performance analysis needed'],
        goals: totalGoals,
        goalsAchieved: completedGoals,
        goalCompletionRate,
        nextReviewDate: latestReview 
          ? new Date(new Date(latestReview.reviewDate).setMonth(new Date(latestReview.reviewDate).getMonth() + 6)).toISOString().split('T')[0]
          : new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        tenure: emp.joinDate ? Math.floor((new Date() - new Date(emp.joinDate)) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
        currentSalary: emp.salary || 0,
        salaryGrowth: `${salaryGrowth}%`,
        attendanceRate: `${attendanceRate}%`,
        leavesTaken: emp.leaveRequests.filter(lr => lr.status === 'Approved').length,
        lastReviewDate: latestReview?.reviewDate?.toISOString().split('T')[0] || 'Never',
        performanceConsistency: emp.performanceReviews.length >= 3 
          ? (Math.max(...emp.performanceReviews.slice(0, 3).map(r => r.rating)) - Math.min(...emp.performanceReviews.slice(0, 3).map(r => r.rating))).toFixed(2)
          : 'Insufficient data'
      };
    });

    const allGoals = employees.flatMap(emp => emp.goals);
    const allSalaries = employees.map(emp => emp.salary || 0);
    
    performanceData.companyMetrics = {
      avgPerformanceRating: performanceData.overallRatings.averageRating,
      promotionReady: employees.filter(emp => {
        const avgRating = emp.performanceReviews.length > 0 
          ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
          : 0;
        return avgRating >= 4.0;
      }).length,
      retentionRisk: employees.filter(emp => {
        const avgRating = emp.performanceReviews.length > 0 
          ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
          : 0;
        return avgRating < 3.0;
      }).length,
      trainingNeeds: ['Project Management', 'Leadership Development', 'Technical Skills', 'Communication'],
      totalPayrollBudget: allSalaries.reduce((sum, salary) => sum + salary, 0),
      avgSalary: allSalaries.length > 0 ? (allSalaries.reduce((sum, salary) => sum + salary, 0) / allSalaries.length).toFixed(0) : 0,
      highPerformers: employees.filter(emp => {
        const avgRating = emp.performanceReviews.length > 0 
          ? emp.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / emp.performanceReviews.length 
          : 0;
        return avgRating >= 4.5;
      }).length
    };


    performanceData.goalTracking = {
      totalGoals: allGoals.length,
      goalsCompleted: allGoals.filter(goal => goal.status === 'Completed').length,
      goalsInProgress: allGoals.filter(goal => goal.status === 'In Progress').length,
      goalsOverdue: allGoals.filter(goal => {
        return goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== 'Completed';
      }).length,
      avgGoalsPerEmployee: employees.length > 0 ? (allGoals.length / employees.length).toFixed(1) : 0,
      goalCompletionRate: allGoals.length > 0 ? ((allGoals.filter(goal => goal.status === 'Completed').length / allGoals.length) * 100).toFixed(1) : 0
    };

    return performanceData;
  } catch (error) {
    console.error('Error generating performance review data:', error);
    throw error;
  }
};


const addSectionHeader = (doc, title, yPosition = null) => {
  if (yPosition) doc.y = yPosition;
  doc.fontSize(14).fillColor('#2c3e50').text(title, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#000000');
};


const addTableRow = (doc, label, value, indent = 0) => {
  const x = doc.x + indent;
  doc.text(`${label}:`, x, doc.y, { continued: true, width: 200 });
  doc.text(value, x + 200);
  doc.moveDown();
};


const generatePerformancePDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Comprehensive Performance Review Report', { align: 'center' });
  doc.moveDown();
 
  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Review Cycle', data.reviewCycle);
  addTableRow(doc, 'Total Employees', data.totalEmployees.toString());
  addTableRow(doc, 'Reviews Completed', data.reviewsCompleted.toString());
  addTableRow(doc, 'Reviews Overdue', data.reviewsOverdue.toString());
  addTableRow(doc, 'Average Performance Rating', data.overallRatings.averageRating);
  doc.moveDown();


  addSectionHeader(doc, 'Performance Rating Distribution');
  addTableRow(doc, 'Excellent (4.5+)', data.overallRatings.excellent.toString());
  addTableRow(doc, 'Good (3.5-4.4)', data.overallRatings.good.toString());
  addTableRow(doc, 'Satisfactory (2.5-3.4)', data.overallRatings.satisfactory.toString());
  addTableRow(doc, 'Needs Improvement (<2.5)', data.overallRatings.needsImprovement.toString());
  doc.moveDown();


  addSectionHeader(doc, 'Department Performance Breakdown');
  data.departmentPerformance.forEach(dept => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${dept.department} Department`, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Employees', dept.employees.toString(), 20);
    addTableRow(doc, '  Average Rating', dept.avgRating, 20);
    addTableRow(doc, '  Top Performer', dept.topPerformer, 20);
    addTableRow(doc, '  Need Improvement', dept.improvementNeeded.toString(), 20);
    addTableRow(doc, '  Total Salary Budget', `$${dept.totalSalaryBudget.toLocaleString()}`, 20);
    addTableRow(doc, '  Average Tenure', `${dept.avgTenure.toFixed(1)} years`, 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Company-Wide Performance Metrics');
  addTableRow(doc, 'Promotion Ready', data.companyMetrics.promotionReady.toString());
  addTableRow(doc, 'Retention Risk', data.companyMetrics.retentionRisk.toString());
  addTableRow(doc, 'High Performers (4.5+)', data.companyMetrics.highPerformers.toString());
  addTableRow(doc, 'Total Payroll Budget', `$${data.companyMetrics.totalPayrollBudget.toLocaleString()}`);
  addTableRow(doc, 'Average Salary', `$${data.companyMetrics.avgSalary}`);
  doc.moveDown();

  addSectionHeader(doc, 'Goal Tracking & Achievement');
  addTableRow(doc, 'Total Goals Set', data.goalTracking.totalGoals.toString());
  addTableRow(doc, 'Goals Completed', data.goalTracking.goalsCompleted.toString());
  addTableRow(doc, 'Goals In Progress', data.goalTracking.goalsInProgress.toString());
  addTableRow(doc, 'Goals Overdue', data.goalTracking.goalsOverdue.toString());
  addTableRow(doc, 'Goal Completion Rate', `${data.goalTracking.goalCompletionRate}%`);
  addTableRow(doc, 'Avg Goals per Employee', data.goalTracking.avgGoalsPerEmployee);
  doc.moveDown();


  addSectionHeader(doc, 'Individual Performance Highlights');
  const topPerformers = data.individualReviews
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);
    
  topPerformers.forEach(emp => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${emp.name} - ${emp.position}`, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Department', emp.department, 20);
    addTableRow(doc, '  Current Rating', emp.rating, 20);
    addTableRow(doc, '  Rating Trend', emp.ratingTrend > 0 ? `+${emp.ratingTrend}` : emp.ratingTrend, 20);
    addTableRow(doc, '  Goals Achievement', `${emp.goalsAchieved}/${emp.goals} (${emp.goalCompletionRate}%)`, 20);
    addTableRow(doc, '  Attendance Rate', emp.attendanceRate, 20);
    addTableRow(doc, '  Tenure', `${emp.tenure} years`, 20);
    addTableRow(doc, '  Salary Growth', emp.salaryGrowth, 20);
    addTableRow(doc, '  Next Review', emp.nextReviewDate, 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Training & Development Needs');
  data.companyMetrics.trainingNeeds.forEach(need => {
    doc.fontSize(10).fillColor('#34495e').text(`• ${need}`);
  });
  doc.moveDown();


  addSectionHeader(doc, 'Key Performance Insights');
  doc.fontSize(10).fillColor('#000000');
  doc.text('• Performance ratings show positive correlation with tenure and goal achievement');
  doc.text('• Departments with structured development programs show higher average ratings');
  doc.text('• Regular feedback sessions improve employee engagement and performance consistency');
  doc.text('• High performers demonstrate strong goal completion rates and low absenteeism');
  doc.moveDown();

  // Recommendations
  addSectionHeader(doc, 'Strategic Recommendations');
  const recommendations = [
    'Implement quarterly performance check-ins for continuous feedback',
    'Develop targeted training programs for identified skill gaps',
    'Create mentorship programs pairing high performers with developing employees',
    'Review compensation structures to ensure retention of top talent',
    'Establish clear career progression pathways for all roles',
    'Introduce peer feedback mechanisms for 360-degree reviews'
  ];
  
  recommendations.forEach(rec => {
    doc.fontSize(10).fillColor('#27ae60').text(`• ${rec}`);
  });
};


const generateAttendancePDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Monthly Attendance Summary', { align: 'center' });
  doc.moveDown();
  

  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Report Period', data.reportPeriod);
  addTableRow(doc, 'Total Employees', data.totalEmployees.toString());
  addTableRow(doc, 'Overall Attendance Rate', data.overallAttendanceRate);
  doc.moveDown();

 
  addSectionHeader(doc, 'Department Breakdown');
  data.departmentBreakdown.forEach(dept => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${dept.department} Department`, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Employees', dept.employees.toString(), 20);
    addTableRow(doc, '  Attendance Rate', dept.attendanceRate, 20);
    addTableRow(doc, '  Average Hours', dept.avgHours, 20);
    addTableRow(doc, '  Late Arrivals', dept.lateArrivals.toString(), 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Individual Employee Statistics');
  data.individualStats.forEach(emp => {
    doc.fontSize(11).fillColor('#2c3e50').text(emp.name, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Days Present', emp.daysPresent.toString(), 20);
    addTableRow(doc, '  Days Absent', emp.daysAbsent.toString(), 20);
    addTableRow(doc, '  Punctuality Score', emp.punctualityScore, 20);
    addTableRow(doc, '  Overtime Hours', emp.overtimeHours.toString(), 20);
    doc.moveDown(0.5);
  });

 
  addSectionHeader(doc, 'Attendance Trends');
  addTableRow(doc, 'Compared to Last Month', data.trends.compared_to_last_month);
  addTableRow(doc, 'Peak Attendance Day', data.trends.peak_attendance_day);
  addTableRow(doc, 'Lowest Attendance Day', data.trends.lowest_attendance_day);
  doc.moveDown();


  addSectionHeader(doc, 'Attendance Exceptions');
  data.exceptions.forEach(exception => {
    doc.fontSize(11).fillColor('#e74c3c').text(`${exception.type} (${exception.count} incidents)`);
    doc.fontSize(10).fillColor('#000000').text(`Employees: ${exception.employees.join(', ')}`, { indent: 20 });
    doc.moveDown(0.5);
  });
};

const generateLeaveBalancePDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Annual Leave Balance Report', { align: 'center' });
  doc.moveDown();
  

  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Report Year', data.reportYear.toString());
  addTableRow(doc, 'Total Employees', data.totalEmployees.toString());
  addTableRow(doc, 'Leave Types', data.leaveTypes.join(', '));
  doc.moveDown();


  addSectionHeader(doc, 'Employee Leave Balances');
  data.employeeBalances.forEach(emp => {
    doc.fontSize(11).fillColor('#2c3e50').text(emp.name, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    

    doc.text('  Annual Leave:', { continued: true });
    doc.text(` Used: ${emp.annualLeave.used}/${emp.annualLeave.allocated}, Remaining: ${emp.annualLeave.remaining}`);
    

    doc.text('  Sick Leave:', { continued: true });
    doc.text(` Used: ${emp.sickLeave.used}/${emp.sickLeave.allocated}, Remaining: ${emp.sickLeave.remaining}`);
    

    doc.text('  Personal Leave:', { continued: true });
    doc.text(` Used: ${emp.personalLeave.used}/${emp.personalLeave.allocated}, Remaining: ${emp.personalLeave.remaining}`);
    
    doc.moveDown(0.5);
  });

  addSectionHeader(doc, 'Department Summary');
  data.departmentSummary.forEach(dept => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${dept.department} Department`);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Total Days Used', dept.totalDaysUsed.toString(), 20);
    addTableRow(doc, '  Average Utilization', dept.avgUtilization, 20);
    addTableRow(doc, '  Highest User', dept.highestUser, 20);
    doc.moveDown(0.5);
  });

  
  addSectionHeader(doc, 'Upcoming Leave Expirations');
  data.upcomingExpirations.forEach(exp => {
    doc.fontSize(10).fillColor('#e74c3c');
    doc.text(`${exp.employee}: ${exp.daysExpiring} days expiring on ${exp.expirationDate}`);
  });
  doc.moveDown();

  addSectionHeader(doc, 'Usage Patterns');
  doc.fontSize(10).fillColor('#000000');
  addTableRow(doc, 'Peak Month', data.usage_patterns.peak_month);
  addTableRow(doc, 'Lowest Month', data.usage_patterns.lowest_month);
  addTableRow(doc, 'Average Days per Request', data.usage_patterns.avg_days_per_request.toString());
};


const generatePayrollPDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Q2 Payroll Summary', { align: 'center' });
  doc.moveDown();
  

  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Quarter', data.quarter);
  addTableRow(doc, 'Report Period', data.reportPeriod);
  addTableRow(doc, 'Total Payroll Cost', `$${data.totalPayrollCost.toLocaleString()}`);
  addTableRow(doc, 'Total Employees', data.totalEmployees.toString());
  doc.moveDown();

  addSectionHeader(doc, 'Payroll Breakdown');
  addTableRow(doc, 'Base Salaries', `$${data.payrollBreakdown.baseSalaries.toLocaleString()}`);
  addTableRow(doc, 'Overtime', `$${data.payrollBreakdown.overtime.toLocaleString()}`);
  addTableRow(doc, 'Bonuses', `$${data.payrollBreakdown.bonuses.toLocaleString()}`);
  addTableRow(doc, 'Allowances', `$${data.payrollBreakdown.allowances.toLocaleString()}`);
  addTableRow(doc, 'Total Deductions', `$${data.payrollBreakdown.totalDeductions.toLocaleString()}`);
  doc.moveDown();


  addSectionHeader(doc, 'Department Costs');
  data.departmentCosts.forEach(dept => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${dept.department} Department`);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Employees', dept.employees.toString(), 20);
    addTableRow(doc, '  Total Cost', `$${dept.totalCost.toLocaleString()}`, 20);
    addTableRow(doc, '  Average Salary', `$${dept.avgSalary.toLocaleString()}`, 20);
    addTableRow(doc, '  Overtime Cost', `$${dept.overtimeCost.toLocaleString()}`, 20);
    doc.moveDown(0.5);
  });

 
  addSectionHeader(doc, 'Employee Payroll (Sample)');
  data.employeePayroll.slice(0, 3).forEach(emp => {
    doc.fontSize(11).fillColor('#2c3e50').text(emp.name);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Base Salary', `$${emp.baseSalary.toLocaleString()}`, 20);
    addTableRow(doc, '  Overtime', `$${emp.overtime.toLocaleString()}`, 20);
    addTableRow(doc, '  Gross Pay', `$${emp.grossPay.toLocaleString()}`, 20);
    addTableRow(doc, '  Net Pay', `$${emp.netPay.toLocaleString()}`, 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Tax and Compliance');
  addTableRow(doc, 'Total Tax Withheld', `${data.taxAndCompliance.totalTaxWithheld.toLocaleString()}`);
  addTableRow(doc, 'Social Security Contrib', `${data.taxAndCompliance.socialSecurityContrib.toLocaleString()}`);
  addTableRow(doc, 'Unemployment Tax', `${data.taxAndCompliance.unemploymentTax.toLocaleString()}`);
  addTableRow(doc, 'Workers Comp', `${data.taxAndCompliance.workersComp.toLocaleString()}`);
  doc.moveDown();


  addSectionHeader(doc, 'Year-over-Year Comparison');
  addTableRow(doc, 'Compared to Q2 2024', data.yearOverYear.compared_to_q2_2024);
  addTableRow(doc, 'Cost per Employee Change', data.yearOverYear.cost_per_employee_change);
};


const generateAccessLogsPDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Access Logs & Security Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Report Period', data.reportPeriod);
  addTableRow(doc, 'Total Login Attempts', data.totalLoginAttempts.toString());
  addTableRow(doc, 'Successful Logins', data.successfulLogins.toString());
  addTableRow(doc, 'Failed Attempts', data.failedAttempts.toString());
  addTableRow(doc, 'Unique Users', data.uniqueUsers.toString());
  doc.moveDown();


  addSectionHeader(doc, 'Security Metrics');
  addTableRow(doc, 'Suspicious Activities', data.securityMetrics.suspiciousActivities.toString());
  addTableRow(doc, 'Account Lockouts', data.securityMetrics.accountLockouts.toString());
  addTableRow(doc, 'Password Resets', data.securityMetrics.passwordResets.toString());
  addTableRow(doc, 'After Hours Access', data.securityMetrics.afterHoursAccess.toString());
  doc.moveDown();


  addSectionHeader(doc, 'User Activity Summary');
  data.userActivity.forEach(user => {
    doc.fontSize(11).fillColor('#2c3e50').text(user.user, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Total Logins', user.totalLogins.toString(), 20);
    addTableRow(doc, '  Failed Attempts', user.failedAttempts.toString(), 20);
    addTableRow(doc, '  Last Login', user.lastLogin, 20);
    addTableRow(doc, '  Avg Session Duration', user.avgSessionDuration, 20);
    addTableRow(doc, '  Unique IPs', user.uniqueIPs.toString(), 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'System Module Access');
  data.systemAccess.forEach(module => {
    doc.fontSize(11).fillColor('#2c3e50').text(module.module);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Access Count', module.accessCount.toString(), 20);
    addTableRow(doc, '  Unique Users', module.uniqueUsers.toString(), 20);
    doc.moveDown(0.5);
  });

  addSectionHeader(doc, 'Security Incidents');
  data.securityIncidents.forEach(incident => {
    doc.fontSize(11).fillColor('#e74c3c').text(incident.type);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  User', incident.user, 20);
    addTableRow(doc, '  Timestamp', incident.timestamp, 20);
    addTableRow(doc, '  Action Taken', incident.action, 20);
    doc.moveDown(0.5);
  });

  addSectionHeader(doc, 'Security Recommendations');
  data.recommendations.forEach(rec => {
    doc.fontSize(10).fillColor('#27ae60').text(`• ${rec}`);
  });
};


const generateCompliancePDF = (doc, data) => {
  doc.fontSize(18).fillColor('#1a365d').text('Compliance Audit Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).fillColor('#000000');
  addTableRow(doc, 'Audit Period', data.auditPeriod);
  addTableRow(doc, 'Overall Compliance Score', data.overallComplianceScore);
  addTableRow(doc, 'Auditor', data.auditor);
  addTableRow(doc, 'Total Checks', data.totalChecks.toString());
  addTableRow(doc, 'Passed', data.passed.toString());
  addTableRow(doc, 'Failed', data.failed.toString());
  addTableRow(doc, 'Next Audit Date', data.nextAuditDate);
  doc.moveDown();

  addSectionHeader(doc, 'Compliance Areas Assessment');
  data.complianceAreas.forEach(area => {
    doc.fontSize(11).fillColor('#2c3e50').text(`${area.area} - ${area.status}`, { underline: true });
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Score', area.score, 20);
    addTableRow(doc, '  Findings', area.findings.toString(), 20);
    addTableRow(doc, '  Description', area.description, 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Compliance Violations');
  data.violations.forEach(violation => {
    doc.fontSize(11).fillColor('#e74c3c').text(`${violation.severity} Severity - ${violation.area}`);
    doc.fontSize(10).fillColor('#000000');
    addTableRow(doc, '  Issue', violation.issue, 20);
    addTableRow(doc, '  Deadline', violation.deadline, 20);
    addTableRow(doc, '  Responsible', violation.responsible, 20);
    doc.moveDown(0.5);
  });


  addSectionHeader(doc, 'Training Compliance Status');
  addTableRow(doc, 'Mandatory Trainings Completed', data.trainingCompliance.mandatoryTrainingsCompleted);
  addTableRow(doc, 'Certification Status', data.trainingCompliance.certificationStatus);
  addTableRow(doc, 'Upcoming Renewals', data.trainingCompliance.upcomingRenewals.toString());
  addTableRow(doc, 'Overdue Trainings', data.trainingCompliance.overdueTrainings.toString());
  doc.moveDown();


  addSectionHeader(doc, 'Compliance Recommendations');
  data.recommendations.forEach(rec => {
    doc.fontSize(10).fillColor('#27ae60').text(`• ${rec}`);
  });
};


export const generateLivePerformanceReport = async (req, res) => {
  try {

    const performanceData = await generatePerformanceReviewData();
    

    const admin = await prisma.admin.findFirst(); 
    
    const newReport = await prisma.reporting.create({
      data: {
        id: `perf-live-${Date.now()}`,
        name: `Live Performance Review - ${new Date().toLocaleDateString()}`,
        type: 'performance',
        date: new Date(),
        status: 'completed',
        size: '3.2 MB',
        downloads: 0,
        generatedDate: new Date(),
        content: JSON.stringify(performanceData),
        adminId: admin.id
      }
    });

    res.status(200).json({
      message: 'Live performance report generated successfully',
      reportId: newReport.id,
      data: performanceData
    });

  } catch (error) {
    console.error('Error generating live performance report:', error);
    res.status(500).json({ error: 'Failed to generate live performance report' });
  }
};


export const getPerformanceAnalytics = async (req, res) => {
  try {
    const performanceData = await generatePerformanceReviewData();
    res.status(200).json(performanceData);
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    res.status(500).json({ error: 'Failed to fetch performance analytics' });
  }
};


export const downloadReportsPDF = async (req, res) => {
  const { reportId } = req.params;
  try {
    let report = await prisma.reporting.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }


    if (reportId === 'live-performance' || (report.type === 'performance' && req.query.live === 'true')) {
      const livePerformanceData = await generatePerformanceReviewData();
      report = {
        ...report,
        content: JSON.stringify(livePerformanceData),
        name: `Live Performance Review - ${new Date().toLocaleDateString()}`
      };
    }

    let reportData;
    try {
      if (typeof report.content === 'string') {
        try {
          reportData = JSON.parse(report.content);
        } catch (jsonError) {
          reportData = null;
        }
      } else {
        reportData = null;
      }
    } catch (parseError) {
      console.error('Error parsing JSON content:', parseError);
      return res.status(500).json({ error: 'Invalid report content' });
    }


    const doc = new PDFDocument({ margin: 50 });


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${report.name.replace(/\s+/g, '_')}_${reportId}.pdf`);
    

    doc.pipe(res);


    doc.fontSize(12).fillColor('#7f8c8d').text('HR Core Management System', { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text(`Report ID: ${reportId}`, { align: 'right' });
    doc.moveDown(2);


    if (reportData) {

      switch (report.type) {
        case 'attendance':
          generateAttendancePDF(doc, reportData);
          break;
        case 'leave':
          generateLeaveBalancePDF(doc, reportData);
          break;
        case 'payroll':
          generatePayrollPDF(doc, reportData);
          break;
        case 'access':
          generateAccessLogsPDF(doc, reportData);
          break;
        case 'performance':
          generatePerformancePDF(doc, reportData);
          break;
        case 'compliance':
          generateCompliancePDF(doc, reportData);
          break;
        default:
          doc.fontSize(16).text('Report type not supported for detailed PDF generation.');
          doc.text(`Report Name: ${report.name}`);
          doc.text(`Type: ${report.type}`);
          doc.text(`Generated: ${report.generatedDate}`);
      }
    } else {
    
      doc.fontSize(16).text('Report Content:', { underline: true });
      doc.fontSize(12).text(report.content);
    }

  
    doc.fontSize(8).fillColor('#95a5a6');
    doc.text('This report is confidential and intended for authorized personnel only.', 
      50, doc.page.height - 50, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
