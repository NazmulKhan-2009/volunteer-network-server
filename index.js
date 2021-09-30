const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;

require("dotenv").config()




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnbwm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app=express();

app.use(bodyParser.json());
app.use(cors())


app.listen(5000)

app.get('/', (req, res)=>{
  res.send("Hello It is Working testing time to hospital api")
})



client.connect(err => {
  const events = client.db(`${process.env.DB_NAME}`).collection("events");
  const userActivities = client.db(`${process.env.DB_NAME}`).collection("activities");
    
    app.post("/addEvents" , (req, res) => {
      const event=req.body;
      console.log(event)
      events.insertMany(event)
      .then(result=>{
        console.log( result.insertedCount)
        result.send(result.insertedCount)
      })
    })
    
    app.get("/event",(req, res) => {
      events.find({})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })

    app.post('/enrolledevents' , (req, res)=>{
      const eventSelect=req.body;
     
      userActivities.insertOne(eventSelect)
      .then(result=>{
        console.log(result.insertedCount)
        res.send(result.insertedCount>0) 
      })
    })

    app.get("/eventenrolled" , (req, res)=>{
      console.log( req.query.email)

      userActivities.find({email: req.query.email})
      .toArray((err, documents)=>{
        res.send(documents)
      })
    })
    
    app.delete('/delete/:id' , (req, res)=>{
      // console.log( req.params.id)
      userActivities.deleteOne({_id: ObjectId(req.params.id) })
      .then((result)=>{
        console.log( result)
      })

    })  
    
     

  
});


app.listen(process.env.PORT || port)
