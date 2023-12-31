const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    Mail: {
        type: String,
    },
    Mobile: {
        type: String,
    },
    Text: {
        type: String,
    },
});

const userFeedback = mongoose.model('feedbacks', feedbackSchema);

module.exports = userFeedback;
