const asyncHandler = require('express-async-handler')
const db = require('../utils/dbConnection')


exports.createMovie = asyncHandler(
    async (req,res) => {

        // const result1 = await cloudinary.uploader.upload(req.files['imageUrl'][0].path)
        // const result2 = await cloudinary.uploader.upload(req.files['videoUrl'][0].path, { resource_type: 'video' })

       const sql = "INSERT INTO movie(`title`,`cast`,`cprice`,`type`,`imageUrl`,`trailerUrl`,`videoUrl`,`director`) VALUES (?)" 
       const values = [
        req.body.title,
        req.body.cast,
        req.body.price,
        req.body.type,
        req.body.imageUrl,
        req.body.trailerUrl,
        req.body.videoUrl,
        req.body.director
       ]

       db.query(sql,[values],(err,data) => {
        if(err) return res.status(400).json(err.message)
        if(data){
            res.status(201).json({success:true,data})
        }
       })
    }
)

exports.updateMovie = asyncHandler(
    async (req,res) => {

        const movieId = req.params.id

        const movie = {
            title:req.body.title,
            price:req.body.price,
            type:req.body.type,
            director:req.body.director
        }

        
        
        const sql = `UPDATE movie SET title = '${movie.title}', price = '${movie.price}', type = '${movie.type}', director = '${movie.director}'  WHERE id = ${movieId}`;
        // execute the query
        db.query(sql, (error, results, fields) => {
        if (error) throw error.message;
        
        res.status(201).json({
            success:true,
            message:`Updated ${results.affectedRows} movie)`
        })
        });
    }
)

exports.deleteMovie = asyncHandler(
    async (req,res) => {
        const movieId = req.params.id

        const sql = `DELETE FROM movie WHERE id = ${movieId}`;
        
        db.query(sql, (error, results, fields) => {
        if (error) throw error;

        if(results.affectedRows === 0){
            res.status(400).json({
                success:false,
                message:`Deleted ${results.affectedRows} movie`
            })
        }else{
            res.status(201).json({success:true,message:`Deleted ${results.affectedRows} movie`});
        }
        });

    }
)

exports.allMovie = asyncHandler(
    async (req,res) => {
        const sql = "SELECT * FROM movie ORDER BY id DESC"
        db.query(sql,(err,data) => {
            if(err) return res.status(400).json(err.message)
        
            res.status(201).json({
                success:true,
                totalResults:data.length,
                data
            })
        })
    }
)
exports.movieById = asyncHandler(
    async (req,res) => {
        const sql  = `SELECT * FROM movie WHERE id="${req.params.id}"`
        db.query(sql,(err,data) => {
            if(err) return res.status(400).json(err.message)
            if(data.length !== 0){
                res.status(201).json({success:true,data})
            }else{
                res.status(404).json({
                    success:false,
                    message:"Movie not found"
                })
            }
        })
    }
)
exports.movieByType = asyncHandler(
    async (req,res) => {
        const sql = `SELECT * FROM movie WHERE type="${req.params.type}" ORDER BY release_date DESC`
        db.query(sql,(err,data) => {
            if(err) return res.status(400).json(err.message)
            if(data.length === 0){
                res.status(404).json({
                    success:false,
                    message:"Movie not found"
                })
            }else{
                res.status(201).json({
                    success:true,
                    data
                })
            }
        })
    }
)