import prisma from '../../prisma/client.js';

// GET all goals with nested employee and department
export const getEmployeeGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        employee: {
          include: { department: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const now = new Date();

    const formattedGoals = goals.map(g => ({
      id: g.id,
      goalTitle: g.goalTitle,
      deadline: g.deadline,
      status: g.status !== 'Completed' && g.deadline && g.deadline < now ? 'Overdue' : g.status,
      progress: g.progress ?? 0,
      priority: g.priority ?? 'Medium',
      employee: {
        id: g.employeeId,
        name: g.employee?.name ?? null,
        department: {
          name: g.employee?.department?.name ?? null
        }
      },
      createdAt: g.createdAt,
      updatedAt: g.updatedAt
    }));

    res.json(formattedGoals);
  } catch (err) {
    console.error('Error fetching employee goals:', err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

// POST a new goal (ADMIN and TEAM_LEAD only)
export const createGoal = async (req, res) => {
  const { employeeId, goalTitle, deadline, status, progress, priority, description, name } = req.body;

  try {
    // Validate required fields
    if (!employeeId || !goalTitle || !deadline) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, goalTitle, and deadline are required' 
      });
    }

    const employeeIdInt = Number(employeeId);
    if (!Number.isInteger(employeeIdInt)) {
      return res.status(400).json({ error: 'Invalid employeeId format' });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeIdInt }
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const newGoal = await prisma.goal.create({
      data: {
        employeeId: employeeIdInt,
        // optional "name" and "description" exist in your schema; include if provided
        name: name ?? employee.name,
        goalTitle,
        description: description ?? `Achieve performance excellence in ${employee.position}`,
        deadline: new Date(deadline),
        status: status || 'Not Started',
        progress: Number(progress) || 0,
        priority: priority || 'Medium'
      },
      include: { employee: { include: { department: true } } }
    });

    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

// UPDATE a goal (ADMIN and TEAM_LEAD only)
export const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { goalTitle, deadline, status, progress, priority, description, name } = req.body;

  try {
    // Validate goal ID
    const goalId = Number(id);
    if (!Number.isInteger(goalId)) {
      return res.status(400).json({ error: 'Invalid goal ID format' });
    }

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId }
    });
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(goalTitle !== undefined && { goalTitle }),
        ...(description !== undefined && { description }),
        ...(name !== undefined && { name }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status !== undefined && { status }),
        ...(progress !== undefined && { progress: Number(progress) }),
        ...(priority !== undefined && { priority })
      },
      include: { employee: { include: { department: true } } }
    });

    res.json(updatedGoal);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Goal not found' });
    }
    console.error('Error updating goal:', err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

// DELETE a goal (ADMIN and TEAM_LEAD only)
export const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate goal ID
    const goalId = Number(id);
    if (!Number.isInteger(goalId)) {
      return res.status(400).json({ error: 'Invalid goal ID format' });
    }

    // Check if goal exists before attempting to delete
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId }
    });
    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({ where: { id: goalId } });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Goal not found' });
    }
    console.error('Error deleting goal:', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

// BULK actions (complete, delete, in-progress) - ADMIN and TEAM_LEAD only
export const bulkAction = async (req, res) => {
  const { goalIds, action } = req.body;

  try {
    // Validate input
    if (!Array.isArray(goalIds) || goalIds.length === 0) {
      return res.status(400).json({ error: 'No goals selected' });
    }

    if (!action || !['complete', 'delete', 'in-progress'].includes(action)) {
      return res.status(400).json({ error: 'Invalid or missing action. Valid actions: complete, delete, in-progress' });
    }

    const ids = goalIds.map(Number).filter(Number.isInteger);
    if (ids.length === 0) {
      return res.status(400).json({ error: 'Invalid goal IDs' });
    }

    // Check if goals exist before performing bulk action
    const existingGoals = await prisma.goal.findMany({
      where: { id: { in: ids } },
      select: { id: true }
    });
    
    if (existingGoals.length === 0) {
      return res.status(404).json({ error: 'No valid goals found for the provided IDs' });
    }

    const existingIds = existingGoals.map(g => g.id);
    let result;

    switch (action) {
      case 'complete':
        result = await prisma.goal.updateMany({
          where: { id: { in: existingIds } },
          data: { status: 'Completed', progress: 100 }
        });
        break;
      case 'delete':
        result = await prisma.goal.deleteMany({ where: { id: { in: existingIds } } });
        break;
      case 'in-progress':
        result = await prisma.goal.updateMany({
          where: { id: { in: existingIds } },
          data: { status: 'In Progress' }
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ 
      message: `Bulk ${action} completed successfully`, 
      affectedGoals: result.count,
      requestedGoals: ids.length,
      ...(existingIds.length !== ids.length && { 
        warning: `${ids.length - existingIds.length} goal(s) not found and were skipped` 
      })
    });
  } catch (err) {
    console.error('Error performing bulk action:', err);
    res.status(500).json({ error: 'Failed to perform bulk action' });
  }
};
