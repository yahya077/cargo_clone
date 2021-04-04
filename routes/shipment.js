const router = require('express').Router();
const Shipment = require('../schema/Shipment');

router.get('/:code', async (req, res, next) => {
    var data = await Shipment.find({code: req.params.code}).populate({path:'activities'});
    res.status(200).send(data);
});

module.exports = router;
