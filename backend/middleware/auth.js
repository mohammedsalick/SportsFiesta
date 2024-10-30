const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        console.log('Received token:', token); // Log the received token

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Log the decoded token
            req.user = decoded.user;

            if (roles.length && !roles.includes(req.user.role)) {
                console.log('User role not authorized:', req.user.role, 'Required roles:', roles);
                return res.status(403).json({ msg: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error('Token verification error:', err);
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
};
