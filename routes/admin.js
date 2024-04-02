const express = require('express')
const router = express.Router()

router.get('/', (req, res)=>{
    res.render("./admin/index")
})


router.get('/posts', (req,res)=>{
    res.send("admin dos posts")
})

module.exports = router