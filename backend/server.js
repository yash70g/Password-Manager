const express = require('express')
const dotenv=require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
var cors = require('cors')
dotenv.config();

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const dbName = 'passOP';
client.connect();

const app = express()
const port = 3000;
app.use(bodyParser.json())
app.use(cors())

app.get('/', async(req, res) => {
    const db=client.db(dbName)
    const collection = db.collection('Password');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})
    //Save a password
app.post('/', async(req, res) => {
    const password=req.body;
    const db=client.db(dbName)
    const collection = db.collection('Password');
    const findResult = await collection.insertOne(password);
    res.json({success:true,result:findResult})
})
app.delete('/', async(req, res) => {
    const password=req.body;
    const db=client.db(dbName)
    const collection = db.collection('Password');
    const findResult = await collection.deleteOne(password);
    res.json({success:true,result:findResult})
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
