const dotenv = require('dotenv').config();
const express = require('express');
const middleware = require('./middleware')

const app = express();
const session = require("express-session");

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

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: true
}));

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

app.get('/admin', middleware.adminRedirect, (req,res) => {
    var payload = {
        pageName: 'Admin Page',
        pageTitle: 'Yurtdışı Kargo',
        page: 'admin'
    }
    res.status(200).render("admin", payload);
});

app.get("/admin/dashboard",  middleware.requireLogin, (req, res, next) => {
    res.locals.session = req.session;
    var payload = {
        pageTitle: "Dashboard",
        branchLoggedIn: req.session.user,
        branchLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("dashboard", payload);
})


app.use('/shipment',shipmentRouter);
app.use('/branch',branchRouter);


app.listen(process.env.PORT, () => {
    console.log('Server is active');
})