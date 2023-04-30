const { 
    allUsers,
    login, 
    register, 
    forgetPassword, 
    getAllUsers, 
    resetPassword
} = require('../controllers/user')

const router = require('express').Router()

router.post('/login',login)
router.post('/register',register)
router.post('/forgetpassword',forgetPassword)
router.put('/resetPassword',resetPassword)
router.get('/getAllUsers',getAllUsers)

module.exports = router