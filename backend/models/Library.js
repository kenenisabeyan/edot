const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the resource']
    },
    author: {
        type: String,
        required: [true, 'Please specify the author or publisher']
    },
    category: {
        type: String,
        required: true,
        default: 'General'
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);
