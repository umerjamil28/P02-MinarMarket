// const mongoose = require('mongoose');

// const proposalSchema = new mongoose.Schema({
//     buyerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         required: true
//     },
//     sellerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user', 
//         required: true
//     },
//     requirementId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Buyer-Requirement',
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'rejected'],
//         default: 'pending'
//     },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
// });

// module.exports = mongoose.model('Proposal', proposalSchema);

const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer-Requirement',
        required: true
    },
    sellerListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductListing', 
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
