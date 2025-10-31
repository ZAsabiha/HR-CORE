// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// export const login = async (req, res) => {
//   try {
//     let { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Please fill in all fields.' });
//     }

//     username = String(username).trim();
//     const plain = String(password);

    
//     const admin = await prisma.admin.findFirst({
//       where: { email: username },
//       select: { id: true, name: true, email: true, password: true }
//     });

//     if (admin) {
//       const ok = await bcrypt.compare(plain, admin.password);
//       if (ok) {
//         req.session.user = {
//           id: admin.id,
//           name: admin.name,
//           email: admin.email,
//           role: 'ADMIN'
//         };
//         return res.json({ message: 'Login successful', user: req.session.user });
//       }
//     }

    
//     const employee = await prisma.employee.findFirst({
//       where: { email: username },
//       select: {
//         id: true, name: true, email: true, password: true, role: true,
//         departmentId: true, position: true
//       }
//     });

//     if (employee) {
//       if (!employee.password) {
//         return res.status(401).json({
//           message: 'Account not activated. Please contact administrator.'
//         });
//       }

//       const ok = await bcrypt.compare(plain, employee.password);
//       if (ok) {
//         req.session.user = {
//           id: employee.id,
//           name: employee.name,
//           email: employee.email,
//           role: employee.role,
//           departmentId: employee.departmentId ?? null,
//           position: employee.position ?? null
//         };
//         return res.json({ message: 'Login successful', user: req.session.user });
//       }
//     }

    
//     return res.status(401).json({ message: 'Invalid credentials' });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ message: 'Login failed' });
//   }
// };

// export const logout = (req, res) => {
//   try {
//     req.session.destroy(err => {
//       if (err) {
//         console.error('Logout error:', err);
//         return res.status(500).json({ message: 'Logout failed' });
//       }
//       res.clearCookie('connect.sid'); 
//       return res.json({ message: 'Logged out' });
//     });
//   } catch (err) {
//     console.error('Logout error:', err);
//     return res.status(500).json({ message: 'Logout failed' });
//   }
// };

// export const status = (req, res) => {
//   if (req.session?.user) {
//     return res.json({
//       loggedIn: true,
//       user: req.session.user
//     });
//   }
//   return res.json({ loggedIn: false });
// };


// controllers/authController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const login = async (req, res, next) => {
  try {
    let { username, password, rememberMe } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const email = String(username).trim().toLowerCase();
    const plain = String(password);

    // 1) Try admin
    const admin = await prisma.admin.findFirst({
      where: { email }, // no mode
      select: { id: true, name: true, email: true, password: true }
    });

    if (admin && await bcrypt.compare(plain, admin.password)) {
      const user = { id: admin.id, name: admin.name, email: admin.email, role: 'ADMIN' };
      return req.session.regenerate(err => {
        if (err) return next(err);
        req.session.user = user;
        if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        req.session.save(err2 => err2 ? next(err2) : res.json({ message: 'Login successful', user }));
      });
    }

    // 2) Try employee
    const employee = await prisma.employee.findFirst({
      where: { email }, // no mode
      select: { id: true, name: true, email: true, password: true, role: true, departmentId: true, position: true }
    });

    if (employee) {
      if (!employee.password) {
        return res.status(401).json({ message: 'Account not activated. Please contact administrator.' });
      }
      if (await bcrypt.compare(plain, employee.password)) {
        const user = {
          id: employee.id, name: employee.name, email: employee.email,
          role: employee.role ?? 'EMPLOYEE',
          departmentId: employee.departmentId ?? null,
          position: employee.position ?? null
        };
        return req.session.regenerate(err => {
          if (err) return next(err);
          req.session.user = user;
          if (rememberMe) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
          req.session.save(err2 => err2 ? next(err2) : res.json({ message: 'Login successful', user }));
        });
      }
    }

    // small delay to reduce timing hints
    setTimeout(() => res.status(401).json({ message: 'Invalid credentials' }), 150);
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};


export const status = (req, res) => {
  const user = req.session?.user || null;
  res.json({ loggedIn: !!user, user });
};

export const logout = (req, res, next) => {
  if (!req.session) return res.sendStatus(204);
  req.session.destroy(err => {
    if (err) return next(err);
    // Make sure the name matches your session cookie (default is 'connect.sid' unless you changed it)
    res.clearCookie('connect.sid');
    res.sendStatus(204);
  });
};
