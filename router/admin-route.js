const express = require('express')
const authMiddleware = require("../middleware/auth-middleware")
const adminMiddleware = require("../middleware/admin-middleware")
const router = express.Router()

router.get("/welcome",authMiddleware,adminMiddleware, (req, res)=>{


    res.status(200).json({
        message: "welcome to admin Page."
    })
})

module.exports = router;