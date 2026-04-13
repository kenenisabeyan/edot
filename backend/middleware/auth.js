import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

// Protect routes - verify token
export const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Avoid passing password
        delete user.password;
        
        req.user = user;

        // Flag blocked accounts for frontend/route checks
        req.user.isBlocked = req.user.status === 'blocked';
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Guard blocked users from learning content endpoints
export const checkNotBlocked = async (req, res, next) => {
    if (req.user && req.user.status === 'blocked') {
        return res.status(403).json({ success: false, message: 'Access denied: account suspended' });
    }
    next();
};

// Guard student video/library access by active enrollment status
export const guardActiveEnrollment = async (req, res, next) => {
    const courseId = req.params.courseId || req.body.courseId || req.query.courseId;

    if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID is required for access control' });
    }

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'User authentication required' });
    }

    if (req.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Only students can access this content' });
    }

    const enrollment = await prisma.enrollment.findFirst({
        where: { studentId: req.user.id, courseId }
    });

    if (!enrollment || enrollment.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Access denied: course not fully approved or enrollment inactive' });
    }

    next();
};