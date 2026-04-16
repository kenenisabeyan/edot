import express from 'express';
import { protect, guardActiveEnrollment, checkNotBlocked } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// @route   POST /api/progress/ping
// @desc    Heartbeat ping to track video watch time in 30s blocks
// @access  Private
router.post('/ping', protect, checkNotBlocked, guardActiveEnrollment, async (req, res) => {
    try {
        const { courseId, lessonId, currentSecond } = req.body;
        const userId = req.user.id;

        if (!courseId || !lessonId || currentSecond === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required progress data' });
        }

        // 1. Fetch the Course to find the target lesson duration
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        const lessons = course.lessons ? (Array.isArray(course.lessons) ? course.lessons : [course.lessons]) : [];
        const lesson = lessons.find(l => l.lesson_id === lessonId);
        
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found in this course' });
        }

        // Duration is typically in minutes, convert to seconds
        const requiredDurationSeconds = (lesson.duration || 1) * 60;
        
        // Let's assume each heartbeat segment represents 30 seconds.
        const segmentIndex = Math.floor(currentSecond / 30) * 30;

        // 2. Find or create the ProgressLog for this specific lesson
        let log = await prisma.progressLog.findFirst({ 
            where: { userId, lessonId }
        });
        
        let video_segments = [];
        let is_video_complete = false;

        if (!log) {
            video_segments = [segmentIndex];
        } else {
            video_segments = log.videoSegments ? (Array.isArray(log.videoSegments) ? log.videoSegments : [log.videoSegments]) : [];
            // Only add the segment if they haven't already watched this 30s chunk
            if (!video_segments.includes(segmentIndex)) {
                video_segments.push(segmentIndex);
            }
            is_video_complete = log.isVideoComplete;
        }

        // 3. Strict Verification: Determine if total unique segments watched meets the required duration
        // (Assuming 30s per segment)
        const totalSecondsWatched = video_segments.length * 30;
        
        // We give an 85% leniency buffer in case of network drops or UI fast-forwards
        if (totalSecondsWatched >= (requiredDurationSeconds * 0.85)) {
            is_video_complete = true;
        }

        if (log) {
            log = await prisma.progressLog.update({
                where: { id: log.id },
                data: { videoSegments: video_segments, isVideoComplete: is_video_complete }
            });
        } else {
            log = await prisma.progressLog.create({
                data: {
                    userId,
                    courseId,
                    lessonId,
                    videoSegments: video_segments,
                    isVideoComplete: is_video_complete
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Heartbeat logged',
            data: {
                isComplete: log.isVideoComplete,
                watchedSeconds: totalSecondsWatched,
                requiredSeconds: requiredDurationSeconds
            }
        });
    } catch (err) {
        console.error('Ping Error:', err);
        res.status(500).json({ success: false, message: 'Server error processing progress heartbeat' });
    }
});

// @route   POST /api/progress/certificate
// @desc    Strict validation gate to generate/verify a Certificate
// @access  Private
router.post('/certificate', protect, checkNotBlocked, guardActiveEnrollment, async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        const lessons = course.lessons ? (Array.isArray(course.lessons) ? course.lessons : [course.lessons]) : [];

        // 1. Fetch ALL progress logs for this user + course
        const userLogs = await prisma.progressLog.findMany({ 
            where: { userId, courseId }
        });

        // 2. Strict Gateway Validation
        // Iterate through every required lesson in the course
        const missingLessons = [];
        
        for (const lesson of lessons) {
            const lessonLog = userLogs.find(log => log.lessonId === lesson.lesson_id);
            
            if (!lessonLog) {
                missingLessons.push({ lesson: lesson.title, reason: 'Not started' });
                continue;
            }

            if (!lessonLog.isVideoComplete) {
                missingLessons.push({ lesson: lesson.title, reason: 'Video time requirement not met' });
            }

            // Extended exam logic would go here
        }

        if (missingLessons.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Certificate Generation Denied: Strict Learning Gates not met.',
                blocked_by: missingLessons
            });
        }

        // 3. Validation passed! Ensure certificate doesn't already exist to prevent duplicates
        let certificate = await prisma.certificate.findFirst({ 
            where: { userId, courseId } 
        });
        
        if (!certificate) {
            // Create Official Certificate Record
            certificate = await prisma.certificate.create({
                data: {
                    userId,
                    courseId,
                    issueDate: new Date(),
                    verificationHash: `EDOT-${userId.toString().slice(-4)}-${courseId.toString().slice(-4)}-${Date.now().toString().slice(-4)}` // Unique tracking hash
                }
            });
            
            // Note: Map to backward-compatible responses so frontend functions aren't broken initially
            certificate = {
                ...certificate,
                certificate_id: certificate.id,
                user_id: certificate.userId,
                course_id: certificate.courseId,
                verified_hash: certificate.verificationHash,
                issue_date: certificate.issueDate
            };
        }

        res.status(200).json({
            success: true,
            message: 'Validation Successful. Certificate officially logged.',
            data: certificate
        });

    } catch (err) {
        console.error('Certificate Validation Error:', err);
        res.status(500).json({ success: false, message: 'Server error validating certificate rules' });
    }
});

export default router;
