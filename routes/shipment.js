const router = require('express').Router();
const Shipment = require('../schema/Shipment');
const ShipmentActivity = require('../schema/ShipmentActivity');

router.get('/:code', async (req, res, next) => {
    var data = await Shipment.find({code: req.params.code}).populate({path:'activities'});
    res.status(200).send(data);
});

router.post('/updateStatus', async (req, res, next) => {
    var { code,status } = req.body;
    console.log(code)
    console.log(status)
    var shipment = await Shipment.findOne({
        $or: [
            { code: code },
        ]
    });
    console.log(shipment);
    if (!shipment){
        return res.status(200).send(false);
    }
    var bool = await ShipmentActivity.findOne({
        $or: [
            { status: status, shipment:shipment._id },
        ]
    });
    console.log(bool)
    if (bool){
        return res.status(200).send(false);
    }

    await ShipmentActivity.create({status:status, shipment: shipment._id});
    return res.status(200).send(true);
});

router.post('/create', async (req, res, next) => {
    let { to,username } = req.body;
    let code = parseInt(Math.random().toFixed(10).replace("0.",""));
    let from = 'Antalya';
    console.log(code);
    console.log(from);
    const shipment = await Shipment.create({to, username, code, from});
    await ShipmentActivity.create({shipment: shipment._id});
    return res.status(200).send({code:code});
});

module.exports = router;
