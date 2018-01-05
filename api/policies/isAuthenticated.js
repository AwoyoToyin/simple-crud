module.exports = function (req, res, next) {
    var token = req.headers['authorization'];
    if (!token || token !== 'JWT jwttoken') {
        return res.unauthorized(null, null, 'You must provide a valid application token');
    }

    next();
};
