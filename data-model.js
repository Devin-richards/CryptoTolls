const mongoose = require('mongoose');

const debtTokenSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TollProject',
        required: true
    },
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    faceValue: {
        type: Number,
        required: true
    },
    maturityDate: {
        type: Date,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    // Add other relevant financial data here
});

const tollProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    // Add other relevant project data here
});

const DebtToken = mongoose.model('DebtToken', debtTokenSchema);
const TollProject = mongoose.model('TollProject', tollProjectSchema);

module.exports = {
    DebtToken,
    TollProject
};
