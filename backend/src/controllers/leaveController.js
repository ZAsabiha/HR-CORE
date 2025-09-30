import { PrismaClient } from '@prisma/client';
import path from 'path';
const prisma = new PrismaClient();

export const leaveController = {
  // Get all leave requests
  async getAllLeaveRequests(req, res) {
    try {
      const leaveRequests = await prisma.leaveRequest.findMany({
        include: {
          employee: {
            select: {
              id: true,
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
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format the data to match frontend expectations
      const formattedRequests = leaveRequests.map(request => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        return {
          id: request.id,
          name: request.employee.name,
          duration,
          startDate: startDate.toLocaleDateString('en-GB'),
          endDate: endDate.toLocaleDateString('en-GB'),
          resumptionDate: request.resumptionDate ? new Date(request.resumptionDate).toLocaleDateString('en-GB') : null,
          type: request.leaveType,
          status: request.status,
          reason: request.reason,
          approvedBy: request.approvedBy,
          approvedDate: request.approvedDate ? new Date(request.approvedDate).toLocaleDateString('en-GB') : null,
          documentPath: request.documentPath,
          createdAt: request.createdAt,
          employee: request.employee
        };
      });

      res.json(formattedRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
  },

  // Get leave requests by employee ID
  async getEmployeeLeaveRequests(req, res) {
    try {
      const { employeeId } = req.params;
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: {
          employeeId: parseInt(employeeId)
        },
        include: {
          employee: {
            select: {
              name: true,
              email: true,
              position: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(leaveRequests);
    } catch (error) {
      console.error('Error fetching employee leave requests:', error);
      res.status(500).json({ error: 'Failed to fetch employee leave requests' });
    }
  },

  // Create new leave request
  async createLeaveRequest(req, res) {
    try {
      const {
        employeeId,
        leaveType,
        startDate,
        endDate,
        resumptionDate,
        reason
      } = req.body;

      // Validate required fields
      if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['employeeId', 'leaveType', 'startDate', 'endDate', 'reason']
        });
      }

      // Validate employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      // Check for overlapping leave requests
      const overlappingRequest = await prisma.leaveRequest.findFirst({
        where: {
          employeeId: parseInt(employeeId),
          status: {
            in: ['Approved', 'Pending']
          },
          OR: [
            {
              AND: [
                { startDate: { lte: start } },
                { endDate: { gte: start } }
              ]
            },
            {
              AND: [
                { startDate: { lte: end } },
                { endDate: { gte: end } }
              ]
            },
            {
              AND: [
                { startDate: { gte: start } },
                { endDate: { lte: end } }
              ]
            }
          ]
        }
      });

      if (overlappingRequest) {
        return res.status(400).json({ 
          error: 'You already have a leave request for this date range' 
        });
      }

      // Create leave request
      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employeeId: parseInt(employeeId),
          leaveType,
          startDate: start,
          endDate: end,
          resumptionDate: resumptionDate ? new Date(resumptionDate) : null,
          reason,
          status: 'Pending',
          documentPath: req.file ? req.file.path : null,
          createdAt: new Date(),
          updatedAt: new Date()
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

      res.status(201).json({
        message: 'Leave request submitted successfully',
        data: leaveRequest
      });

    } catch (error) {
      console.error('Error creating leave request:', error);
      res.status(500).json({ error: 'Failed to create leave request' });
    }
  },

// Update leave request status
async updateLeaveStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!['Approved', 'Declined', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const existingRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const updatedRequest = await prisma.leaveRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        approvedBy: status !== 'Pending' ? approvedBy : null,
        approvedDate: status !== 'Pending' ? new Date() : null,
        updatedAt: new Date()
      },
      include: {
        employee: {
          select: {
            id: true,   
            name: true,
            email: true,
            position: true
          }
        }
      }
    });

    // 👇 Create notification after successful update
    await prisma.notification.create({
      data: {
        employeeId: updatedRequest.employeeId, // link to employee
        message: `Your leave request from ${updatedRequest.startDate.toDateString()} to ${updatedRequest.endDate.toDateString()} was ${status}.`,
      }
    });

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ error: 'Failed to update leave request' });
  }
},


  // Get leave request by ID
// Update this method in your leaveController.js

async getLeaveRequestById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          select: {
            id: true,
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
      }
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Check permissions
    const hasPermission = userRole === 'ADMIN' || 
                         userRole === 'TEAM_LEAD' || 
                         leaveRequest.employeeId === userId;

    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate duration
    const startDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const formattedRequest = {
      id: leaveRequest.id,
      employee: leaveRequest.employee,
      leaveType: leaveRequest.leaveType,
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: endDate.toLocaleDateString('en-GB'),
      resumptionDate: leaveRequest.resumptionDate ? 
                      new Date(leaveRequest.resumptionDate).toLocaleDateString('en-GB') : null,
      duration: `${duration} day${duration > 1 ? 's' : ''}`,
      reason: leaveRequest.reason,
      status: leaveRequest.status,
      approvedBy: leaveRequest.approvedBy,
      approvedDate: leaveRequest.approvedDate ? 
                    new Date(leaveRequest.approvedDate).toLocaleDateString('en-GB') : null,
      submittedDate: new Date(leaveRequest.createdAt).toLocaleDateString('en-GB'),
      documentPath: leaveRequest.documentPath,
      documentName: leaveRequest.documentPath ? 
                   path.basename(leaveRequest.documentPath) : null,
      documentUrl: leaveRequest.documentPath ? 
                  `/api/leave/document/${leaveRequest.id}/${path.basename(leaveRequest.documentPath)}` : null
    };

    res.json(formattedRequest);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
},

  // Delete leave request
  async deleteLeaveRequest(req, res) {
    try {
      const { id } = req.params;
      
      const existingRequest = await prisma.leaveRequest.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRequest) {
        return res.status(404).json({ error: 'Leave request not found' });
      }

      await prisma.leaveRequest.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Leave request deleted successfully' });
    } catch (error) {
      console.error('Error deleting leave request:', error);
      res.status(500).json({ error: 'Failed to delete leave request' });
    }
  },

  // Get leave statistics
  async getLeaveStats(req, res) {
    try {
      const totalRequests = await prisma.leaveRequest.count();
      const pendingRequests = await prisma.leaveRequest.count({
        where: { status: 'Pending' }
      });
      const approvedRequests = await prisma.leaveRequest.count({
        where: { status: 'Approved' }
      });
      const declinedRequests = await prisma.leaveRequest.count({
        where: { status: 'Declined' }
      });

      // Get most common leave type
      const leaveTypes = await prisma.leaveRequest.groupBy({
        by: ['leaveType'],
        _count: {
          leaveType: true
        },
        orderBy: {
          _count: {
            leaveType: 'desc'
          }
        }
      });

      const mostCommonType = leaveTypes.length > 0 ? leaveTypes[0].leaveType : 'None';

      res.json({
        totalRequests,
        pendingRequests,
        approvedRequests,
        declinedRequests,
        mostCommonType
      });
    } catch (error) {
      console.error('Error fetching leave statistics:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  },

  // Get leave requests with advanced filtering
  async getFilteredLeaveRequests(req, res) {
    try {
      const { 
        status, 
        leaveType, 
        startDate, 
        endDate, 
        employeeId,
        departmentId 
      } = req.query;

      let whereClause = {};

      if (status) whereClause.status = status;
      if (leaveType) whereClause.leaveType = leaveType;
      if (employeeId) whereClause.employeeId = parseInt(employeeId);
      if (startDate && endDate) {
        whereClause.startDate = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      const leaveRequests = await prisma.leaveRequest.findMany({
        where: whereClause,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
              department: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            where: departmentId ? {
              departmentId: parseInt(departmentId)
            } : undefined
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(leaveRequests);
    } catch (error) {
      console.error('Error fetching filtered leave requests:', error);
      res.status(500).json({ error: 'Failed to fetch filtered leave requests' });
    }
  },

  // Get employee leave balance/history
  async getEmployeeLeaveBalance(req, res) {
    try {
      const { employeeId } = req.params;
      const year = req.query.year || new Date().getFullYear();

      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Get all approved leave requests for the year
      const approvedLeaves = await prisma.leaveRequest.findMany({
        where: {
          employeeId: parseInt(employeeId),
          status: 'Approved',
          startDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${parseInt(year) + 1}-01-01`)
          }
        }
      });

      // Calculate leave days used by type
      const leaveUsage = approvedLeaves.reduce((acc, leave) => {
        const duration = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        acc[leave.leaveType] = (acc[leave.leaveType] || 0) + duration;
        return acc;
      }, {});

      // Standard leave allocations (this could come from a settings table)
      const allocations = {
        'Annual Leave': 25,
        'Sick Leave': 10,
        'Emergency Leave': 5,
        'Maternity Leave': 120,
        'Paternity Leave': 15
      };

      const leaveBalance = Object.keys(allocations).map(type => ({
        type,
        allocated: allocations[type],
        used: leaveUsage[type] || 0,
        remaining: allocations[type] - (leaveUsage[type] || 0)
      }));

      res.json({
        employee: {
          name: employee.name,
          position: employee.position
        },
        year: parseInt(year),
        leaveBalance,
        totalRequests: approvedLeaves.length,
        totalDaysUsed: Object.values(leaveUsage).reduce((sum, days) => sum + days, 0)
      });

    } catch (error) {
      console.error('Error fetching employee leave balance:', error);
      res.status(500).json({ error: 'Failed to fetch leave balance' });
    }
  }
};