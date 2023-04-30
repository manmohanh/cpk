const router = require('express').Router()
const upload = require('../utils/multer')
const { allMovie, movieByType, createMovie, movieById, updateMovie, deleteMovie } = require('../controllers/movie')

router.get('/movies',allMovie)
router.get('/movieById/:id',movieById)
router.get('/movieByType/:type',movieByType)
router.post('/createMovie',upload.fields([
    {name:'imageUrl',maxCount:1},
    {name:'videoUrl',maxCount:1}
])
,createMovie)
router.put('/update/:id',updateMovie)
router.delete('/delete/:id',deleteMovie)

module.exports = router