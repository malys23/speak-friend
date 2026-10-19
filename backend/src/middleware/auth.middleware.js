import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: 'No token provided'});
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token){
        return res.status(401).json({ message: 'Invalid token format'});
    }

    try{
        req.user = verifyToken(token);
    } catch (err) {
        if(err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if(err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError'){
            return res.status(401).json({ message: 'Invalid token' });
        }
        return next(err);
    }

    next();
};

export default authMiddleware;