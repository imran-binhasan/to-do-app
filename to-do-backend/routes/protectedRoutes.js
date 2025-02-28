const express = require('express');
const {isAuthenticated} = require('../middleware/authMiddleware');

const router = express.Router();

// Access Dashboard API
router.get('/dashboard', isAuthenticated, (req,res) => {
    res.json({message: 'Welcome to your dashboard!', user:req.user})
})

module.exports = router;