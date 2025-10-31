
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all performance reviews with filtering, sorting, and pagination
export const getAllReviews = async (req, res) => {
  try {
    const {
      search = '',
      department = '',
      rating = '',
      reviewPeriod = '',
      startDate = '',
      endDate = '',
      sortBy = 'reviewDate',
      sortOrder = 'desc',
      page = 1,
      limit = 6
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // --- Build where clause (UPDATED: add id/employeeId numeric search) ---
    const s = search?.trim() ?? '';
    const n = Number(s);
    const isNum = s !== '' && !Number.isNaN(n);

const searchConditions = s
  ? [
      {
        employee: {
          is: {   // relation to employee
            name: {
              contains: s   
            }
          }
        }
      },
      {
        feedback: {
          contains: s   
        }
      },
      ...(isNum ? [{ id: n }] : []),
      ...(isNum ? [{ employeeId: n }] : [])
    ]
  : [];



    const where = {
      AND: [
        ...(searchConditions.length ? [{ OR: searchConditions }] : []),
        ...(department
          ? [{ employee: { department: { name: department } } }]
          : []),
        ...(rating
          ? [
              {
                rating: {
                  gte: parseFloat(rating),
                  lt: parseFloat(rating) + 1
                }
              }
            ]
          : []),
        ...(reviewPeriod ? [{ reviewPeriod }] : []),
        ...(startDate || endDate
          ? [
              {
                reviewDate: {
                  ...(startDate && { gte: new Date(startDate) }),
                  ...(endDate && { lte: new Date(endDate) })
                }
              }
            ]
          : [])
      ]
    };

    // Build orderBy clause
    let orderBy = {};
    if (sortBy === 'employee.name') {
      orderBy = { employee: { name: sortOrder } };
    } else if (sortBy === 'department') {
      orderBy = { employee: { department: { name: sortOrder } } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true
          }
        }
      },
      orderBy,
      skip,
      take
    });

    const totalCount = await prisma.performanceReview.count({ where });
    const totalPages = Math.ceil(totalCount / take);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};


