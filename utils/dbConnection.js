const mysql = require('mysql2')

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE
})

connection.connect((err) => {
    if(err){
        console.log('Error in database connection'+JSON.stringify(err))
    }else{
        console.log('Databse connected successfully')
    }
})

module.exports = connection