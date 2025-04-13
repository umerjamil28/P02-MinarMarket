const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    search_query: {
        type: String,
        required: true,
        trim: true,
    },

    time: {
        type: Date,
        default: Date.now,
    }
});

// Export the model
module.exports = mongoose.model('Search', searchSchema);
