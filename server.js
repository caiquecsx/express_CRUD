const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()


MongoClient.connect('mongodb://localhost:27017/', (err, database) => {
    if (err) return console.log(err)
    
    const db = database.db('star-wars-quotes')

    app.listen(3000, function(){
        console.log('listening 3000')
    })

    app.use(bodyParser.urlencoded({extended: true}))

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    })
    app.post('/quotes', (req, res) => {
        db.collection('quotes').save(req.body, (err, result) =>{
            if (err) return console.log(err)

            console.log('saved to database')
            res.redirect('/')
        })
        console.log(req.body)
    })
})

