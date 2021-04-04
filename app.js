const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

//db connection
require('./config/db');

//including routers
const shipmentRouter = require('./routes/shipment');
const branchRouter = require('./routes/branch');

//reading parameter
app.use(express.urlencoded({extended:true}));

const path = require('path');
app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req,res) => {
    var payload = {
        pageName: 'Ana Sayfa',
        pageTitle: 'Yurtdışı Kargo',
        page: 'home'
    }
    res.status(200).render("home", payload);
});

app.get('/campaigns', (req,res) => {
    var payload = {
        pageName: 'Kampanyalar',
        pageTitle: 'Kampanyalar | Yurtdışı Kargo',
        subTitle: 'Kampanyalar',
        page: 'campaigns'
    }
    res.status(200).render("sub_page", payload);
});

app.get('/carier', (req,res) => {
    var payload = {
        pageName: 'Kariyer',
        pageTitle: 'Kariyer | Yurtdışı Kargo',
        subTitle: 'Kurum Kültürümüz',
        page: 'carier'
    }
    res.status(200).render("sub_page", payload);
});

app.use('/shipment',shipmentRouter);
app.use('/branch',branchRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is active');
})