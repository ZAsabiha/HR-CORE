import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
      },
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
}
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  console.log(" Requested ID:", id);
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { department: true }
    });
    console.log(" Prisma result:", employee);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error(" Error fetching employee:", err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      name, email, department, position,
      salary, status, joinDate, dateOfBirth, experience
    } = req.body;
    
    // Check for existing employee
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: email },
    });

    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists.' });
    }

    // Create new employee
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        department: { connect: { name: department } }, 
        position,
        salary: parseFloat(salary),
        status,
        joinDate: new Date(joinDate),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, //  use DOB 
        experience: parseInt(experience),
      }
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Failed to create employee:', err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};


export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({
      where: { id: Number(id) }
    });
    res.json({ message: `Employee ${id} deleted successfully.` });
  } catch (err) {
    console.error(" Error deleting employee:", err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    name, email, department, position,
    salary, status, joinDate, dateOfBirth, experience
  } = req.body;

  try {
    // 1) Ensure employee exists
    const existing = await prisma.employee.findUnique({
      where: { id: Number(id) }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // 2) Build a data object only with provided fields
    const data = {};

    if (typeof name !== 'undefined') data.name = name;
    if (typeof email !== 'undefined') data.email = email;
    if (typeof position !== 'undefined') data.position = position;
    if (typeof status !== 'undefined') data.status = status;
    if (typeof experience !== 'undefined') data.experience = parseInt(experience);

    if (typeof salary !== 'undefined') data.salary = parseFloat(salary);
    if (typeof joinDate !== 'undefined') data.joinDate = new Date(joinDate);

    // dateOfBirth is optional; 
    if (typeof dateOfBirth !== 'undefined') {
      data.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }

    // Department connect only if provided (and name is unique in your schema)
    if (typeof department !== 'undefined' && department) {
      data.department = { connect: { name: department } };
      // If you prefer connecting by ID: data.department = { connect: { id: Number(departmentId) } };
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data,
      include: { department: true }
    });

    res.json(updatedEmployee);
  } catch (err) {
    console.error('➡️ Failed to update employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};



export const searchEmployees = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search query parameter is required.' });
    }

    const idSearch = Number(name);
    const idFilter = !isNaN(idSearch) ? idSearch : undefined;

    // Check if name can be parsed as a date
    const dateFilter = !isNaN(Date.parse(name)) ? new Date(name) : undefined;

    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          { name: { contains: name } },
          { email: { contains: name } },
          { position: { contains: name } },
          ...(idFilter !== undefined ? [{ id: idFilter }] : []),
          ...(dateFilter ? [{ joinDate: dateFilter }] : []),
        ],
      },
      include: { department: true },
    });

    res.json(employees);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
