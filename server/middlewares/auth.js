import jwt from 'jsonwebtoken';
import 'dotenv/config'
export const requireSignin = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "You must be signed in" });
    }
}