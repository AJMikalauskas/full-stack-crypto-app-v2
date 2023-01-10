// Adding this middleware to handle a CORS issue when using fetch, to
// send/get the cookie, you need to have this in your request headers.
const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req,res,next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', "http://localhost:3002")
        res.header('Access-Control-Allow-Credentials', true);
    }
    //res.status(200);
    next();
}

module.exports = credentials;