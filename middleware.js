exports.requireLogin = async (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    else {
        return res.redirect('/admin');
    }
};

exports.adminRedirect = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/admin/dashboard');
    }else {
        return next();
    }
}