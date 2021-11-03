const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    concepts: {
        type: Array,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    inputDescription: {
        type: String,
        required: true,
    },
    inputExample: {
        type: Array,
        required: true,
    },
    outputDescription: {
        type: String,
        required: true,
    },
    outputExample: {
        type: Array,
        required: true,
    },
    testCases: {
        type: Array,
        required: true,
    },
    functionName: {
        type: String,
        required: true,
    },
    numberOfParams: {
        type: Number,
        required: true,
    },
    parameters: {
        type: Array,
    },
    maxExecutionInSec: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('question', QuestionSchema);