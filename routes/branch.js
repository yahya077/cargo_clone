var distance = require('google-distance');
distance.apiKey = process.env.GOOGLE_API_KEY;
const router = require('express').Router();
const Branch = require('../schema/Branch');

router.get('/', async (req, res, next) => {
    var data = await Branch.find();
    res.status(200).send(data);
});

router.get('/:id', async (req, res, next) => {
    var data = await Branch.findById(req.params.id);
    res.status(200).send(data);
});

router.get('/key/:name', async (req, res, next) => {
    console.log(req.params.name);
    var data = await Branch.find({name: {$regex: req.params.name, $options: "i"}});
    res.status(200).send(data);
});

router.get('/:from/:to/calculate', async (req, res, next) => {
    var to = await Branch.findById(req.params.to);
    var from = await Branch.findById(req.params.from);
    if(req.params.to == req.params.from){
        res.status(200).send({success: false, data: 'Göndereceğiniz şubeyi farklı seçiniz!'})
    }
    await distance.get({
        origin:from.location.coordinates[1]+','+from.location.coordinates[0],
        destination:to.location.coordinates[1]+','+to.location.coordinates[0]
    }, async function(err, data){
        if(((data.distanceValue / 100)) < 600){
            var price = '15'
        }else{
            var price = '25';
        }
        res.status(200).send({success: true, data: {price, to: to.name, from: from.name}});
    });
});

router.post('/login', async (req, res, next) => {
    var { code, pass} = req.body;
    var user = await Branch.findOne({
        $or: [
            { code: code },
            { pass: pass }
        ]
    })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).send(false);
        });
    if(user){
        await req.session.reload( function (err) {
            req.session.user = user;
            return res.redirect("/");
        });
        console.log(req.session.user);
        req.session.user = user;
        res.locals.session = req.session;
    }else {
        res.status(200).send(false);
    }
});

router.post('/updateProfile', async (req, res, next) => {
    var { name } = req.body;
    var branch = await Branch.findOne({
        $or: [
            { name: name },
        ]
    });
    if(!branch){
        req.session.user = await Branch.findOneAndUpdate(req.session.user._id,{name : name});
        res.locals.session = req.session;
        var payload = {
            pageTitle: "Dashboard",
            branchLoggedIn: req.session.user,
            branchLoggedInJs: JSON.stringify(req.session.user),
        };
        req.session.reload( function (err) {
            res.status(200).render("dashboard", payload);
        });
    }else {
        res.status(200).send(false);
    }
});

module.exports = router;
