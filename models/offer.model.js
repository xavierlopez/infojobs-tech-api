const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    id: { type: String },
    title: { type: String, required: true },
    requirementMin:{ type: String},
    city: {},
        
    description: { type:String},
    stack:{type:String, enum: ['front', 'back', 'full', 'mobile', 'devops','data']},

},{
    timestamps: true
});

module.exports = mongoose.model('offer', offerSchema);