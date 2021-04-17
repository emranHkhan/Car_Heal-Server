const express = require('express');
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
require('dotenv').config()
const cors = require('cors');

const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8dyv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("carheal").collection("services");
    const adminCollection = client.db("admindb").collection("admin");
    const orderCollection = client.db("ordersdb").collection("orders");
    const reviewsCollection = client.db("reviewsdb").collection("reviews");

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log(newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allservices', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    app.post('/createadmin', (req, res) => {
        const adminInfo = req.body;
        console.log(adminInfo);
        adminCollection.insertOne(adminInfo)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.status);
        orderCollection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { status: req.body.status }
        })
            .then(result => {
                console.log(result);
            })
    })

    app.get('/admin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, result) => {
                res.send(result)
            })
    })

    app.get('/serviceonhome', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/serviceonbook/:id', (req, res) => {
        console.log('id', req.params.id);
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => {
                res.send(result)
            })
    })

    app.post('/addOrder', (req, res) => {
        console.log(req.body);
        const orderDetails = req.body;
        orderCollection.insertOne(orderDetails)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allorders', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, result) => {
            res.send(result);
        })
    })

    app.post('/addreviews', (req, res) => {
        console.log(req.body);
        const review = req.body;
        reviewsCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/loadreviews', (req, res) => {
        reviewsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);

