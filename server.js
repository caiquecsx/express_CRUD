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
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.set('view engine', 'ejs')

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray( (err, results) => {
            if (err) return console.log(err)

            res.render('index.ejs', {quotes: results})
        })
    })
    app.post('/quotes', (req, res) => {
        db.collection('quotes').save(req.body, (err, result) =>{
            if (err) return console.log(err)

            console.log('saved to database')
            res.redirect('/')
        })
        console.log(req.body)
    })
    app.put('/quotes', (req, res) => {
        db.collection('quotes')
            .findOneAndUpdate({name: 'Yoda'}, {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                sort: {_id: -1},
                upsert: true
            }, (err, result) =>{
                if(err) return res.send(err)
                res.send(result)
            })
    })
})

