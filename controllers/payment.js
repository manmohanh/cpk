const Razorpay = require('razorpay')
const asyncHandler = require('express-async-handler')
const db = require('../utils/dbConnection')
const crypto = require('crypto')


var instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

exports.createOrder = asyncHandler(
    async (req,res) => {

    const {amounts,receipts} = req.body

    var options = {
    amount: amounts * 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: receipts
        };
        const order = await instance.orders.create(options)
        const { id,amount, receipt } = order
        res.status(201).json({
            Success:true,
            id,
            amount,
            receipt
        })
    }
)

exports.paymentVerification = asyncHandler(
    async (req,res) => {

        const {razorpay_payment_id,razorpay_order_id,razorpay_signature,user_id,product_id} = req.body    

        const body=razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', 'goM82tSl3QbcGyCqMijtDSrp')
                                      .update(body.toString())
                                      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    
    if(isAuthentic){
        const sql = "INSERT INTO payment_detail(`payment_id`,`order_id`,`signature`,`user_id`,`product_id`) VALUES (?)"
        const values = [
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            user_id,
            product_id 
        ]

        db.query(sql,[values],(err,data) => {
            if(err) return res.json(err.message)
            if(data){
                res.status(201).json({
                    success:true,
                    message:"Ordered Successfully"
                })
            }
        })
    }
    else{
        res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }
                              
    }
)

exports.orderHistory = asyncHandler(
    async (req,res) => {
        
        db.query("SELECT orders.order_id,movie.title,movie.price,orders.order_date FROM orders INNER JOIN movie ON movie.id = orders.movie_id WHERE user_id=? ",req.params.user_id,(err,data) => {
            if(err) throw err.message
            res.status(201).json({
                success:true,
                data
            })
        })
    }
)
exports.getTotal = asyncHandler(
    async (req,res) => {
        db.query(`SELECT SUM(movie.price) FROM orders INNER JOIN movie ON movie.id = orders.movie_id`,(err,result) => {
            if(err) throw err;
            console.log(result)
            res.status(201).json({
                success:true,
                total:result[0]['SUM(movie.price)']
            })
        }) 
    }
)
exports.getTotalByMonth = asyncHandler(
    async (req,res) => {

        const {month,year} = req.body
      
        db.query(`SELECT SUM(movie.price) FROM orders INNER JOIN movie ON movie.id = orders.movie_id WHERE MONTH(orders.order_date) = '${month}' AND YEAR(orders.order_date) = '${year}'`,(err,result) => {
            if(err) throw err;
            console.log(result)
            res.status(201).json({
                success:true,
                total:result[0]['SUM(movie.price)']
            })
        })
    } 
)

exports.getTotalCurrentMonth = asyncHandler(
    async (req,res) => {
        db.query("SELECT SUM(movie.price) FROM orders INNER JOIN movie ON movie.id = orders.movie_id WHERE MONTH(orders.order_date) = MONTH(NOW()) AND YEAR(orders.order_date) = YEAR(NOW())",(err,result) => {
            if(err) throw err;
            console.log(result)
            res.status(201).json({
                success:true,
                total:result[0]['SUM(movie.price)']
            })
        })
    } 
)