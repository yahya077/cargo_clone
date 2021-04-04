const mongoose = require('mongoose');

const ShipmentActivitySchema = new mongoose.Schema({
    shipment: {
        type:mongoose.Schema.ObjectId,
        ref:'Shipment',
        required:true
    },
    status: {
        type:String,
        enum: ['paketlendi', 'aktarmada', 'dagitimSubesinde', 'kuryede', 'teslimEdildi'],
        default: 'paketlendi'
    }
}, {collection:'shipmentActivities', timestamps:true});

module.exports = mongoose.model('ShipmentActivity', ShipmentActivitySchema);