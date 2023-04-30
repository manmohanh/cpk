const { sendEmail } = require('../utils/SendEmail')
const db = require('../utils/dbConnection')
const generateToken = require('../utils/index')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')


exports.register = asyncHandler(
    async (req,res) => {
    
            const { name, email, password } = req.body;
            db.query(
              'SELECT * FROM user WHERE email = ?',
              [email],
              (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                  res.status(409).send({success:false,message:'Email already registered'});
                } else {
                  bcrypt.hash(password, 10, (err, hash) => {
                    if (err) throw err;

                    db.query(
                      'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                      [name, email, hash],
                      (err, result) => {
                        if (err) throw err;
                        res.status(201).send({success:true,message:'User registered successfully'});
                      }
                    );
                  });
                }
              }
            );   
    }
)

exports.login = asyncHandler(
    async (req,res) => {

            const { email, password } = req.body;
            
            db.query(
              'SELECT * FROM user WHERE email = ?',
              [email],
              (err, result) => {
                if (err) throw err;
                if (result.length === 0) {
                  res.status(401).send('Invalid email or password');
                } else {
                  bcrypt.compare(password, result[0].password, (err, match) => {
                    if (err) throw err;
                    if (!match) {
                      res.status(401).send('Invalid email or password');
                    } else {
                      const token = generateToken(result[0].email);
                      const {id,name,email} = result[0]
                      console.log(result)
                      res.status(200).json({ 
                        success:true,
                        data:{
                          id,
                          name,
                          email
                        },
                        token 
                      });
                    }
                  });
                }
              }
            );

    }
)


exports.forgetPassword = asyncHandler(
    async (req,res) => {
        const {email} = req.body

       db.query(
        'SELECT * FROM user WHERE email = ?',
        [email],(err,result) => {
          if(err) throw err;

          if(result.length === 0){
            return res.status(400).json("email not found")
          }

          const resetToken = Math.random().toString(36).slice(2);
          const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now


          db.query(
            'UPDATE user SET reset_token = ?, reset_token_expiration = ? WHERE email = ?', [resetToken, resetTokenExpiration, email],
            (err) => {
              if(err) throw err;
              const url = ""
              const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore`

              sendEmail(email,"Reset Password",message)

              res.status(201).json({success:true,message:"email sent",resetToken})
            }
          )
        }
       )
    }
)

exports.resetPassword = asyncHandler(
  async (req,res) => {
    
    const { resetToken, newPassword } = req.body;

    db.query('SELECT * FROM user WHERE reset_token = ? AND reset_token_expiration > ?', [resetToken, new Date()], (err, results) => {
      if (err) throw err;
  
      if (results.length === 0) {
        return res.status(400).send('Invalid or expired reset token');
      }
  
      db.query('UPDATE user SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?', [newPassword, resetToken], (err) => {
        if (err) throw err;
  
        res.status(201).json({success:true,message:'Password reset successfully'});
      });
    });
    

  }
)

exports.getAllUsers = asyncHandler(
  async (req,res) => {
    db.query(
      "SELECT * FROM user",
      (err,result) => {
        if(err) throw err.message;
        res.status(201).json({
          success:true,
          totalResults:result.length,
          result
        })
      }
    )
  }
)
 
