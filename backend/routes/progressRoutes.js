const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProgressLog = require('../models/ProgressLog');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');

// @route   POST /api/progress/ping
// @desc    Heartbeat ping to track video watch time in 30s blocks
// @access  Private
router.post('/ping', protect, async (req, res) => {
    try {
        const { courseId, lessonId, currentSecond } = req.body;
        const userId = req.user.id;

        if (!courseId || !lessonId || currentSecond === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required progress data' });
        }

        // 1. Fetch the Course to find the target lesson duration
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lesson = course.lessons.find(l => l.lesson_id.toString() === lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found in this course' });
        }

        // Duration is typically in minutes, convert to seconds
        const requiredDurationSeconds = (lesson.duration || 1) * 60;
        
        // Let's assume each heartbeat segment represents 30 seconds.
        const segmentIndex = Math.floor(currentSecond / 30) * 30;

        // 2. Find or create the ProgressLog for this specific lesson
        let log = await ProgressLog.findOne({ user_id: userId, lesson_id: lessonId });
        
        if (!log) {
            log = new ProgressLog({
                user_id: userId,
                course_id: courseId,
                lesson_id: lessonId,
                video_segments: [segmentIndex],
                is_video_complete: false
            });
        } else {
            // Only add the segment if they haven't already watched this 30s chunk
            if (!log.video_segments.includes(segmentIndex)) {
                log.video_segments.push(segmentIndex);
            }
        }

        // 3. Strict Verification: Determine if total unique segments watched meets the required duration
        // (Assuming 30s per segment)
        const totalSecondsWatched = log.video_segments.length * 30;
        
        // We give an 85% leniency buffer in case of network drops or UI fast-forwards
        if (totalSecondsWatched >= (requiredDurationSeconds * 0.85)) {
            log.is_video_complete = true;
        }

        await log.save();

        res.status(200).json({
            success: true,
            message: 'Heartbeat logged',
            data: {
                isComplete: log.is_video_complete,
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
router.post('/certificate', protect, async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // 1. Fetch ALL progress logs for this user + course
        const userLogs = await ProgressLog.find({ user_id: userId, course_id: courseId });

        // 2. Strict Gateway Validation
        // Iterate through every required lesson in the course
        const missingLessons = [];
        
        for (const lesson of course.lessons) {
            const lessonLog = userLogs.find(log => log.lesson_id.toString() === lesson.lesson_id.toString());
            
            if (!lessonLog) {
                missingLessons.push({ lesson: lesson.title, reason: 'Not started' });
                continue;
            }

            if (!lessonLog.is_video_complete) {
                missingLessons.push({ lesson: lesson.title, reason: 'Video time requirement not met' });
            }

            // If the schema mandated exams, we would check lessonLog.exam_scores here
            // Note: Extended exam logic can be injected here based on isExamRequired
        }

        if (missingLessons.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Certificate Generation Denied: Strict Learning Gates not met.',
                blocked_by: missingLessons
            });
        }

        // 3. Validation passed! Ensure certificate doesn't already exist to prevent duplicates
        let certificate = await Certificate.findOne({ user_id: userId, course_id: courseId });
        
        if (!certificate) {
            // Create Official Certificate Record
            certificate = await Certificate.create({
                certificate_id: `EDOT-${userId.toString().slice(-4)}-${courseId.toString().slice(-4)}-${Date.now().toString().slice(-4)}`,
                user_id: userId,
                course_id: courseId,
                issue_date: new Date(),
                verified_hash: 'placeholder_blockchain_hash_or_jwt' // Future-proofing
            });
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

module.exports = router;
