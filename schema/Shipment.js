const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    code: {
        type:String,
        required:true
    },
    from: {
        type:String,
        required:true
    },
    to: {
        type:String,
        required:true
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'shipments',
    timestamps: true
});

// Reverse populate with virtuals
ShipmentSchema.virtual('activities', {
    ref: 'ShipmentActivity',
    localField: '_id',
    foreignField: 'shipment',
    justOne: false
  });

module.exports = mongoose.model('Shipment', ShipmentSchema);