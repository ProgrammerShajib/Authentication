
const jwt = require("jsonwebtoken")
const authMiddleware = (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access Denied. No token provided. Please login to continue."
        })
    }

    // Decode the token 

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // console.log(decodedTokenInfo)

        req.userInfo = decodedTokenInfo;
     
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Access Denied. No token provided. Please login to continue."
        })
    }

    // console.log('auth middleware is called!')
    next();
}

module.exports = authMiddleware;