// Get single performance review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.performanceReview.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Create new performance review
export const createReview = async (req, res) => {
  try {
    const { employeeId, rating, feedback, reviewDate, reviewPeriod, goals } = req.body;

    // Validation
    if (!employeeId || !rating || !feedback || !reviewDate || !reviewPeriod) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, rating, feedback, reviewDate, reviewPeriod' 
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      include: { department: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const review = await prisma.performanceReview.create({
      data: {
        employeeId: parseInt(employeeId),
        rating: parseFloat(rating),
        feedback,
        reviewDate: new Date(reviewDate),
        reviewPeriod,
        goals: goals || 'No specific goals set'
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update performance review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, rating, feedback, reviewDate, reviewPeriod, goals } = req.body;

    // Check if review exists
    const existingReview = await prisma.performanceReview.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Validation
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
    }

    const updatedReview = await prisma.performanceReview.update({
      where: { id: parseInt(id) },
      data: {
        ...(employeeId && { employeeId: parseInt(employeeId) }),
        ...(rating !== undefined && { rating: parseFloat(rating) }),
        ...(feedback && { feedback }),
        ...(reviewDate && { reviewDate: new Date(reviewDate) }),
        ...(reviewPeriod && { reviewPeriod }),
        ...(goals !== undefined && { goals })
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    // UPDATED: wrap to match frontend expectation
    res.json({ review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete performance review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.performanceReview.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.performanceReview.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// Bulk delete performance reviews
export const bulkDeleteReviews = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty ids array' });
    }

    const reviewIds = ids.map(id => parseInt(id));

    const deleteResult = await prisma.performanceReview.deleteMany({
      where: {
        id: {
          in: reviewIds
        }
      }
    });

    res.json({ 
      message: `${deleteResult.count} reviews deleted successfully`,
      deletedCount: deleteResult.count
    });
  } catch (error) {
    console.error('Error bulk deleting reviews:', error);
    res.status(500).json({ error: 'Failed to delete reviews' });
  }
};

// Get performance analytics
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;

    // Build where clause for analytics
    const where = {
      ...((startDate || endDate) && {
        reviewDate: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) })
        }
      }),
      ...(department && {
        employee: {
          department: {
            name: department
          }
        }
      })
    };

    // Get all reviews with employee and department data
    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;

    // Department statistics
    const departmentStats = reviews.reduce((acc, review) => {
      const deptName = review.employee.department.name;
      if (!acc[deptName]) {
        acc[deptName] = { count: 0, totalRating: 0, avgRating: 0 };
      }
      acc[deptName].count++;
      acc[deptName].totalRating += review.rating;
      acc[deptName].avgRating = (acc[deptName].totalRating / acc[deptName].count).toFixed(1);
      return acc;
    }, {});

    // Rating distribution
    const ratingDistribution = reviews.reduce((acc, review) => {
      const ratingFloor = Math.floor(review.rating);
      acc[ratingFloor] = (acc[ratingFloor] || 0) + 1;
      return acc;
    }, {});

    // Performance categories
    const performanceCategories = {
      excellent: reviews.filter(r => r.rating >= 4.5).length,
      good: reviews.filter(r => r.rating >= 4.0 && r.rating < 4.5).length,
      satisfactory: reviews.filter(r => r.rating >= 3.0 && r.rating < 4.0).length,
      needsImprovement: reviews.filter(r => r.rating < 3.0).length
    };

    // Employee trends
    const employeeTrends = reviews.reduce((acc, review) => {
      const employeeName = review.employee.name;
      if (!acc[employeeName]) {
        acc[employeeName] = [];
      }
      acc[employeeName].push({
        period: review.reviewPeriod,
        rating: review.rating,
        date: review.reviewDate
      });
      return acc;
    }, {});

    // Sort employee trends by date
    Object.keys(employeeTrends).forEach(employeeName => {
      employeeTrends[employeeName].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    res.json({
      totalReviews,
      averageRating: parseFloat(averageRating),
      departmentCount: Object.keys(departmentStats).length,
      highPerformers: performanceCategories.excellent,
      departmentStats,
      ratingDistribution,
      performanceCategories,
      employeeTrends
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Get reviews by employee ID
export const getReviewsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      include: { department: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const reviews = await prisma.performanceReview.findMany({
      where: { employeeId: parseInt(employeeId) },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      },
      orderBy: { reviewDate: 'desc' },
      skip,
      take
    });

    const totalCount = await prisma.performanceReview.count({
      where: { employeeId: parseInt(employeeId) }
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      reviews,
      employee,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching employee reviews:', error);
    res.status(500).json({ error: 'Failed to fetch employee reviews' });
  }
};

// Export reviews to CSV
export const exportReviews = async (req, res) => {
  try {
    const { ids } = req.query;
    let reviewIds = [];

    if (ids) {
      reviewIds = ids.split(',').map(id => parseInt(id));
    }

    const where = reviewIds.length > 0 ? { id: { in: reviewIds } } : {};

    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true
          }
        }
      },
      orderBy: { reviewDate: 'desc' }
    });

    // Generate CSV content
    const csvHeader = 'ID,Employee Name,Department,Position,Rating,Review Period,Review Date,Feedback,Goals,Created At\n';
    const csvRows = reviews.map(review => {
      const row = [
        review.id,
        `"${review.employee.name}"`,
        `"${review.employee.department.name}"`,
        `"${review.employee.position || 'N/A'}"`,
        review.rating,
        `"${review.reviewPeriod}"`,
        review.reviewDate.toISOString().split('T')[0],
        `"${review.feedback.replace(/"/g, '""')}"`,
        `"${review.goals.replace(/"/g, '""')}"`,
        review.createdAt.toISOString().split('T')[0]
      ];
      return row.join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="performance_reviews.csv"');
    res.send(csvContent);

  } catch (error) {
    console.error('Error exporting reviews:', error);
    res.status(500).json({ error: 'Failed to export reviews' });
  }
};
