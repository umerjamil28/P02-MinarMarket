exports.verifyAPIRequest = async (req, res, next) => { 
    const allowedOrigin = "https://travelwithdario.com";
    const origin = req.headers.origin || req.headers.referer;

    if (origin !== allowedOrigin) { 
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    next();
}