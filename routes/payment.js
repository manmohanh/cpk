const { createOrder, paymentVerification, orderHistory, getTotalByMonth, getTotal, getTotalCurrentMonth } = require('../controllers/payment')

const router = require('express').Router()

router.post('/createOrder',createOrder)
router.post('/paymentVerification',paymentVerification)
router.get('/orderHistory/:user_id',orderHistory)
router.post('/totalmonth',getTotalByMonth)
router.get('/total',getTotal)
router.get('/totalCurrentMonth',getTotalCurrentMonth)


module.exports = router