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
    

    //add serivce from the backend by the admin
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log(newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    })

    //load all the serices in the manage service section
    app.get('/allservices', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //delete a sercie by its id from the manage service section
    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    //creating new admin in the backend in makeadmin section
    app.post('/createadmin', (req, res) => {
        const adminInfo = req.body;
        console.log(adminInfo);
        adminCollection.insertOne(adminInfo)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    //identify if a user is admin or not to in the login section and set the user's role
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

    //load all the orders made by the user in the ordersadmin secton 
    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //update the status of client's order to show up in the client side from ordersadmin section
    app.patch('/update/:id', (req, res) => {
        console.log(req.body.status);
        orderCollection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { status: req.body.status }
        })
            .then(result => {
                console.log(result);
            })
    })

    //identify a user is admin or not to conditionally show the navlink in the navbar section
    app.get('/admin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, result) => {
                res.send(result)
            })
    })

    //load all the service in the home section to show it on the client side
    app.get('/serviceonhome', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //load the selected service from db and prepare it show on the book section
    app.get('/serviceonbook/:id', (req, res) => {
        console.log('id', req.params.id);
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => {
                res.send(result)
            })
    })

    //sending the payment information as well as the service info to the db from book section
    app.post('/addOrder', (req, res) => {
        console.log(req.body);
        const orderDetails = req.body;
        orderCollection.insertOne(orderDetails)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    //load all the orders by the loggedin user and show it on the booklist section
    app.get('/allorders', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, result) => {
            res.send(result);
        })
    })

    //add reviews by the user and store it on the db from clientreviews section
    app.post('/addreviews', (req, res) => {
        console.log(req.body);
        const review = req.body;
        reviewsCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    //load all the reviews and show those on the home page(reviews section)
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

