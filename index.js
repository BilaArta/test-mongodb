const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

mongoose.Promise=global.Promise;

const schema = new mongoose.Schema({
    name: String,
    age: Number
})

const User = mongoose.model('User', schema);

const newUser = new User({name: "Bila", age: 22})

async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Db connected");
        
        const db = mongoose.connection;
        
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
        // we're connected!
            console.log('db still connected');
            newUser.save(function (err, newUser) {
                if (err) return console.error(err);
                
              });
        });
    } catch (error) {
        console.log(error);
    } finally {
        mongoose.disconnect()
    }
}

app.get('/', (req,res) => {
    
    connectDb()
    
    res.send('Hello World')
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log("server running on port : " + PORT));